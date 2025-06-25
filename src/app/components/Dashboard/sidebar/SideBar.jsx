'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaChartBar,
  FaStethoscope,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [inventoryOpen, setInventoryOpen] = useState(pathname.startsWith('/dashboard/inventory'));

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('role');
    router.push('/welcome');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow flex flex-col font-inter z-40">
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-[#3BA1AF] rounded-xl flex items-center justify-center shadow-lg">
            <FaStethoscope className="text-white text-lg" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-crimson-pro font-medium text-[#3BA1AF]">
              SheScreen
            </h1>
            <p className="text-xs text-gray-500 font-poppins font-medium">Medical Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 font-poppins space-y-1">
        {[
          { name: 'Overview', path: '/dashboard/overview', icon: <FaHome size={20} /> },
          { name: 'Patients', path: '/dashboard/patients', icon: <FaUsers size={20} /> },
          { name: 'Services', path: '/dashboard/services', icon: <FaCalendarCheck size={20} /> },
          { name: 'Reports', path: '/dashboard/reports', icon: <FaChartBar size={20} /> },
        ].map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group text-sm flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                isActive ? 'bg-[#eff8f8] text-[#3BA1AF]' : ' hover:bg-[#eff8f8]'
              }`}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-[#3BA1AF]' : 'text-gray-600'}`}>
                {item.icon}
              </span>
              <span className={`ml-4 text-base ${isActive ? 'text-[#3BA1AF]' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

        <div>
          <button
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className={`group w-full flex cursor-pointer items-center px-4 py-3.5 rounded-xl ${
              pathname.startsWith('/dashboard/inventory') ? 'bg-[#eff8f8] text-[#3BA1AF]' : ' hover:bg-[#eff8f8]'
            }`}
          >
            <MdInventory className="text-lg mr-3 text-gray-600" />
            <span className="flex-1 text-left text-base text-gray-600">Inventory</span>
            {inventoryOpen ? (
              <FaChevronUp className="text-xs" />
            ) : (
              <FaChevronDown className="text-xs" />
            )}
          </button>
          {inventoryOpen && (
            <div className="ml-10 mt-1 space-y-1 text-sm font-poppins">
              <Link
                href="/dashboard/inventory"
                className={`block px-2 py-3 rounded-xl hover:bg-[#eff8f8] ${
                  pathname === '/dashboard/inventory' ? 'text-[#3BA1AF] font-medium' : 'text-gray-700'
                }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/inventory/manage"
                className={`block px-2 py-3 rounded-xl hover:bg-[#eff8f8] ${
                  pathname === '/dashboard/inventory/manage' ? 'text-[#3BA1AF] font-medium' : 'text-gray-700'
                }`}
              >
                Manage
              </Link>
              <Link
                href="/dashboard/inventory/usage"
                className={`block px-2 py-3 rounded-xl hover:bg-[#eff8f8] ${
                  pathname === '/dashboard/inventory/usage' ? 'text-[#3BA1AF] font-medium' : 'text-gray-700'
                }`}
              >
                Usage Logs
              </Link>
            </div>
          )}
        </div>

      </nav>

      <div className="border-t border-slate-200/60 p-4 space-y-3">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-transparent cursor-pointer"
        >
          <FaSignOutAlt className="flex-shrink-0 text-slate-500 group-hover:text-red-500 transition-colors duration-200" size={18} />
          <span className="ml-4 font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
