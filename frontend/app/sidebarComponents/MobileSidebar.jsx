'use client';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import TheatersIcon from '@mui/icons-material/Theaters';
import { usePathname } from 'next/navigation';



function MobileSidebar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const sidebarRef = useRef(null);
    const pathname = usePathname();
    const [homeActive, setHomeActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [recommendActive, setRecommendActive] = useState(false);


    // Handle active link styles
    useEffect(() => {
        if (pathname === '/') {
            setHomeActive(true);
            setSearchActive(false);
            setRecommendActive(false);
        } else if (pathname === '/movies') {
            setHomeActive(false);
            setSearchActive(true);
            setRecommendActive(false);
        } else if (pathname === '/recommend') {
            setHomeActive(false);
            setSearchActive(false);
            setRecommendActive(true);
        }



    }, [pathname]);


    const toggleMenu = () => {
        setDrawerOpen(!drawerOpen);
    }

    const closeMenu = () => {
        setDrawerOpen(false);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            closeMenu();
        }
    };

    useEffect(() => {
        if (drawerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [drawerOpen]);
    return (

        <div className='sm:hidden sticky top-0 z-40'>
            {/* head */}
            <div className='flex w-screen justify-between p-4 bg-neutral-800 text-slate-300'>
                <div className='flex items-center gap-1'>
                    <TheatersIcon className='text-orange-400' />

                    <Link href='/' className='text-white font-bold'>FlickFinder</Link>

                </div>
                <MenuIcon onClick={toggleMenu} />
            </div>

            {/* Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeMenu}
                ></div>
            )}

            {/* drawer */}
            <div ref={sidebarRef}
                className={`z-50 fixed top-0 right-0 w-64 h-screen bg-neutral-800 text-slate-50 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                <div className=''>
                    <div className='flex justify-between items-center p-4'>
                        <h2 className='text-md ml-2 opacity-80'>Menu</h2>
                        <CloseIcon onClick={toggleMenu} />
                    </div>
                    <div className='flex flex-col gap-5 mt-4'>

                        <Link href='/' className={`flex gap-2 items-center text-lg p-4 ${homeActive ? 'opacity-100 bg-neutral-700 border-r-4 rounded border-r-orange-400' : 'opacity-80'}`}>
                            <HomeIcon className={`sidebar-link text-xl ${homeActive ? 'text-orange-400' : ''}`} />
                            <h2>Home</h2>
                        </Link>

                        <Link href='/movies' className={`flex gap-2 items-center text-lg p-4 ${searchActive ? 'opacity-100 bg-neutral-700 border-r-4 rounded border-r-orange-400' : 'opacity-80'}`}>
                            <SavedSearchIcon className={`sidebar-link text-xl ${searchActive ? 'text-orange-400' : ''}`} />
                            <h2>Find Movies</h2>
                        </Link>
                        <Link href='/recommend' className={`flex gap-2 items-center text-lg p-4 ${recommendActive ? 'opacity-100 bg-neutral-700 border-r-4 rounded border-r-orange-400' : 'opacity-80'}`}>
                            <SettingsSuggestIcon className={`sidebar-link text-xl ${recommendActive ? 'text-orange-400' : ''}`} />
                            <h2>Recommendations</h2>
                        </Link>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default MobileSidebar