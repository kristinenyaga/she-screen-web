"use client"
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, CreditCard, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, Search, Filter, Download, Eye, ChevronDown, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '../AdminLayout';

const Billing = () => {
  const [dateFilter, setDateFilter] = useState('last-month');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // KPI Data
  const kpiData = {
    totalCollected: 3200,

  };

  const serviceBilling = [
    { service: 'Pap Smear', totalBilled: 660000, collected: 580000, outstanding: 80000 },
    { service: 'HPV DNA Test', totalBilled: 520000, collected: 450000, outstanding: 70000 },
    { service: 'Colposcopy', totalBilled: 480000, collected: 420000, outstanding: 60000 },
    { service: 'HPV Vaccination', totalBilled: 420000, collected: 380000, outstanding: 40000 },
    { service: 'Biopsy', totalBilled: 380000, collected: 320000, outstanding: 60000 }
  ];

  const monthlyTrends = [
    { month: 'June', collected: 1000, outstanding: 0 },
    { month: 'July', collected: 1200, outstanding: 0 },
  ];

  const patientBills = [
    {
      id: 'INV-2025-001',
      patientName: 'Mary Wanjiku',
      patientId: 'P-1001',
      service: 'Pap Smear Consultation',
      totalAmount: 2000,
      nhifAmount: 1000,
      patientAmount: 1000,
      paid: true,
      paymentMethod: 'NHIF + Cash',
      dateCreated: '2025-06-30',
      datePaid: '2025-06-30'
    },
    {
      id: 'INV-2025-002',
      patientName: 'Alice Kamau',
      patientId: 'P-1002',
      service: 'HPV DNA Test, Consultation',
      totalAmount: 3000,
      nhifAmount: 1800,
      patientAmount: 1200,
      paid: false,
      paymentMethod: '',
      dateCreated: '2025-07-18',
      datePaid: null
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-KE');
  };

  const getStatusBadge = (paid) => {
    if (paid) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 mr-1.5" />
          Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="h-3 w-3 mr-1.5" />
          Pending
        </span>
      );
    }
  };

  const filteredBills = patientBills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = paymentStatus === 'all' ||
      (paymentStatus === 'paid' && bill.paid) ||
      (paymentStatus === 'unpaid' && !bill.paid);
    return matchesSearch && matchesStatus;
  });

  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  const KPICard = ({ title, value, icon: Icon, color, subtitle, trend, trendDirection }) => (
    <div className="transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className={`text-2xl font-bold ${color} mb-2`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trendDirection === 'up' ? (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen font-inter w-[90%]">
        <div className="">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[25px] font-semibold text-gray-800 mb-2">Revenue Tracking</h1>
                <p className="text-gray-600">Monitor income from services and patient payments</p>

              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none"
                  >
                    <option value="last-month">Last Month</option>
                    <option value="last-3-months">Last 3 Months</option>
                    <option value="last-6-months">Last 6 Months</option>
                    <option value="last-year">Last Year</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <button className="px-4 py-2 bg-[#3BA1AF] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm">
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Collected"
              value={formatCurrency(kpiData.totalCollected)}
              icon={DollarSign}
              color="text-emerald-600"
              trend="8.2%"
              trendDirection="up"
            />

          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trends</h3>
              <p className="text-sm text-gray-500">Comparison of collected vs outstanding amounts</p>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Collected"
                  />
                  <Area
                    type="monotone"
                    dataKey="outstanding"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Outstanding"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
                <p className="text-sm text-gray-500">All invoices by patient, payment method, and status</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Pending</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NHIF</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient Pay</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {paginatedBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-700">
                        {bill.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                          <div className="text-sm text-gray-500">{bill.patientId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(bill.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(bill.nhifAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(bill.patientAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(bill.paid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bill.dateCreated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredBills.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{filteredBills.length}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Billing;