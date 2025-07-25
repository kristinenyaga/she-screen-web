'use client';
import React, { useState,useEffect } from 'react';
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
  FaUser,
  FaBell,
} from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';

const SideBar = ({ isExpanded, setIsExpanded }) => {
  const [user, setUser] = useState();
  const pathname = usePathname();
  const router = useRouter();
  const [inventoryOpen, setInventoryOpen] = useState(pathname.startsWith('/dashboard/inventory'));
  const [patientsOpen, setPatientsOpen] = useState(pathname.startsWith('/dashboard/patients'));

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('role');
    router.push('/');
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    setInventoryOpen(false);
    setPatientsOpen(false);
  };
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
  
    fetch("http://localhost:8000/users/me", { 
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user info");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
      });
  }, []);

  return (
    <aside 
      className={`fixed cursor-pointer left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col font-inter z-40 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-72' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-3">
          <div className="">
            <img src="/health.png" width="40" height="40" alt="Logo" />
          </div>
          {isExpanded && (
            <div className="text-center overflow-hidden">
              <h1 className="text-2xl font-crimson-pro font-semibold text-[#3BA1AF]">
                SheScreen
              </h1>
              <p className="text-xs text-slate-600 font-poppins font-medium">Medical Portal</p>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3BA1AF] to-[#2d7a85] rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.first_name} { user?.last_name}</p>
              <p className="text-xs text-slate-600 truncate capitalize mt-1">Admin</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 py-6 px-3 font-poppins space-y-2 overflow-y-auto">
        {[
          { name: 'Overview', path: '/admin/overview', icon: <FaHome size={20} /> },
          { name: 'Revenue', path: '/admin/biling', icon: <FaHome size={20} /> },
          { name: 'Services', path: '/admin/services', icon: <FaCalendarCheck size={20} /> },
        ].map((item) => {
          const isActive = pathname === item.path;
          return (
            <div key={item.path} className="relative">
              <Link
                href={item.path}
                className={`group text-sm flex items-center px-3 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive 
                    ? 'bg-[#3BA1AF] text-white shadow-lg' 
                    : 'text-slate-700 hover:bg-blue-50 hover:text-slate-800'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'}`}>
                  {item.icon}
                </span>
                {isExpanded && (
                  <span className={`ml-4 text-base font-medium ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-800'}`}>
                    {item.name}
                  </span>
                )}
              </Link>
              {isActive && !isExpanded && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#3BA1AF] rounded-r-full"></div>
              )}
            </div>
          );
        })}

        {/* <div>
          <button
            onClick={() => setPatientsOpen(!patientsOpen)}
            className={`group w-full flex cursor-pointer items-center px-3 py-3.5 rounded-xl transition-all duration-200 ${
              pathname.startsWith('/dashboard/patients') 
                ? 'bg-[#3BA1AF] text-white shadow-lg' 
                : 'text-slate-700 hover:bg-blue-50 hover:text-slate-800'
            }`}
          >
            <FaUsers className={`text-lg ${pathname.startsWith('/dashboard/patients') ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'}`} />
            {isExpanded && (
              <>
                <span className={`flex-1 text-left text-base font-medium ml-4 ${pathname.startsWith('/dashboard/patients') ? 'text-white' : 'text-slate-700 group-hover:text-slate-800'}`}>
                  Patients
                </span>
                {patientsOpen ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </>
            )}
          </button>
          {patientsOpen && isExpanded && (
            <div className="ml-12 mt-2 space-y-1 text-sm font-poppins">
              {[
                { name: 'All Patients', path: '/dashboard/patients/' },
                // { name: 'Risk Assessment', path: '/dashboard/patients/new' },
                { name: 'Lab Tests', path: '/dashboard/lab-tests/' },
                { name: 'Recommendations', path: '/dashboard/recommendations/' },
                { name: 'Follow Up Plans', path: '/dashboard/patients/care-plans' },
                
                

              ].map((subItem) => (
                <Link
                  key={subItem.path}
                  href={subItem.path}
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    pathname === subItem.path 
                      ? 'text-[#3BA1AF] font-medium  py-2' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-blue-50/50'
                  }`}
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div> */}

        <div>
          <button
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className={`group w-full flex cursor-pointer items-center px-3 py-3.5 rounded-xl transition-all duration-200 ${
              pathname.startsWith('/dashboard/inventory') 
                ? 'bg-[#3BA1AF] text-white shadow-lg' 
                : 'text-slate-700 hover:bg-blue-50 hover:text-slate-800'
            }`}
          >
            <MdInventory className={`text-lg ${pathname.startsWith('/dashboard/inventory') ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'}`} />
            {isExpanded && (
              <>
                <span className={`flex-1 text-left text-base font-medium ml-4 ${pathname.startsWith('/dashboard/inventory') ? 'text-white' : 'text-slate-700 group-hover:text-slate-800'}`}>
                  Inventory
                </span>
                {inventoryOpen ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </>
            )}
          </button>
          {inventoryOpen && isExpanded && (
            <div className="ml-12 mt-2 space-y-1 text-sm font-poppins">
              {[
                { name: 'Overview', path: '/dashboard/inventory' },
                { name: 'Manage', path: '/dashboard/inventory/manage' },
                { name: 'Usage Logs', path: '/dashboard/inventory/usage' },
              ].map((subItem) => (
                <Link
                  key={subItem.path}
                  href={subItem.path}
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    pathname === subItem.path 
                      ? 'text-[#3BA1AF] font-medium bg-blue-100/50' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-blue-50/50'
                  }`}
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>

      </nav>

      <div className="border-t border-blue-200/60 p-4">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center px-3 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-transparent cursor-pointer"
        >
          <FaSignOutAlt className="flex-shrink-0 text-slate-500 group-hover:text-red-500 transition-colors duration-200" size={18} />
          {isExpanded && (
            <span className="ml-4 font-medium text-sm">Sign Out</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
