import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
          <div className="flex flex-wrap justify-center gap-8 min-w-0">
            <Link to="/about" className="text-[#61808A] hover:text-gray-700 transition-colors text-center min-w-40">
              About
            </Link>
            <Link to="/contact" className="text-[#61808A] hover:text-gray-700 transition-colors text-center min-w-40">
              Contact
            </Link>
            <Link to="/privacy" className="text-[#61808A] hover:text-gray-700 transition-colors text-center min-w-40">
              Privacy Policy
            </Link>
            <Link to="/ngo-partners" className="text-[#61808A] hover:text-gray-700 transition-colors text-center min-w-40">
              NGO Partners
            </Link>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="#" className="text-[#61808A] hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 21 19">
              <path fillRule="evenodd" d="M20.1928 3.46313C20.0768 3.18285 19.8033 3.00006 19.5 3H16.6472C15.8359 1.61972 14.3604 0.765791 12.7594 0.75C11.5747 0.734462 10.4339 1.19754 9.59531 2.03438C8.73219 2.88138 8.24717 4.04071 8.25 5.25V5.82094C4.47563 4.82531 1.38844 1.755 1.35563 1.72219C1.15019 1.51493 0.843182 1.44566 0.568648 1.54461C0.294115 1.64356 0.101905 1.89277 0.0759375 2.18344C-0.328125 6.66375 0.973125 9.66187 2.13844 11.3878C2.70664 12.241 3.39786 13.0055 4.18969 13.6566C2.76188 15.3 0.51375 16.1634 0.489375 16.1728C0.274975 16.2531 0.108995 16.4269 0.0386822 16.6448C-0.031631 16.8627 0.00142384 17.1008 0.128438 17.2913C0.19875 17.3962 0.48 17.7647 1.16719 18.1087C2.01656 18.5344 3.13875 18.75 4.5 18.75C11.1253 18.75 16.6612 13.6481 17.2266 7.08375L20.0306 4.28062C20.2451 4.06601 20.3091 3.74335 20.1928 3.46313ZM15.9741 6.22031C15.8455 6.34921 15.7682 6.52049 15.7566 6.70219C15.375 12.6169 10.4325 17.25 4.5 17.25C3.51 17.25 2.8125 17.1187 2.32312 16.9613C3.40219 16.3753 4.90688 15.3675 5.87438 13.9163C5.98915 13.7438 6.02746 13.5315 5.98023 13.3298C5.93299 13.128 5.80442 12.9548 5.625 12.8512C5.58094 12.8259 1.50844 10.3819 1.5 3.85125C3 5.07 5.74219 6.96094 8.87531 7.48781C9.09265 7.52446 9.3151 7.46364 9.48358 7.32154C9.65205 7.17943 9.74949 6.9704 9.75 6.75V5.25C9.7483 4.44176 10.0728 3.66702 10.65 3.10125C11.2034 2.54686 11.9574 2.23983 12.7406 2.25C13.9275 2.265 15.0366 2.98875 15.5006 4.05094C15.6202 4.32382 15.8899 4.50008 16.1878 4.5H17.6878L15.9741 6.22031Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-[#61808A] hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0.25C4.61522 0.25 0.25 4.61522 0.25 10C0.25 15.3848 4.61522 19.75 10 19.75C15.3848 19.75 19.75 15.3848 19.75 10C19.7443 4.61758 15.3824 0.255684 10 0.25ZM10.75 18.2153V12.25H13C13.4142 12.25 13.75 11.9142 13.75 11.5C13.75 11.0858 13.4142 10.75 13 10.75H10.75V8.5C10.75 7.67157 11.4216 7 12.25 7H13.75C14.1642 7 14.5 6.66421 14.5 6.25C14.5 5.83579 14.1642 5.5 13.75 5.5H12.25C10.5931 5.5 9.25 6.84315 9.25 8.5V10.75H7C6.58579 10.75 6.25 11.0858 6.25 11.5C6.25 11.9142 6.58579 12.25 7 12.25H9.25V18.2153C4.85788 17.8144 1.55787 14.0299 1.75854 9.62409C1.95922 5.21827 5.58962 1.74947 10 1.74947C14.4104 1.74947 18.0408 5.21827 18.2415 9.62409C18.4421 14.0299 15.1421 17.8144 10.75 18.2153Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-[#61808A] hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5.5C7.51472 5.5 5.5 7.51472 5.5 10C5.5 12.4853 7.51472 14.5 10 14.5C12.4853 14.5 14.5 12.4853 14.5 10C14.4974 7.51579 12.4842 5.50258 10 5.5ZM10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13ZM14.5 0.25H5.5C2.60179 0.2531 0.2531 2.60179 0.25 5.5V14.5C0.2531 17.3982 2.60179 19.7469 5.5 19.75H14.5C17.3982 19.7469 19.7469 17.3982 19.75 14.5V5.5C19.7469 2.60179 17.3982 0.2531 14.5 0.25ZM18.25 14.5C18.25 16.5711 16.5711 18.25 14.5 18.25H5.5C3.42893 18.25 1.75 16.5711 1.75 14.5V5.5C1.75 3.42893 3.42893 1.75 5.5 1.75H14.5C16.5711 1.75 18.25 3.42893 18.25 5.5V14.5ZM16 5.125C16 5.74632 15.4963 6.25 14.875 6.25C14.2537 6.25 13.75 5.74632 13.75 5.125C13.75 4.50368 14.2537 4 14.875 4C15.4963 4 16 4.50368 16 5.125Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#61808A] text-sm">CleanFlow Mumbai © 2024</p>
        </div>
      </div>
    </footer>
  );
}

export function NGOFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
          <div className="flex flex-wrap justify-center gap-8 min-w-0">
            <Link to="/maps" className="text-[#618A80] hover:text-gray-700 transition-colors text-center min-w-40">
              Back to Map
            </Link>
            <Link to="/partner" className="text-[#618A80] hover:text-gray-700 transition-colors text-center min-w-40">
              Partner with Us
            </Link>
            <Link to="/privacy" className="text-[#618A80] hover:text-gray-700 transition-colors text-center min-w-40">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#618A80] text-sm">@2024 CleanFlow Mumbai</p>
        </div>
      </div>
    </footer>
  );
}
