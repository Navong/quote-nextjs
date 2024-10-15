"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
    const [time, setTime] = useState(new Date());
    const { user } = useUser();

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
    }

    return (
        <header className="bg-background p-3 sm:p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-card shadow-sm">
                    {/* Left section with auth buttons */}
                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
                        <div>
                            <SignedIn>
                                <UserButton/>
                            </SignedIn>
                            <SignedOut>
                                <SignInButton/>
                            </SignedOut>
                        </div>
                    </div>

                    {/* Middle section with time - hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-2 flex-1 justify-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                            {formatTime(time)}
                        </span>
                    </div>

                    {/* Welcome message for desktop */}
                    <div className="hidden sm:block text-base md:text-lg font-semibold text-right">
                        {user ? `Welcome, ${user.fullName || "User"}` : "Welcome!"}
                    </div>

                    {/* Time display for mobile - shown below */}
                    <div className="block sm:hidden text-center">
                        <span className="text-sm font-medium text-muted-foreground">
                            <Clock className="h-4 w-4 inline-block mr-2" /> {formatTime(time)}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;