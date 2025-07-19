"use client"
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, TestTube, Shield, AlertTriangle, Users, Calendar, TrendingUp, Package, Activity } from 'lucide-react';
import AdminLayout from './AdminLayout';

const Overview = () => {
  const [dateFilter, setDateFilter] = useState('last-month');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const kpiData = {
    totalRevenue: 3200,
    unpaidInvoices: 0,
    totalLabTests: 3,
    lowStockAlerts: 2,
    totalPatients: 5
  };

  const revenueByCategory = [
    { name: 'Screening', value: 800, color: '#3b82f6' },
    { name: 'Treatment', value: 300, color: '#10b981' },
    { name: 'Consultation', value: 300, color: '#ef4444' }
  ];

  const revenueOverTime = [
    { month: 'Jul', revenue: 1000 }

  ];

  const paymentSplit = [
    { name: 'NHIF', amount: 1900000, color: '#059669' },
    { name: 'Out-of-Pocket', amount: 950000, color: '#dc2626' }
  ];

  const topServices = [
    { service: 'Pap Smear', revenue: 660000, count: 132 },
    { service: 'HPV DNA Test', revenue: 520000, count: 104 },
    { service: 'Colposcopy', revenue: 480000, count: 48 },
    { service: 'HPV Vaccination', revenue: 420000, count: 84 },
    { service: 'Biopsy', revenue: 380000, count: 38 }
  ];


  const lowStockResources = [
    { resource: 'HPV Test Kit', available: 30, threshold: 30, service: 'HPV DNA Test' },
    { resource: 'Cytobrush', available: 50, threshold: 50, service: 'Pap Smear' },
  ];

  const serviceUtilization = [
    { service: 'Pap Smear', timesUsed: 132, revenue: 660000, avgCost: 5000 },
    { service: 'HPV DNA Test', timesUsed: 104, revenue: 520000, avgCost: 5000 },
    { service: 'Colposcopy', timesUsed: 48, revenue: 480000, avgCost: 10000 },
    { service: 'HPV Vaccination', timesUsed: 84, revenue: 420000, avgCost: 5000 },
    { service: 'Biopsy', timesUsed: 38, revenue: 380000, avgCost: 10000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'Ksh',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
            <h1 className="text-2xl font-semibold text-gray-800">Welcome back, Jane</h1>
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
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-sm font-medium text-orange-700">{resource.resource}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-sm text-orange-700">{resource.available}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-sm text-orange-700">{resource.threshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Service Utilization</h3>
              <p className="text-sm text-gray-500 mb-4">How frequently each service was used and the revenue it generated.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceUtilization.map((service, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.timesUsed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(service.revenue)}</td>
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