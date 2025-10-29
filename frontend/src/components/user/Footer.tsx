import { Linkedin, MessageCircle, Twitter, PlaneTakeoff } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="border-t border-gray-300"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-1">
              <span className="text-3xl font-bold text-orange">Tripsera</span>
              <PlaneTakeoff className="text-orange-500 w-6 h-6" />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Travel helps companies<br className="hidden sm:block" />
              manage payments easily.
            </p>

            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="text-orange hover:text-orange-600">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-orange hover:text-orange-600">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-orange hover:text-orange-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-orange hover:text-orange-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog', 'Pricing'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-orange-500 text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Destinations</h3>
            <ul className="space-y-3">
              {['Maldives', 'Los Angeles', 'Las Vegas', 'Toronto'].map((dest) => (
                <li key={dest}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-orange-500 text-sm transition-colors"
                  >
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Join Our Newsletter</h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button className="w-full sm:w-auto bg-orange text-white px-6 py-2 rounded-b-lg sm:rounded-r-lg sm:rounded-b-none hover:bg-orange-600 font-medium text-sm transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              * Weekly updates for your best tour packages.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          © 2025 <span className="text-orange-500 font-medium">Tripsera</span>. All rights reserved. |{' '}
          <a href="#" className="hover:text-orange-500">Privacy Policy</a> |{' '}
          <a href="#" className="hover:text-orange-500">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
