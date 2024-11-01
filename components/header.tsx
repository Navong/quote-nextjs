"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
    const [time, setTime] = useState(new Date());
    const user = "Guest";

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="hidden md:block">
                    <div className="flex items-center justify-between h-16">
                        {/* Left section */}
                        <div className="flex items-center space-x-4">
                            <Button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                <Link href="https://quote-nextjs-dev.vercel.app/" target="_blank" rel="noopener noreferrer">
                                    Test with Auth
                                </Link>
                            </Button>
                        </div>

                        {/* Middle section - Time (Desktop only) */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-600">{formatTime(time)}</span>
                        </div>

                        {/* Right section - Welcome message (Desktop only) */}
                        <div className="hidden md:block">
                            <span className="text-gray-600">
                                {user ? `Welcome, ${user}` : "Welcome!"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile time display - Shows below header on mobile */}
                <div className="md:hidden py-4 flex items-center justify-center space-x-2 border-gray-100">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">{formatTime(time)}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;