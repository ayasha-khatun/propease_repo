import React from "react";

const partners = [
  { id: 1, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", name: "Nike" },
  { id: 2, logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", name: "Microsoft" },
  { id: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", name: "Amazon" },
  { id: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", name: "Netflix" },
  { id: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", name: "Google" },
];

const OurPartnersSection = () => {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Our Trusted Partners</h2>
        <p className="text-gray-600 mb-10">
          We collaborate with leading companies to bring you the best real estate services.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex justify-center items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPartnersSection;
