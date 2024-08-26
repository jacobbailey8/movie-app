import Link from 'next/link'
function DesktopSidebar() {
    return (
        <div className='hidden sm:block h-screen w-48 bg-slate-800 p-4 text-slate-300 z-50 fixed'>
            <h1 className='text-2xl'>Movie App</h1>

            <div className='flex flex-col gap-4 mt-8'>
                <Link href='/'>Home</Link>
                <Link href='/movies'>Movies</Link>
                <Link href='/recommend'>Recommend</Link>

            </div>

        </div>
    )
}

export default DesktopSidebar