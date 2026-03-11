/**
 * Examples Page Route - /examples
 * Redirects to /demo (unified demo page)
 */

import { GetServerSideProps } from 'next';

export default function ExamplesRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <p className="text-gray-400">Redirecting to live demo...</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/demo',
      permanent: true,
    },
  };
};
