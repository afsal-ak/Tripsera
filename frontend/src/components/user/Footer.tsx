import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Linkedin, MessageCircle, Twitter, PlaneTakeoff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { subscribeToNewsletterToggle } from '@/services/user/newsLetterService';
import { setUser } from '@/redux/slices/userAuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Global states
  const user = useSelector((state: RootState) => state.userAuth.user);
  const accessToken = useSelector((state: RootState) => state.userAuth.accessToken);
  const isSubscribedFromStore = useSelector(
    (state: RootState) => state.userAuth.user?.isNewsletterSubscribed
  );

  // Local state to reflect real-time UI update
  const [isSubscribed, setIsSubscribed] = useState<boolean>(isSubscribedFromStore || false);

  useEffect(() => {
    // Keep in sync with global redux user updates
    setIsSubscribed(isSubscribedFromStore || false);
  }, [isSubscribedFromStore]);

  // Toggle Subscribe / Unsubscribe
  const handleNewsletterToggle = async () => {
    if (!accessToken) {
      toast.info('Please log in to manage newsletter subscription.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    try {
      setLoading(true);
      const response = await subscribeToNewsletterToggle(!isSubscribed);

      // Update both local + global state
      const updatedSubscription = !isSubscribed;
      setIsSubscribed(updatedSubscription);

      dispatch(
        setUser({
          user: {
            ...response.data,
            isNewsletterSubscribed: updatedSubscription,
          },
          accessToken: accessToken!,
        })
      );

      toast.success(
        updatedSubscription
          ? '🎉 Subscribed to our newsletter successfully!'
          : 'You have unsubscribed from the newsletter.'
      );
    } catch (error) {
      console.error('Newsletter toggle error:', error);
      toast.error('Failed to update subscription status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-1">
              <span className="text-3xl font-bold text-orange">Tripsera</span>
              <PlaneTakeoff className="text-orange w-6 h-6" />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Discover amazing destinations and travel packages with Tripsera.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-start space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:text-orange/80 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:text-orange/80 transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:text-orange/80 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-700 hover:text-orange text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-700 hover:text-orange text-sm">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-700 hover:text-orange text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-orange text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="text-center sm:text-left">
            
          </div>

          {/* Newsletter Section */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our weekly newsletter for the latest updates and exclusive offers.
            </p>

            <button
              onClick={handleNewsletterToggle}
              disabled={loading}
              className={`px-6 py-2 text-sm font-medium rounded-lg shadow-md transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : isSubscribed
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-orange hover:bg-orange/90 text-white'
              }`}
            >
              {loading
                ? 'Processing...'
                : isSubscribed
                ? 'Unsubscribe from Newsletter'
                : 'Subscribe to Newsletter'}
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          © 2025 <span className="text-orange font-medium">Tripsera</span>. All rights reserved. |{' '}
          <Link to="/privacy" className="hover:text-orange">
            Privacy Policy
          </Link>{' '}
          |{' '}
          <Link to="/terms" className="hover:text-orange">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
