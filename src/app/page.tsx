// app/(dashboard)/welcome/page.tsx or pages/welcome.tsx
import React from 'react';
import Link from 'next/link';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-inter">
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#dadddd]">
        <Link href="/">
          <h1 className="text-2xl cursor-pointer font-bold text-gray-700 font-crimson-pro">
            <span className="bg-[#3BA1AF] text-white rounded-full py-2 px-1">She</span>Screen
          </h1>
        </Link>
        <Link href="/login">
          <button className="px-9 py-3 font-poppins text-base font-medium rounded-lg text-white bg-[#3BA1AF] hover:bg-[#36929e] transition cursor-pointer">
            Login
          </button>
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-crimson-pro md:text-5xl font-semibold text-[#3BA1AF] mb-4">
          Welcome to SheScreen
        </h2>
        <p className="max-w-xl text-gray-700 font-inter text-lg mb-8">
          A cervical cancer screening and management dashboard for clinics and healthcare professionals.
        </p>
        <Link href="/login">
          <button className="bg-[#3BA1AF] font-poppins text-base font-medium text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#36929e] transition cursor-pointer">
            Get Started
          </button>
        </Link>

        <section className="mt-16 font-inter">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Why SheScreen?</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✔ Track screenings and follow-ups with ease</li>
            <li>✔ Visualize health data with powerful analytics</li>
            <li>✔ Secure and compliant with medical standards</li>
          </ul>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} SheScreen. All rights reserved. | <a href="#" className="underline">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default WelcomePage;
