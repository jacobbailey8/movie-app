// app/ClientProvider.js

'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ClientProvider({ children }) {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/auth');
            }
        };

        checkSession();
    }, [router]);

    return <SessionProvider>{children}</SessionProvider>;
}
