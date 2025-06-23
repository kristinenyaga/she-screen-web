"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-inter">
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#dadddd]">
        <Link href="/">
          <h1 className="text-2xl cursor-pointer font-bold text-gray-700 font-crimson-pro">
            <span className="bg-[#3BA1AF] text-white rounded-full py-2 px-1">She</span>Screen
          </h1>
        </Link>
        <Link href="/welcome">
          <button className="px-6 py-2 font-poppins text-base font-medium rounded-lg text-[#3BA1AF] border border-[#3BA1AF] hover:bg-[#3BA1AF] hover:text-white transition">
            Back
          </button>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-left">
          <div className="mb-6 text-center">
            <h2 className="text-3xl md:text-5xl font-crimson-pro font-medium text-[#3BA1AF] mb-2">
              Login to SheScreen
            </h2>
            <p className="text-gray-700 mb-5 font-inter text-base">
              Clinic access to patient and screening data.
            </p>
          </div>

          <form className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 font-poppins">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@clinic.org"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BA1AF]"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 font-poppins">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BA1AF]"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-sm text-[#3BA1AF] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              onClick={()=>router.push('/dashboard/overview')}
              className="w-full bg-[#3BA1AF] hover:bg-[#36929e] text-white font-poppins font-medium py-3 rounded-lg transition cursor-pointer"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-[#3BA1AF] hover:underline">
              sign up
            </a>
          </p>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} SheScreen. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
