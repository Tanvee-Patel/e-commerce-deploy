import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage } from "@/store/contactSlice";

const Contact = () => {
   const [formData, setFormData] = useState({ name: "", email: "", message: "" });
   const dispatch = useDispatch()
   const { loading, success, error } = useSelector((state) => state.contact)

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(sendContactMessage(formData))
      setFormData({ name: "", email: "", message: "" });
   };

   return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center p-6">
         <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 space-y-8">
            {/* Heading */}
            <h2 className="text-4xl font-bold text-gray-900 text-center">Contact Us</h2>
            <p className="text-center text-gray-600">We'd love to hear from you! Reach out to us with any questions.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Contact Info */}
               <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                     <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                     <p className="text-gray-700">Surat, Gujarat, India</p>
                  </div>
                  <div className="flex items-center space-x-4">
                     <FaEnvelope className="text-red-500 text-2xl" />
                     <p className="text-blue-600 text-sm pb-2">
                        <a href="mailto:vedanship517@email.com" className="hover:underline">E-mail</a>
                     </p>
                  </div>
                  <div className="flex items-center space-x-4">
                     <FaPhone className="text-green-500 text-2xl" />
                     <p className="text-gray-700">+91 77788 57425</p>
                  </div>

                  {/* Social Media */}
                  <div className="flex space-x-4">
                     <Link to="#" className="text-blue-600 text-2xl hover:text-blue-800"><FaFacebook /></Link>
                     <Link to="https://x.com/Tanvee_17" className="text-blue-400 text-2xl hover:text-blue-600"><FaTwitter /></Link>
                     <Link to="#" className="text-pink-500 text-2xl hover:text-pink-700"><FaInstagram /></Link>
                     <Link to="https://in.pinterest.com/tanveedpatel8577/" className="text-red-600 text-2xl hover:text-red-800"><FaPinterest /></Link>
                  </div>
               </div>

               {/* Contact Form */}
               <div className="bg-gray-100 p-6 rounded-xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-gray-700 font-medium">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                           className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" required />
                     </div>
                     <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                           className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" required />
                     </div>
                     <div>
                        <label className="block text-gray-700 font-medium">Message</label>
                        <textarea name="message" rows="4" value={formData.message} onChange={handleChange}
                           className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" required></textarea>
                     </div>
                     <button type="submit" disabled={loading} className="max-w-full p-4 bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
                        {loading ? "Sending..." : "Send Message"}
                     </button>
                  </form>
               </div>
            </div>

         </div>
      </div>
   );
};

export default Contact;
