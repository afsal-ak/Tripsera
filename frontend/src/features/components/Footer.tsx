
const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-orange">Picnigo</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted travel partner for unforgettable adventures around the globe. We create experiences that inspire and transform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange transition-colors">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-orange transition-colors">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-orange transition-colors">Twitter</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Packages</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Adventure Tours</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Cultural Experiences</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Wildlife Safaris</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Beach Holidays</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange transition-colors">Custom Trips</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 info@picnigo.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Adventure St, Travel City, TC 12345</li>
              <li>🕒 Mon-Fri: 9AM-6PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 <span className="text-orange">Picnigo</span>. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
