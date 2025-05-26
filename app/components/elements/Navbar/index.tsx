import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown, LogOut, Menu, User } from "lucide-react";
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
import { useLoaderData } from "react-router";
import type { loader } from "~/routes/_page";
import { useLogout } from "~/hooks/useLogout";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { formatName } from "~/lib/utils";

const Navbar = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { isLoggedIn, username, role } = useLoaderData<typeof loader>();
  const logout = useLogout();
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
          {isLoggedIn && role === "STAFF" && (
            <Link
              to="/staffdashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Staff Dashboard
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <ThemeToggler />

          {isLoggedIn ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="w-[100px] cursor-pointer group flex gap-3 max-sm:gap-2 py-2 items-center text-black dark:text-white fill-black dark:fill-white group">
                  <User size="w-5 h-5" />
                  <p className="font-bold text-base max-md:hidden">
                    {formatName(username ?? "")}
                  </p>
                  <ChevronDown
                    className={`${
                      popoverOpen ? "-rotate-180" : ""
                    } duration-300 text-black dark:text-white`}
                    size="w-5 h-5"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="z-50">
                <Button
                  onClick={logout}
                  className="w-full"
                  variant="destructive"
                >
                  <LogOut />
                  Sign Out
                </Button>
              </PopoverContent>
            </Popover>
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
                {isLoggedIn && role === "STAFF" && (
                  <Link
                    to="/staffdashboard"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Staff Dashboard
                  </Link>
                )}
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
