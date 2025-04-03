import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { LogOut, Settings, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "./auth-modal";

export function UserProfileButton() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  const handleLoginClick = () => {
    setAuthModalTab("login");
    setShowAuthModal(true);
  };

  const handleSignupClick = () => {
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  // If the user is logged in, show their profile dropdown
  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative rounded-full bg-muted"
            >
              <User className="h-4 w-4" />
              <span className="ml-2">
                {user.email?.split("@")[0] || "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="cursor-pointer w-full flex items-center"
              >
                <User className="h-4 w-4 mr-2" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="cursor-pointer w-full flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Saved Resumes</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center text-destructive"
              onClick={signOut}
              asChild
            >
              <button className="cursor-pointer w-full flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  // If not logged in, show login/signup buttons
  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleLoginClick}>
          Sign In
        </Button>
        <Button
          onClick={handleSignupClick}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
