import { Linkedin, MessageCircle, Twitter,PlaneTakeoff } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      {/* Divider above footer */}
      <div className="border-t border-gray-300"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              <span className="text-3xl font-bold text-orange">Tripsera </span>
              {/* <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5 5.5L17 12l-9.5 6.5v-13z" />
              </svg> */}
              <span className='text'>< PlaneTakeoff/></span>
            </div>
            <p className="text-gray-600 text-sm">
              Travel helps companies<br />
              manage payments easily.
            </p>
            <div className="flex space-x-3">
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog', 'Pricing'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-700 hover:text-orange-500 text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-4">Destinations</h3>
            <ul className="space-y-3">
              {['Maldives', 'Los Angeles', 'Las Vegas', 'Toronto'].map((dest) => (
                <li key={dest}>
                  <a href="#" className="text-gray-700 hover:text-orange-500 text-sm">{dest}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-4">Join Our Newsletter</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button className="bg-orange text-white px-6 py-2 rounded-r-lg hover:bg-orange font-medium text-sm">
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              * Will send you weekly updates for your better<br />
              tour packages.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          © 2025 <span className='text'> Tripsera. </span>All rights reserved. | <a href="#" className="hover:text-orange">Privacy Policy</a> | <a href="#" className="hover:text-orange">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
