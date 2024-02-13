import Link from 'next/link';
import React from 'react';


const Layout = ({ children }) => {
    return (
        <div>
            <nav className="bg-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                    <Link href="/" className="text-white">Home</Link>
                        <Link href="/Dataset" className="text-white">Dataset</Link>
                        <Link href="/Train" className="text-white">Training</Link>
                        <Link href="/Validation" className="text-white">Validation</Link>
                        <Link href="/Live_Test" className="text-white">Live Test</Link>
                        <Link href="/Video_Test" className="text-white">Test on Video</Link>
                    </div>
                    {/* Add any additional elements, user info, or settings here */}
                </div>
            </nav>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
