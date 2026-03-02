/**
 * Examples Page Route - /examples
 * Redirects to /demo (unified demo page)
 */

import type { GetServerSideProps } from 'next';

// Server-side redirect to avoid useRouter SSG issues
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/demo',
      permanent: true,
    },
  };
};

export default function ExamplesRoute() {
  // This won't render due to server-side redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <p className="text-gray-400">Redirecting to live demo...</p>
    </div>
  );
}
