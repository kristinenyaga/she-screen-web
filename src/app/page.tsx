'use client';
import React from 'react';
import Link from 'next/link';
import { HeartPulse, BarChart3, ShieldCheck } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-inter">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#dadddd]">
        <Link href="/">
          <h1 className="text-2xl cursor-pointer font-bold text-gray-700 font-crimson-pro">
            <span className="bg-[#3BA1AF] text-white rounded-full px-2 py-1">She</span>
            <span className="ml-1">Screen</span>
          </h1>
        </Link>
        <Link href="/login">
          <button className="px-6 py-2.5 font-poppins text-sm md:text-base font-medium rounded-md text-white bg-[#3BA1AF] hover:bg-[#36929e] transition">
            Login
          </button>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-12">
        <h2 className="text-4xl md:text-5xl font-crimson-pro font-semibold text-[#3BA1AF] mb-4">
          Welcome to SheScreen
        </h2>
        <p className="max-w-xl text-gray-700 text-lg font-inter mb-8">
          A cervical cancer screening and management platform for clinics and healthcare professionals.
        </p>
        <Link href="/login">
          <button className="bg-[#3BA1AF] font-poppins text-base font-medium text-white px-6 py-3 rounded-lg shadow hover:bg-[#36929e] transition">
            Get Started
          </button>
        </Link>

        {/* Feature Section */}
        <section className="mt-16 font-inter max-w-4xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Why SheScreen?</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<HeartPulse className="h-8 w-8 text-[#FFBEBC]" />}
              title="Patient Tracking"
              description="Easily track screenings, follow-ups, and care plans."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-[#FFBEBC]" />}
              title="Powerful Insights"
              description="Visualize health data through clear analytics."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-[#FFBEBC]" />}
              title="Secure & Compliant"
              description="Built with privacy, compliance, and trust in mind."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-100">
        &copy; {new Date().getFullYear()} <span className="text-[#3BA1AF] font-semibold">SheScreen</span>. All rights reserved.
        {' '}|{' '}
        <a href="#" className="underline decoration-[#FFBEBC] decoration-2 underline-offset-4 hover:text-[#3BA1AF]">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default WelcomePage;

// FeatureCard Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-[#FFBEBC]/10 border border-[#FFBEBC]/20 rounded-xl p-5 text-left shadow-sm hover:shadow-md transition">
    <div className="mb-3">{icon}</div>
    <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);
