import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-[#12B5ED] border-b-2 border-[#12B5ED] pb-1'
        : 'text-[#121717] hover:text-[#12B5ED]'
    }`;

  const mobileNavLinkClass = (path: string) =>
    `block py-3 px-4 text-base font-medium transition-colors ${
      isActive(path)
        ? 'text-[#12B5ED] bg-blue-50'
        : 'text-[#121717] hover:text-[#12B5ED] hover:bg-gray-50'
    }`;

  const navItems = [
    { path: '/maps', label: 'Explore' },
    ...(user ? [{ path: '/report', label: 'Report Issue' }] : []),
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/organize', label: 'Organize Drive' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-10 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <div className="w-4 h-4 bg-[#121717]" style={{
            clipPath: "polygon(50% 0%, 100% 29%, 100% 71%, 50% 100%, 0% 71%, 0% 29%)"
          }} />
          <h1 className="text-lg font-bold text-[#121717]">CleanFlow Mumbai</h1>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#121717] hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <div className="w-8 h-8 rounded-full bg-[#12B5ED] flex items-center justify-center text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-[#121717] font-medium">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-[#121717] text-xs md:text-sm font-bold px-2 md:px-4 h-10 rounded-xl"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] text-xs md:text-sm font-bold px-2 md:px-4 h-10 rounded-xl"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={mobileNavLinkClass(item.path)}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/profile"
                  className={mobileNavLinkClass('/profile')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function MapHeader() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-[#12B5ED] border-b-2 border-[#12B5ED] pb-1'
        : 'text-[#121717] hover:text-[#12B5ED]'
    }`;

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-10 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <div className="w-4 h-4 bg-[#121717]" style={{
            clipPath: "polygon(50% 0%, 100% 29%, 100% 71%, 50% 100%, 0% 71%, 0% 29%)"
          }} />
          <h1 className="text-lg font-bold text-[#121717]">CleanFlow Mumbai</h1>
        </Link>

        {/* Navigation for Maps */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/maps" className={navLinkClass('/maps')}>
              Explore
            </Link>
            {user && (
              <Link to="/report" className={navLinkClass('/report')}>
                Report Issue
              </Link>
            )}
            <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
              Leaderboard
            </Link>
            <Link to="/profile" className={navLinkClass('/profile')}>
              Profile
            </Link>
          </nav>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <div className="w-10 h-10 rounded-full bg-[#12B5ED] flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-[#121717] font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-white text-xs font-bold rounded-xl"
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
