"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
    const [time, setTime] = useState(new Date());
    const { user } = useUser(); // Client-side user info

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
        <main className="bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex items-center justify-between p-4 rounded-lg bg-card shadow-sm">
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                            {formatTime(time)}
                        </span>
                    </div>
                    <div className="text-lg font-semibold">
                        {user ? `Welcome, ${user.fullName || "User"}` : "Welcome!"}
                    </div>
                </header>
            </div>
        </main>
    );
};

export default Header;