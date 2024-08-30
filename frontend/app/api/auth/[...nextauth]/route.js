import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Call your FastAPI backend to validate the user's credentials
                try {
                    const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });


                    const data = await res.json();


                    // If login is successful, return user object
                    if (res.ok && data.access_token) {

                        return {
                            username: credentials.username,
                            accessToken: data.access_token,
                            tokenType: data.token_type,
                        };
                    }

                    // If login fails, return null

                    return null;
                }
                catch (e) {
                    console.log(e);
                }

            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // Persist the access token in the JWT
            if (user) {
                token.username = user.username;
                token.accessToken = user.accessToken;
                token.tokenType = user.tokenType;
            }
            return token;
        },
        async session({ session, token }) {
            // Make the access token available in the session
            session.accessToken = token.accessToken;
            session.tokenType = token.tokenType;
            session.username = token.username;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
