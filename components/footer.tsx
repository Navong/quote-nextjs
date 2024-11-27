import { Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto max-w-7xl px-4 py-6 md:flex md:items-center md:justify-between">
                <div className="flex justify-center md:order-2">
                    <span className="text-muted-foreground text-sm mr-2">Made with</span>
                    <Heart className="w-4 h-4 text-destructive" />
                    <span className="text-muted-foreground text-sm ml-2">by Navong</span>
                </div>
                <div className="mt-4 md:mt-0 md:order-1">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Quote App. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

