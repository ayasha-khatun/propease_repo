import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
 return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl font-semibold mt-4 text-gray-800 dark:text-gray-200">
        Page Not Found
      </p>
      <p className="text-gray-500 mt-2 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="btn btn-primary px-4 py-2 rounded-md shadow hover:bg-blue-600"
      >
        ⬅️ Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
