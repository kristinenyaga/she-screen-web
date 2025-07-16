'use client';
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import { Chart, registerables } from 'chart.js';
import DashboardLayout from './DashboardLayout';
Chart.register(...registerables);

const pastelColors = {
  red: '#FFB3B3',
  yellow: '#FFF0B3',
  green: '#B3FFB3',
  blue: '#B3D9FF',
  purple: '#E6CCFF',
  pink: '#FFCCE5',
};

const Overview = () => {
  const router = useRouter();

  // Dummy KPI stats
  const kpis = [
    { label: 'Total Patients', value: 1200, color: pastelColors.blue },
    { label: 'New Patients This Week', value: 34, color: pastelColors.pink },
    { label: 'Patients Assessed', value: 950, color: pastelColors.green },
    { label: 'Pending Assessments', value: 150, color: pastelColors.yellow },
    { label: 'Lab Tests Completed', value: 720, color: pastelColors.purple },
    { label: 'Recommendations Completed', value: 680, color: pastelColors.red },
  ];

  const riskChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Patients',
        data: [24, 35, 41],
        backgroundColor: [pastelColors.red, pastelColors.yellow, pastelColors.green],
      },
    ],
  };

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Patients',
        data: [50, 70, 90, 60, 80, 100],
        borderColor: pastelColors.pink,
        backgroundColor: pastelColors.pink,
        tension: 0.3,
      },
      {
        label: 'Assessments',
        data: [20, 60, 80, 70, 75, 90],
        borderColor: pastelColors.blue,
        backgroundColor: pastelColors.blue,
        tension: 0.3,
      },
    ],
  };

  const labTestsPipeline = [
    { label: 'Pap Smear', completed: 80, pending: 20 },
    { label: 'HPV DNA', completed: 60, pending: 40 },
    { label: 'Biopsy', completed: 30, pending: 70 },
  ];

  const insights = [
    {
      text: '12 patients awaiting test results',
      tag: 'Follow-up',
    },
    {
      text: '5 high-risk patients not seen by a doctor',
      tag: 'Urgent',
    },
    {
      text: '8 recommendations pending resources',
      tag: 'Pending',
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-6 py-8 font-inter text-gray-800 space-y-12">

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg shadow-sm"
              style={{ backgroundColor: kpi.color }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">{kpi.label}</p>
              <h2 className="text-3xl font-bold mt-2">{kpi.value}</h2>
            </div>
          ))}
        </div>
        <div className='flex'>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Risk Level Distribution</h2>
            <Bar data={riskChartData} options={{ plugins: { legend: { display: false } } }} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Monthly Patient Activity</h2>
            <Line data={monthlyChartData} />
          </div>
        </div>
        {/* Lab Test Pipeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Lab Tests Pipeline</h2>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => router.push('/dashboard/lab-tests')}
            >
              View All Lab Tests →
            </button>
          </div>
          <div className="space-y-4">
            {labTestsPipeline.map((test, idx) => {
              const total = test.completed + test.pending;
              const percent = ((test.completed / total) * 100).toFixed(0);
              return (
                <div key={idx}>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {test.label} — {percent}% completed
                  </p>
                  <div className="w-full h-4 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-green-300"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Actionable Insights</h2>
          <ul className="space-y-3">
            {insights.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-md"
              >
                <span>{item.text}</span>
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                  {item.tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
