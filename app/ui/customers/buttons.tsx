'use client';

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import {
  deleteCustomer,
  type DeleteCustomerState,
} from '@/app/lib/actions';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCustomer({
  id,
  query,
  currentPage,
}: {
  id: string;
  query: string;
  currentPage: number;
}) {
  const initialState: DeleteCustomerState = {
    message: null,
    success: false,
  };

  const deleteCustomerWithId = deleteCustomer.bind(
    null,
    id,
    query,
    currentPage,
  );

  const [state, formAction, isPending] = useActionState(
    deleteCustomerWithId,
    initialState,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (state.message) {
      dialogRef.current?.showModal();
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
        >
          <span className="sr-only">Delete customer</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
  
      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-error-title-${id}`}
        aria-describedby={`delete-error-message-${id}`}
        className="m-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl backdrop:bg-gray-900/50"
      >
        <h2
          id={`delete-error-title-${id}`}
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Cannot delete customer
        </h2>
  
        <p
          id={`delete-error-message-${id}`}
          className="mb-6 text-sm text-gray-600"
        >
          {state.message}
        </p>
  
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            OK
          </button>
        </div>
      </dialog>
    </>
  );
}