import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaPinterest, FaInstagram, FaFacebook } from "react-icons/fa";

const SFooter = () => {
   return (
      <footer className="text-black bg-white py-3 w-full mt-auto">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand Info */}
            <div>
               <h2 className="text-2xl font-bold mb-3">GlamLit</h2>
               <p className="text-gray-500 text-sm">
                  Subscribe to our newsletter for the latest deals and updates.
               </p>
            </div>

            {/* Office Address */}
            <div>
               <h3 className="text-xl font-semibold mb-2">Office</h3>
               <p className="text-gray-500 text-sm pb-2">Surat, Gujarat, India</p>
               <p className="text-blue-600 text-sm pb-2">
                  <a href="mailto:vedanship517@email.com" className="hover:underline">E-mail</a>
               </p>
               <p className="text-gray-500 text-sm">Phone: +91 77788 57425</p>
            </div>

            {/* Quick Links */}
            <div>
               <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
               <ul className="space-y-2 text-gray-500">
                  <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                  <li><Link to="/user/listing" className="hover:text-blue-400">Shop</Link></li>
                  <li><Link to="/user/about" className="hover:text-blue-400">About Us</Link></li>
                  <li><Link to="/user/contact" className="hover:text-blue-400">Contact Us</Link></li>
               </ul>
            </div>

            {/* Social Media Links */}
            <div>
               <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
               <div className="flex space-x-4 mt-4">
                  <Link to="#" className="text-2xl text-gray-400 hover:text-gray-700"><FaFacebook /></Link>
                  <Link to="https://x.com/Tanvee_17" className="text-2xl text-gray-400 hover:text-gray-700"><FaTwitter /></Link>
                  <Link to="#" className="text-2xl text-gray-400 hover:text-gray-700"><FaInstagram /></Link>
                  <Link to="https://in.pinterest.com/tanveedpatel8577/" className="text-2xl text-gray-400 hover:text-gray-700"><FaPinterest /></Link>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default SFooter;
