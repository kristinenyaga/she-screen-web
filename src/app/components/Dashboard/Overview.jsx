"use client";
import React, { useState } from 'react';
import {
  Users, AlertTriangle, TestTube, Calendar, Shield, FileText, Activity
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import DashboardLayout from './DashboardLayout';

const Overview = () => {
  const kpiData = {
    totalPatients: 5,
    highRiskPatients: 1,
    labTestsOrdered: 2,
    labTestsCompleted: 3,
  };

  const riskDistribution = [
    { name: 'Low Risk', value: 2, color: '#10b981' },
    { name: 'Medium Risk', value: 2, color: '#f59e0b' },
    { name: 'High Risk', value: 1, color: '#ef4444' },
  ];



  const formatNumber = (num) => num.toLocaleString();

  const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{formatNumber(value)}</p>
        </div>
        <div className={`p-3 rounded-full bg-gray-100 ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const recommendationTypes = [
  { name: 'Pap Smear', count: 2, color: '#3BA1AF' },
  { name: 'HPV DNA Test', count: 3, color: '#10b981' },
  { name: 'HPV Vaccination', count: 1, color: '#F97316' }
];




  return (
    <DashboardLayout>
      <div className="min-h-screen font-poppins">
        <div className="mb-6 bg-white">
          <h1 className="text-2xl font-semibold text-gray-800">Doctor's Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your patient outcomes and clinical activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Patients Assessed" value={kpiData.totalPatients} icon={Users} color="text-[#3A6FD7]" />
          <KPICard title="High Risk Patients" value={kpiData.highRiskPatients} icon={AlertTriangle} color="text-[#EF5B5B]" />
          <KPICard title="Lab Tests Ordered" value={kpiData.labTestsOrdered} icon={FileText} color="text-[#F97316]" />
          <KPICard title="Lab Tests Completed" value={kpiData.labTestsCompleted} icon={Activity} color="text-[#10B981]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Risk Level Distribution</h3>
            <p className="text-sm text-gray-500 mb-4">Breakdown of current patient risk levels</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Recommendation Types Breakdown</h3>
            <p className="text-sm text-gray-500 mb-4">What services are most frequently recommended to patients</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recommendationTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => `${value} patients`} />
                <Bar dataKey="count">
                  {recommendationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Lab Test Progress</h3>
          <p className="text-sm text-gray-500 mb-4">Track how many lab tests have been ordered vs completed</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { label: 'Ordered', value: kpiData.labTestsOrdered },
              { label: 'Completed', value: kpiData.labTestsCompleted }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default Overview;
