import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Image from 'next/image';
import InvoiceStatus from '@/app/ui/invoices/status';
import {
  formatCurrency,
  formatDateToLocal,
} from '@/app/lib/utils';

import {
  fetchCustomerById,
  fetchCustomerInvoices,
} from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Customer',
};
export default async function Page(props: {
    params: Promise<{ id: string }>;
  }) {
    const params = await props.params;
    const id = params.id;
    
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      notFound();
    }
  
    const [customer, invoices] = await Promise.all([
      fetchCustomerById(id),
      fetchCustomerInvoices(id),
    ]);
  
    if (!customer) {
      notFound();
    }
  
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            {
              label: 'Customers',
              href: '/dashboard/customers',
            },
            {
              label: customer.name,
              href: `/dashboard/customers/${id}`,
              active: true,
            },
          ]}
        />

        <div className="mb-6 flex items-center gap-4 rounded-md bg-gray-50 p-6">
          <Image
            src={customer.image_url}
            alt={`${customer.name}'s profile picture`}
            width={64}
            height={64}
            className="rounded-full"
          />

          <div>
            <h1 className="text-2xl font-semibold">
              {customer.name}
            </h1>
            <p className="text-gray-500">
              {customer.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total invoices</p>
            <p className="text-2xl font-semibold">
              {customer.total_invoices}
            </p>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total pending</p>
            <p className="text-2xl font-semibold">
              {customer.total_pending}
            </p>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total paid</p>
            <p className="text-2xl font-semibold">
             {customer.total_paid}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Invoice history
          </h2>

          {invoices.length === 0 ? (
            <div className="rounded-md bg-gray-50 p-6 text-center">
              <p className="text-gray-500">
                This customer has no invoices yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md bg-gray-50">
              <table className="w-full text-left text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b last:border-none"
                    >
                      <td className="px-6 py-4">
                        {formatDateToLocal(invoice.date)}
                      </td>

                      <td className="px-6 py-4">
                        {formatCurrency(invoice.amount)}
                      </td>

                      <td className="px-6 py-4">
                        <InvoiceStatus status={invoice.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    );
  }