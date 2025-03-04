import { Link } from "react-router-dom";

const AboutUs = () => {
   return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
         <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 space-y-8 ">
            {/* Heading */}
            <h1 className="text-4xl font-extrabold text-gray-900 text-center">
               About <span className="text-primary-500">Our Store</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-700 text-center">
               Welcome to <span className="font-semibold">GlamLit</span>, your one-stop destination for premium products.
               Our mission is to bring you the best deals on top-quality brands, ensuring a seamless shopping experience.
            </p>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">🚀 Fast Shipping</h3>
                  <p className="text-gray-600">We ensure quick delivery, so you get your products on time.</p>
               </div>
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">🌟 24/7 Support</h3>
                  <p className="text-gray-600">Our team is always here to help, anytime you need.</p>
               </div>
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">🏷️ Best Deals & Discounts</h3>
                  <p className="text-gray-600">Get exclusive offers, seasonal sales, and special discounts.</p>
               </div>
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">💄 100% Authentic Products</h3>
                  <p className="text-gray-600">We guarantee original and dermatologist-tested beauty products.</p>
               </div>
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">📖 Wide Book Collection</h3>
                  <p className="text-gray-600">From bestsellers to rare finds, explore a vast collection of books.</p>
               </div>
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">🔋 Latest Tech & Gadgets</h3>
                  <p className="text-gray-600">Find the newest smartphones, laptops, and accessories.</p>
               </div>
               <div className="p-4 bg-gray-100 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">🔄 Easy Returns</h3>
                  <p className="text-gray-600">Hassle-free returns and exchanges for a seamless shopping experience.</p>
               </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
               <Link
                  to="/user/listing"
                  className="bg-primary-500 px-6 py-3 bg-green-200 hover:bg-green-300 rounded-xl font-medium text-lg hover:bg-primary-600 transition duration-300"
               >
                  Start Shopping
               </Link>
            </div>
         </div>
      </div>
   );
};

export default AboutUs;
