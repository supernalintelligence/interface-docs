/**
 * Chat Adapters Example
 *
 * NOTE: This page is deprecated. Redirects to /demo.
 */

import { GetServerSideProps } from 'next';

export default function ChatAdaptersExample() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/demo',
      permanent: true,
    },
  };
};
