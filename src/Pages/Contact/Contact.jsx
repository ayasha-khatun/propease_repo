import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const Contact = () => {
const [formData, setFormData] = useState({ name: "", email: "", message: "" });

const handleChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
await axios.post("[https://propease-server-side.vercel.app/contact](https://propease-server-side.vercel.app/contact)", formData);
Swal.fire({ icon: "success", title: "Sent Successfully!", text: "Thank you for contacting us. We will get back to you soon.", confirmButtonColor: "#3085d6" });
setFormData({ name: "", email: "", message: "" });
} catch (error) {
console.error(error);
Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong! Please try again." });
}
};

return ( <div className="min-h-screen bg-gray-900 py-16 px-4 text-gray-100"> <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>


  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">  
    {/* Left: Contact Info */}  
    <div className="bg-gray-800 shadow-lg rounded-xl p-8">  
      <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>  
      <p className="text-gray-300 mb-8">Have questions about our properties or services? Feel free to reach out to us. We’re here to help you find your dream home!</p>  

      <div className="flex items-center gap-4 mb-6">  
        <FaPhoneAlt className="text-blue-400 text-2xl" />  
        <p className="text-gray-100 text-lg">+880 123 456 789</p>  
      </div>  

      <div className="flex items-center gap-4 mb-6">  
        <FaEnvelope className="text-green-400 text-2xl" />  
        <p className="text-gray-100 text-lg">support@propease.com</p>  
      </div>  

      <div className="flex items-center gap-4 mb-6">  
        <FaMapMarkerAlt className="text-red-400 text-2xl" />  
        <p className="text-gray-100 text-lg">Dhaka, Bangladesh</p>  
      </div>  

      <div className="mt-8 w-full h-64 rounded-lg overflow-hidden shadow-md">  
        <iframe  
          title="Office Location"  
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.903635982757!2d90.382569!3d23.750569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0e0b6c25b%3A0x7b9cdbda7a77d5c3!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1697666634782!5m2!1sen!2sbd"  
          width="100%"  
          height="100%"  
          style={{ border: 0 }}  
          allowFullScreen=""  
          loading="lazy"  
          referrerPolicy="no-referrer-when-downgrade"  
        ></iframe>  
      </div>  
    </div>  

    {/* Right: Contact Form */}  
    <div className="bg-gray-800 shadow-lg rounded-xl p-8">  
      <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>  

      <form className="space-y-6" onSubmit={handleSubmit}>  
        <div>  
          <label className="block text-gray-300 mb-2 font-medium">Name</label>  
          <input  
            type="text"  
            name="name"  
            value={formData.name}  
            onChange={handleChange}  
            className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"  
            placeholder="Your Name"  
            required  
          />  
        </div>  

        <div>  
          <label className="block text-gray-300 mb-2 font-medium">Email</label>  
          <input  
            type="email"  
            name="email"  
            value={formData.email}  
            onChange={handleChange}  
            className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"  
            placeholder="you@example.com"  
            required  
          />  
        </div>  

        <div>  
          <label className="block text-gray-300 mb-2 font-medium">Message</label>  
          <textarea  
            name="message"  
            value={formData.message}  
            onChange={handleChange}  
            className="w-full border border-gray-700 rounded-lg px-4 py-2 h-32 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"  
            placeholder="Write your message..."  
            required  
          ></textarea>  
        </div>  

        <button  
          type="submit"  
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"  
        >  
          Send Message  
        </button>  
      </form>  
    </div>  
  </div>  
</div>  
);
};

export default Contact;
