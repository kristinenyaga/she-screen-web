"use client"
import React, { useState,useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, TestTube, Shield, AlertTriangle, Users, Calendar, TrendingUp, Package, Activity } from 'lucide-react';
import AdminLayout from './AdminLayout';

const Overview = () => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [recommendations, setRecommendations] = useState([])
  const [riskAssessment, setRiskAssessments] = useState([])
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([])
  const [bills, setBills] = useState([])
  const [user, setUser] = useState();
  
  const kpiData = {
    totalRevenue: bills.reduce((sum, bill) => sum + (bill.amount || 0), 0),
    unpaidInvoices: bills.filter(bill => bill.paid === false).length,
    totalLabTests: tests.length,
    lowStockAlerts: resources.filter(resource => resource.quantity_available <= resource.low_stock_threshold).length,
    totalPatients: patients.length
  };


const serviceRevenueMap = bills.reduce((acc, bill) => {
  const serviceName = bill.service?.name || 'Unknown';
  acc[serviceName] = (acc[serviceName] || { revenue: 0, count: 0 });
  acc[serviceName].revenue += bill.patient_amount || 0;
  acc[serviceName].count += 1;
  return acc;
}, {});

const topServices = Object.entries(serviceRevenueMap)
  .map(([service, { revenue, count }]) => ({ service, revenue, count }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);



const lowStockResources = resources.filter(
  (res) => res.quantity_available <= res.low_stock_threshold
);


  const revenueOverTime = bills.reduce((acc, bill) => {
  const date = new Date(bill.date_created);
  const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jul 2025"

  const existing = acc.find(item => item.month === monthYear);
  const revenue = bill.patient_amount || 0; 

  if (existing) {
    existing.revenue += revenue;
  } else {
    acc.push({ month: monthYear, revenue });
  }

  return acc;
}, []);

  const categoryColors = {
    Screening: '#3b82f6',
    Treatment: '#10b981',
    Consultation: '#ef4444',
    Other: '#a855f7'
  };

  const revenueByCategory = Object.entries(
    bills.reduce((acc, bill) => {
      const rawCategory = bill.service?.category || 'other';
      const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1); 
      acc[category] = (acc[category] || 0) + (bill.patient_amount || 0); 
      return acc;
    }, {})

  ).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || categoryColors.Other
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'Ksh',
      minimumFractionDigits: 0
    }).format(amount);
  };
  useEffect(() => {
      const fetchResources = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/resources/');
          const data = await res.json();
          setResources(data);
        } catch (error) {
          console.error('Failed to fetch resources:', error);
        }
      };
      fetchResources();
    }, []);

  useEffect(() => {
      const fetchPatients = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/patients');
          const data = await res.json();
          setPatients(data);
        } catch (err) {
          console.error('Failed to fetch patients', err);
        }
      };
        fetchPatients();
    }, []);
    
    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/recommendations');
          const data = await res.json();
          setRecommendations(data);
        } catch (err) {
          console.error('Failed to fetch patients', err);
        }
      };
    
        fetchRecommendations();
    }, []);
  
    useEffect(() => {
      const fetchRiskAssessmnet = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/patients/get-risk-assessments');
          const data = await res.json();
          setRiskAssessments(data);
        } catch (err) {
          console.error('Failed to fetch patients', err);
        }
      };
    
        fetchRiskAssessmnet();
    }, []);
  
  
    useEffect(() => {
      const fetchTests = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/lab-tests');
          const data = await res.json();
          setTests(data);
        } catch (err) {
          console.error('Failed to fetch lab tests', err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchTests();
    }, []);
  
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch('http://localhost:8000/billable-items');
        const data = await res.json();
        setBills(data);
      } catch (err) {
        console.error('Failed to fetch lab tests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
    }, []);

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
  

  const KPICard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-gray-100  ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
  const getCurrentFormattedDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
    
};
  return (
    <AdminLayout>
      <div className="min-h-screen font-poppins">
      <div className="">
      <div className="bg-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
                <h1 className="text-2xl font-semibold text-gray-800">Welcome back, { user?.first_name}</h1>
            <p className="text-sm text-gray-500 mt-1">Here’s a quick look at today’s activity and insights.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="font-semibold text-gray-800">{getCurrentFormattedDate()}</p>
            </div>
          </div>
        </div>
      </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <KPICard 
            title="Total Revenue" 
            value={formatCurrency(kpiData.totalRevenue)} 
            icon={DollarSign} 
            color="text-[#3BA1AF]" 
          />
          <KPICard 
            title="Unpaid Invoices" 
            value={kpiData.unpaidInvoices} 
            icon={FileText} 
            color="text-[#EF5B5B]" 
          />
          <KPICard 
            title="Lab Tests Ordered" 
            value={kpiData.totalLabTests} 
            icon={TestTube} 
            color="text-[#FFA447]" 
          />
          <KPICard 
            title="Low Stock Alerts" 
            value={kpiData.lowStockAlerts} 
            icon={AlertTriangle} 
            color="text-[#EF5B5B]" 
          />
          <KPICard 
            title="Total Patients" 
            value={kpiData.totalPatients} 
            icon={Users} 
            color="text-[#3A6FD7]" 
          />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Revenue by Category</h3>
              <p className="text-sm text-gray-500 mb-4">Breakdown of total revenue based on service categories like screening, vaccination and consultation</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Revenue Over Time</h3>
              <p className="text-sm text-gray-500 mb-4">Track how monthly revenue has changed within the year.</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `Ksh ${value / 1000}K`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Top Services by Revenue</h3>
              <p className="text-sm text-gray-500 mb-4">Most profitable services ranked by total revenue generated.</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topServices} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `KES ${value / 1000}K`} />
                  <YAxis dataKey="service" type="category" width={100} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Low Stock Resources</h3>
              <p className="text-sm text-gray-500 mb-4">Inventory items that are running low and may require restocking soon.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full  divide-y divide-gray-200">
                  <thead className="border border-gray-100 rounded-2xl">
                    <tr className='rounded-md'>
                      <th className="px-6 py-3 border  border-r border-gray-100 text-left text-xs font-medium text-gray-900 uppercase">Resource</th>
                      <th className="px-6 py-3 border border-r border-gray-100 text-left text-xs font-medium text-gray-900 uppercase">Available</th>
                      <th className="px-6 py-3 border border-r border-gray-100 text-left text-xs font-medium text-gray-900 uppercase">Low Stock Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lowStockResources.map((resource, index) => (
                      <tr key={index} className='bg-orange-50'>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-sm font-medium text-orange-700">{resource.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-sm text-orange-700">{resource.quantity_available}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-sm text-orange-700">{resource.low_stock_threshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
      </div>
    </div>
    </AdminLayout>
  );
};

export default Overview;