'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import BookmarksIcon from '@mui/icons-material/Bookmarks'; import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import TheatersIcon from '@mui/icons-material/Theaters';
import ChatIcon from '@mui/icons-material/Chat';
import { usePathname } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';

function DesktopSidebar() {
    const pathname = usePathname();
    const [homeActive, setHomeActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [recommendActive, setRecommendActive] = useState(false);
    const [assistantActive, setAssistantActice] = useState(false);

    // Handle active link styles
    useEffect(() => {
        if (pathname === '/') {
            setHomeActive(true);
            setSearchActive(false);
            setRecommendActive(false);
            setAssistantActice(false);

        } else if (pathname === '/movies') {
            setHomeActive(false);
            setSearchActive(true);
            setRecommendActive(false);
            setAssistantActice(false);

        } else if (pathname === '/recommend') {
            setHomeActive(false);
            setSearchActive(false);
            setRecommendActive(true);
            setAssistantActice(false);

        }
        else if (pathname === '/assistant') {
            setHomeActive(false);
            setSearchActive(false);
            setRecommendActive(false);
            setAssistantActice(true);
        }



    }, [pathname]);
    return (
        <div className='hidden sm:block h-screen w-48 bg-neutral-800  text-slate-50 z-50 fixed'>

            <div className='flex gap-1 items-center p-4'>
                <TheatersIcon className='text-orange-400' />
                <Link href='/' className='text-xl text-white font-bold'>FlickFinder</Link>

            </div>
            <hr className='border-neutral-700' />
            <div className='p-4 text-sm opacity-70 mt-4'>Menu</div>
            <div className='flex flex-col gap-4'>
                <Link href='/' className={`flex gap-2 items-center text-md p-4 ${homeActive ? 'opacity-100 bg-neutral-700 border-l-4 rounded border-l-orange-400' : 'opacity-80 hover:opacity-100'}`}>
                    <BookmarksIcon className={`sidebar-link text-xl ${homeActive ? 'text-orange-400' : ''}`} />
                    <h2>Watchlist</h2>
                </Link>

                <Link href='/movies' className={`flex gap-2 items-center text-md p-4 ${searchActive ? 'opacity-100 bg-neutral-700 border-l-4 rounded border-l-orange-400' : 'opacity-80 hover:opacity-100'}`}>
                    <SavedSearchIcon className={`sidebar-link text-xl ${searchActive ? 'text-orange-400' : ''}`} />
                    <h2>Find Movies</h2>
                </Link>
                <Link href='\recommend' className={`flex gap-2 items-center text-md p-4 ${recommendActive ? 'opacity-100 bg-neutral-700 border-l-4 rounded border-l-orange-400' : 'opacity-80 hover:opacity-100'}`}>
                    <SettingsSuggestIcon className={`sidebar-link text-xl ${recommendActive ? 'text-orange-400' : ''}`} />
                    <h2>Recommendations</h2>
                </Link>
                <Link href='\assistant' className={`flex gap-2 items-center text-md p-4 ${assistantActive ? 'opacity-100 bg-neutral-700 border-l-4 rounded border-l-orange-400' : 'opacity-80 hover:opacity-100'}`}>
                    <ChatIcon className={`sidebar-link text-xl ${assistantActive ? 'text-orange-400' : ''}`} />
                    <h2>AI Assistant</h2>
                </Link>

            </div>
            <SignOutButton />

        </div>
    )
}

export default DesktopSidebar