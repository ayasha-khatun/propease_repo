import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            
            <h2 className="text-xl font-semibold text-white">
                <span className="text-primary">PROP</span>
                <span className="text-secondary">EASE</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed">
            Your trusted real estate partner. Explore, buy, and manage properties 
            with full transparency and confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/all-properties" className="hover:text-white transition">All Properties</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link className="hover:text-white transition">Terms & Conditions</Link></li>
            <li><Link className="hover:text-white transition">Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">Dhaka, Bangladesh</p>
          <p className="text-sm">+880 1604532776</p>
          <p className="text-sm mb-4">✉️ support@propease.com</p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-3 text-xl">
            <a href="#" target="_blank" className="hover:text-white"><FaFacebook /></a>
            <a href="#" target="_blank" className="hover:text-white"><FaInstagram /></a>
            <a href="#" target="_blank" className="hover:text-white"><FaTwitter /></a>
            <a href="#" target="_blank" className="hover:text-white"><FaLinkedin /></a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-10 pt-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} EstateX. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;