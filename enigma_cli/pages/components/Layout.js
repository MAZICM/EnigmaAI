import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const Layout = ({ children }) => {
    const router = useRouter();
    const isActive = (pathname) => router.pathname === pathname;

    return (
        <div>
            <nav className="bg-blue-400 p-2 flex items-center justify-center">
                <Link href="/" passHref>
                    <div className="text-white mr-4 cursor-pointer">Home</div>
                </Link>

                {['Dataset', 'Train', 'Validation', 'Live_Test', 'Video_Test'].map((page, index) => (
                    <Link key={index} href={`/${page}`} passHref>
                        <div  className={`text-white mr-4 cursor-pointer ${
                                isActive(`/${page}`) ? 'border-b-2 border-white font-bold' : ''
                            }`} >
                            {page}
                        </div>
                    </Link>
                ))}
            </nav>

            <div className="p-4">{children}</div>
        </div>
    );
};

export default Layout;
