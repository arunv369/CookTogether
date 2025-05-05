import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat, Mail, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Nav from "./Nav";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://cooktogether.onrender.com/auth/forgot-password",
        { email }
      );
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Failed to send reset email. Try again."
      );
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <ChefHat className="h-12 w-12 text-primary-600" strokeWidth={1.5} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Send reset instructions
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Mail
                        className="h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Check your email
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          We've sent password reset instructions to {email}.
                          Please check your inbox and follow the instructions to
                          reset your password.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Link
                to="/login"
                className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
