import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { NAVIGATION_ITEMS } from "./const";
import { ThemeToggler } from "~/utils/ThemeToggler";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";

const Navbar = () => {
  const [isLoggedIn] = useState(false); // This would come from your auth context
  const [userName] = useState("John Doe"); // This would come from your auth context

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 px-5 md:px-22 z-50 w-full flex items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Udehnih</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <ThemeToggler />

          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{userName}</span>
            </div>
          ) : (
            <Button onClick={handleLogin} className="hidden md:flex">
              Login
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4 px-5 md:px-22">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                {!isLoggedIn && (
                  <Button onClick={handleLogin} className="w-full">
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
