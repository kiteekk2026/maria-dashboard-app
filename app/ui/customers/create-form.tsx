'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import Image from 'next/image';
import { useActionState } from 'react';
import {
  createCustomer,
  CustomerState,
} from '@/app/lib/actions';

export default function Form() {
    const initialState: CustomerState = {
        message: null,
        errors: {},
      };
      
      const [state, formAction] = useActionState(
        createCustomer,
        initialState,
      );

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        
        {/* Customer Name */}
        <div className="mb-4">
            <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
            >
                Customer name
            </label>

            <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter customer name"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
            />
            <div
                id="name-error"
                aria-live="polite"
                aria-atomic="true"
            >
                {state.errors?.name &&
                    state.errors.name.map((error: string) => (
                    <p
                        className="mt-2 text-sm text-red-500"
                        key={error}
                    >
                        {error}
                    </p>
                ))}
            </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
            <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
            >
                 Email
            </label>

            <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter customer email"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
            />
            <div
                id="email-error"
                aria-live="polite"
                aria-atomic="true"
            >
                {state.errors?.email &&
                    state.errors.email.map((error: string) => (
                        <p
                            className="mt-2 text-sm text-red-500"
                            key={error}
                        >
                            {error}
                        </p>
                    ))}
                </div>

        </div>

{/* Customer Avatar */}
<fieldset>
  <legend className="mb-2 block text-sm font-medium">
    Choose an avatar
  </legend>

  <div className="flex flex-wrap gap-4">
    {[
      '/customers/amy-burns.png',
      '/customers/balazs-orban.png',
      '/customers/delba-de-oliveira.png',
      '/customers/evil-rabbit.png',
      '/customers/lee-robinson.png',
      '/customers/michael-novotny.png',
    ].map((image) => (
      <label
        key={image}
        className="cursor-pointer"
      >
        <input
          type="radio"
          name="image_url"
          value={image}
          className="peer sr-only"
          aria-describedby="avatar-error"
        />

        <Image
          src={image}
          alt="Customer avatar"
          width={64}
          height={64}
          className="rounded-full border-2 border-transparent peer-checked:border-blue-600"
        />
      </label>
    ))}
  </div>

  <div
    id="avatar-error"
    aria-live="polite"
    aria-atomic="true"
>
  {state.errors?.image_url &&
    state.errors.image_url.map((error: string) => (
      <p
        className="mt-2 text-sm text-red-500"
        key={error}
      >
        Please select an avatar.
      </p>
    ))}
</div>

<div aria-live="polite" aria-atomic="true">
  {state.message && (
    <p className="mt-2 text-sm text-red-500">
      {state.message}
    </p>
  )}
</div>

</fieldset>

      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>

        <Button type="submit">
          Create Customer
        </Button>
      </div>
    </form>
  );
}