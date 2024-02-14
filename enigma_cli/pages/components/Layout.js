import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const Layout = ({ children }) => {
    const router = useRouter();

    const isActive = (pathname) => {
        return router.pathname === pathname;
    };
    const getPageMargin = () => {
        if (isActive('/Dataset')) {
          return 'ml-6'; // Hardcoded margin for /Dataset
        } else if (isActive('/Train')) {
          return 'ml-5'; // Hardcoded margin for /Train
        } else if (isActive('/Validation')) {
          return 'ml-3'; // Hardcoded margin for /Validation
        } else if (isActive('/Live_Test')) {
          return 'ml-1'; // Hardcoded margin for /Live_Test
        } else if (isActive('/Video_Test')) {
          return 'ml-0'; // Hardcoded margin for /Video_Test
        } else {
          return `w-10 h-10 ml-${Math.floor(Math.random() * 6) + 1}`; // Random margin for inactive pages
        }
      };
      
      // Inside your component's JSX
      <div className={`rounded-full h-5 w-5 bg-primary ${getPageMargin()}`}></div>
      
    return (
        <div>
            <nav className="bg-sec p-4">
                <div className="flex items-center justify-center mx-auto ml-20">
                    <div>
                        <Link href="/" className="text-white flex items-center">
                            <div className="rounded-full h-20 w-20 bg-primary">
                                <div className="rounded-full h-10 w-10 bg-sec ml-5 mt-4">
                                <div className={`rounded-full h-5 w-5 bg-primary ${getPageMargin()}`}></div>
                                </div>
                            </div>
                            <span className="ml-2 font-bold text-3xl">Home</span>
                        </Link>
                    </div>
                    {/* Add any additional elements, user info, or settings here */}
                </div>
            </nav>

            <div className="flex justify-center mt-8 text-2xl">
                <Link href="/Dataset">
                    <p className={`text-primary p-8 rounded-3xl bg-sec mx-2 ${isActive('/Dataset') ? 'bg-white' : 'hover:bg-white'}`}>Dataset</p>
                </Link>
                <Link href="/Train">
                    <p className={`text-primary p-8 rounded-3xl bg-sec mx-2 ${isActive('/Train') ? 'bg-white' : 'hover:bg-white'}`}>Training</p>
                </Link>
                <Link href="/Validation">
                    <p className={`text-primary p-8 rounded-3xl bg-sec mx-2 ${isActive('/Validation') ? 'bg-white' : 'hover:bg-white'}`}>Validation</p>
                </Link>
                <Link href="/Live_Test">
                    <p className={`text-primary p-8 rounded-3xl bg-sec mx-2 ${isActive('/Live_Test') ? 'bg-white' : 'hover:bg-white'}`}>Live Test</p>
                </Link>
                <Link href="/Video_Test">
                    <p className={`text-primary p-8 rounded-3xl bg-sec mx-2 ${isActive('/Video_Test') ? 'bg-white' : 'hover:bg-white'}`}>Test Video</p>
                </Link>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
