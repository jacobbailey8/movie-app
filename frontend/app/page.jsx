'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();

  status === 'loading' && <p>Loading...</p>

  if (status === "loading") {
    return <p>Loading...</p>;
  } else {
    return <p>{session.username}'s dashboard</p>;
  }
}
