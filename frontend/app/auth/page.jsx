'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TheatersIcon from '@mui/icons-material/Theaters';



export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const res = await signIn('credentials', {
                    username,
                    password,
                    redirect: false,
                });

                if (res.ok) {
                    setError(false);
                    router.push('/');
                } else {
                    setError(true);

                }
            }
            catch (e) {

                console.error(e);
            }

        } else {
            // Handle sign-up
            const res = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (res.ok) {
                setError(false);
                const data = await res.json();
                console.log('Sign-up successful', data);

                // Use NextAuth.js to sign in the user using the credentials provider
                const result = await signIn("credentials", {
                    redirect: false,
                    username,
                    password,
                });

                if (result.ok) {
                    setError(false);
                    window.location.href = "/";
                } else {
                    setError(true);
                    console.error("Failed to sign in after sign-up");
                }

            } else {
                setError(true);
                console.error('Sign-up failed');
            }
        }
    };

    return (
        <div className=' bg-neutral-200 sm:flex'>
            <div className='flex items-center gap-1 bg-neutral-800 p-2 py-3 sm:hidden'>
                <TheatersIcon className='text-orange-400' />
                <h1 className='text-xl font-semibold text-neutral-200'>FlickFinder</h1>
            </div>
            <div className='flex flex-col items-center min-h-screen min-w-screen sm:min-w-[50%] pt-20 sm:pt-36 bg-neutral-200 m-0'>
                {/* <div className='hidden sm:block top-0 left-0 w-full bg-black p-4'>FlickFinder</div> */}


                <h1 className='text-3xl font-bold'>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
                <h6 className='opacity-75 text-sm mt-4'> {isLogin ? 'Enter your account details below' : null}</h6>
                <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4'>

                    <input
                        className=" p-4 w-56 mt-6 text-neutral-800 bg-neutral-100 rounded-lg placeholder-neutral-500 focus:outline-none"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    {!isLogin && (
                        <input
                            className=" p-4 w-56 text-neutral-800 bg-neutral-100 rounded-lg placeholder-neutral-500 focus:outline-none"

                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    )}
                    <input
                        className=" p-4 w-56 text-neutral-800 bg-neutral-100 rounded-lg placeholder-neutral-500 focus:outline-none "

                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button className='block text-neutral-200 bg-neutral-800 p-4 font-semibold rounded w-56 text-lg mt-4 ' type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className='mt-12 underline text-sm'>
                    {isLogin ? 'Create an account' : 'Log in'}
                </button>
                {(error && isLogin) && <p className='text-red-500 mt-4'>Failed to login</p>}
                {(error && !isLogin) && <p className='text-red-500 mt-4'>Failed to sign up</p>}

            </div>
            <div className="hidden bg-opacity-55 sm:block sm:justify-center sm:items-center sm:bg-black sm:min-h-screen sm:min-w-full sm:filter sm:brightness-50 sm:bg-cover sm:bg-center" style={{ backgroundImage: `url('https://designwithred.com/wp-content/uploads/2020/09/50-List-of-Best-Movie-Posters-2020-DesignWithRed.jpg')` }}>

            </div>

        </div>
    );
}
