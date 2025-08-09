import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#F0F2F5] text-[#121717] py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-6">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6">
          <Link to="/" className="hover:text-[#12B5ED] transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-[#12B5ED] transition-colors">
            About
          </Link>
          <Link to="/maps" className="hover:text-[#12B5ED] transition-colors">
            Map
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#12B5ED] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-[#61808A] text-center">
          © {new Date().getFullYear()} CleanFlow Mumbai. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
