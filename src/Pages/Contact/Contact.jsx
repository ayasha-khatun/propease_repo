import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Send, Clock, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const contactInfo = [
  {
    icon: <FaPhoneAlt className="text-primary" />,
    label: "Phone",
    value: "+880 123 456 789",
    sub: "Mon–Fri, 9am–6pm",
  },
  {
    icon: <FaEnvelope className="text-primary" />,
    label: "Email",
    value: "support@propease.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: <FaMapMarkerAlt className="text-primary" />,
    label: "Office",
    value: "Dhanmondi, Dhaka",
    sub: "Bangladesh",
  },
  {
    icon: <Clock className="text-primary" size={16} />,
    label: "Working Hours",
    value: "9:00 AM – 6:00 PM",
    sub: "Saturday – Thursday",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://propease-server-side.vercel.app/contact", formData);
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for reaching out. We'll get back to you soon.",
        confirmButtonColor: "#6366f1",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/90 text-sm font-medium mb-5">
            <MessageSquare size={14} />
            We'd love to hear from you
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Have questions about a property or need help? Our team is ready to assist you every step of the way.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Info + Map */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 font-semibold text-sm mt-0.5">
                      {item.value}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm h-56">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.903635982757!2d90.382569!3d23.750569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0e0b6c25b%3A0x7b9cdbda7a77d5c3!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1697666634782!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Send Us a Message
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Fill out the form below and we'll respond as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Bottom note */}
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                We typically respond within{" "}
                <span className="text-primary font-medium">24 hours</span>. Your information is kept private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
