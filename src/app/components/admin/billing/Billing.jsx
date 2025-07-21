"use client"
import React, { useState,useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, Clock, CheckCircle, Search, Filter, Download, Eye, ChevronDown, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '../AdminLayout';
import PatientBillsTable from './PatientBillsTable';

const Billing = () => {
 const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState('last-month');

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

  const kpiData = {
    totalCollected: bills.reduce((sum, bill) =>
      bill.paid ? sum + (bill.patient_amount + (bill.nhif_amount || 0)) : sum, 0),
    totalBilled: bills.reduce((sum, bill) => sum + bill.base_cost, 0),
    totalOutstanding: bills.reduce((sum, bill) =>
      !bill.paid ? sum + (bill.patient_amount + (bill.nhif_amount || 0)) : sum, 0),
    totalBills: bills.length,
  };

  const monthlyTrends = bills.reduce((acc, bill) => {
    const date = new Date(bill.date_created);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    const key = month;

    const collected = bill.paid ? bill.patient_amount + (bill.nhif_amount || 0) : 0;
    const outstanding = bill.paid ? 0 : bill.patient_amount + (bill.nhif_amount || 0);

    const existing = acc.find(item => item.month === key);
    if (existing) {
      existing.collected += collected;
      existing.outstanding += outstanding;
    } else {
      acc.push({ month: key, collected, outstanding });
    }

    return acc;
  }, []);

  const patientBills = bills.map(bill => ({
    id: `INV-2025-${bill.id.toString().padStart(3, '0')}`,
    patientName: `${bill.patient.first_name} ${bill.patient.last_name}`,
    patientId: `P-${bill.patient.patient_code}`,
    service: bill.service.name,
    totalAmount: bill.base_cost,
    nhifAmount: bill.nhif_amount || 0,
    patientAmount: bill.patient_amount,
    paid: bill.paid,
    paymentMethod: bill.nhif_covered ? 'NHIF' : 'Cash',
    dateCreated: bill.date_created,
    datePaid: bill.paid ? bill.date_created : null
  }));

  if (loading) return <div className="p-4 text-center">Loading billing data...</div>;

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

            <PatientBillsTable paginatedBills={paginatedBills} />
p
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