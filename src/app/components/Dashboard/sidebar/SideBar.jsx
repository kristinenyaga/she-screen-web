'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaChartBar,
  FaUser,
  FaStethoscope,
  FaSignOutAlt,
  FaCog,
} from 'react-icons/fa';

const menuItems = [
  { name: 'Overview', path: '/dashboard/overview', icon: <FaHome size={20} /> },
  { name: 'Patients', path: '/dashboard/patients', icon: <FaUsers size={20} /> },
  { name: 'Screenings', path: '/dashboard/screenings', icon: <FaCalendarCheck size={20} /> },
  { name: 'Reports', path: '/dashboard/reports', icon: <FaChartBar size={20} /> },
  { name: 'Staff Users', path: '/dashboard/staff', icon: <FaUser size={20} /> },
  { name: 'Settings', path: '/dashboard/settings', icon: <FaCog size={20} /> },
];

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

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
            <p className="text-xs text-gray-600 font-poppins font-medium">Medical Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 font-poppins">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group text-sm flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'bg-[#eff8f8] text-[#3BA1AF]'
                    : 'text-black hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-[#3BA1AF]' : 'text-gray-600'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`ml-4 text-base ${
                    isActive ? 'text-[#3BA1AF]' : 'text-gray-600'
                  }`}
                >
                  {item.name}
                </span>
                {!isActive && (
                  <div className="absolute inset-0 bg-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200/60 p-4 space-y-3">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-transparent hover:border-red-200"
        >
          <FaSignOutAlt className="flex-shrink-0 text-slate-500 group-hover:text-red-500 transition-colors duration-200" size={18} />
          <span className="ml-4 font-medium text-sm">Sign Out</span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
