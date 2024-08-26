'use client';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


function MobileSidebar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const sidebarRef = useRef(null);


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

        <div className='sm:hidden'>
            {/* head */}
            <div className='flex w-screen justify-between p-4 bg-slate-800 text-slate-300'>
                <h2 className=''>Movie App</h2>
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
                className={`z-50 fixed top-0 right-0 w-64 h-screen bg-slate-800 text-slate-300 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                <div className='p-4'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl'>Menu</h2>
                        <CloseIcon onClick={toggleMenu} />
                    </div>
                    <div className='flex flex-col gap-5 mt-8'>
                        <Link href='/'>Home</Link>
                        <Link href='/movies'>Movies</Link>
                        <Link href='/recommend'>Recommend</Link>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default MobileSidebar