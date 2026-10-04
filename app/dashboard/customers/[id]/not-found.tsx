import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">
        Customer not found
      </h2>

      <p className="text-gray-500">
        The customer you are looking for does not exist.
      </p>

      <Link
        href="/dashboard/customers"
        className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
      >
        Back to Customers
      </Link>
    </main>
  );
}