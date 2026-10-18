'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { fetchCustomersPages } from '@/app/lib/data';
 
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
  .number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CustomerSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Please enter a customer name.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  image_url: z.enum([
    '/customers/amy-burns.png',
    '/customers/balazs-orban.png',
    '/customers/delba-de-oliveira.png',
    '/customers/evil-rabbit.png',
    '/customers/lee-robinson.png',
    '/customers/michael-novotny.png',
  ]),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
    // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    const customerExists = await sql.begin(async (tx) => {
      const customers = await tx`
        SELECT id
        FROM customers
        WHERE id = ${customerId}
        FOR UPDATE
      `;
  
      if (customers.length === 0) {
        return false;
      }
  
      await tx`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  
      return true;
    });
  
    if (!customerExists) {
      return {
        message: 'Customer not found. Failed to Create Invoice.',
      };
    }
  } catch (error) {
    console.error('Database Error:', error);
  
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData,
) {
  const validatedFields = CustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to Create Customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}
export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData,
) {
  const validatedFields = CustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to Update Customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    await sql`
      UPDATE customers
      SET name = ${name},
          email = ${email},
          image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/customers/${id}`);
  redirect('/dashboard/customers');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export type DeleteCustomerState = {
  message: string | null;
  success: boolean;
};
export async function deleteCustomer(
  id: string,
  query: string,
  currentPage: number,
  prevState: DeleteCustomerState,
  formData: FormData,
): Promise<DeleteCustomerState> {
  let redirectTo: string | null = null;
  try {
    const result = await sql.begin(async (tx) => {
      const customers = await tx`
        SELECT id
        FROM customers
        WHERE id = ${id}
        FOR UPDATE
      `;

      if (customers.length === 0) {
        return {
          message: 'Customer not found.',
          success: false,
        };
      }
      const invoices = await tx`
        SELECT COUNT(*) AS count
        FROM invoices
        WHERE customer_id = ${id}
      `;

      const invoiceCount = Number(invoices[0].count);

      if (invoiceCount > 0) {
        return {
          message: `Cannot delete this customer because they have ${invoiceCount} invoice(s).`,
          success: false,
        };
      }

      const deleted = await tx`
        DELETE FROM customers
        WHERE id = ${id}
        RETURNING id
      `;

      if (deleted.length === 0) {
        return {
          message: 'Customer not found.',
          success: false,
        };
      }

      return {
        message: null,
        success: true,
      };
    });

    if (!result.success) {
      return result;
    }
    
    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard');
    
    const totalPages = await fetchCustomersPages(query);
    
    const safePage = Math.min(
      Math.max(1, currentPage),
      Math.max(1, totalPages),
    );
    
    const params = new URLSearchParams();
    
    if (query) {
      params.set('query', query);
    }
    
    params.set('page', String(safePage));
    
    redirectTo = `/dashboard/customers?${params.toString()}`;
  } catch (error) {
    console.error('Database Error:', error);

    return {
      message: 'Database Error: Failed to delete customer.',
      success: false,
    };
  }
    if (redirectTo) {
      redirect(redirectTo);
    }
  
    return {
      message: null,
      success: true,
    };
}
 
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function deleteInvoice(id: string) {
  //throw new Error('Failed to Delete Invoice');

    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}