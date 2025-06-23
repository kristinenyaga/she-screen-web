import React from 'react';
import Link from 'next/link';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-inter">
      <header className="flex justify-between items-center px-8 py-6 ">
        <h1 className="text-2xl font-bold text-gray-700 font-poppins font-crimson-pro">
          <span className="bg-[#3BA1AF] text-white rounded-full py-2 px-1">She</span>Screen
        </h1>
        <Link href="/login">
          <button className="px-6 py-2 font-poppins text-base font-medium rounded-lg text-[#3BA1AF] border-gray-300 border border-gray-300-[#3BA1AF] hover:bg-[#3BA1AF] hover:text-white transition">
            Log In
          </button>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8 text-left">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-crimson-pro font-medium text-[#3BA1AF] mb-2">
              Create Clinic Account
            </h2>
            <p className="text-gray-700 font-inter text-base">
              Register your clinic and start managing screenings.
            </p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Full Name</label>
              <input type="text" placeholder="Dr. Jane Doe" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm " required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Email Address</label>
              <input type="email" placeholder="you@clinic.org" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm " required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Phone Number</label>
              <input type="tel" placeholder="+254712345678" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm " />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Clinic Name</label>
              <input type="text" placeholder="Sunrise Medical Clinic" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm " required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Region / County</label>
              <select className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm text-sm" required>
                <option value="">Select County</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Machakos">Machakos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Position / Role</label>
              <select className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm text-sm" required>
                <option value="">Select Role</option>
                <option value="Nurse">Nurse</option>
                <option value="CHW">Community Health Worker (CHW)</option>
                <option value="Clinic Officer">Clinic Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Password</label>
              <input type="password" placeholder="********" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm " minLength={8} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">Confirm Password</label>
              <input type="password" placeholder="********" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-sm " required />
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-[#3BA1AF] hover:bg-[#36929e] text-white font-poppins font-medium py-3 rounded-lg transition cursor-pointer">
                Create Account
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#3BA1AF] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} SheScreen. All rights reserved.
      </footer>
    </div>
  );
};

export default SignupPage;
