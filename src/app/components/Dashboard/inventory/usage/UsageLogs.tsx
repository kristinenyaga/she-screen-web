"use client";
import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "@/app/components/admin/AdminLayout";
import {
  PackageOpen,
  ShieldCheck,
  TestTube,
  Repeat,
} from "lucide-react";
type Resource = {
  name: string;
  unit_of_measure: string;
  quantity_available: number;
  low_stock_threshold: number;
  classification: string;
  resource_type: 'consumable' | 'reusable';
};

type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  patient_code: string;
};

type Service = {
  id: number;
  name: string;
};

type UsageLog = {
  id: number;
  date_used: string;
  resource?: Resource;
  patient?: Patient;
  service?: Service;
};
type KPICardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};
const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-800">{title}</p>
        <p className={`text-xl font-semibold ${color}`}>{value}</p>
      </div>
      <div
        className={`p-3 rounded-full bg-gray-100 ${color.replace(
          "text-",
          "bg-"
        ).replace("-600", "-100")}`}
      >
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

export default function UsageLogs() {
  const [logs, setLogs] = useState<UsageLog[]>([]);

  useEffect(() => {
    const fetchUsageLogs = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/usage-logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch usage logs", err);
      }
    };
    fetchUsageLogs();
  }, []);

  // 🔢 Compute KPIs from logs
  const kpiData = useMemo(() => {
    const totalUsedToday = logs.length;

    const resourceCount: Record<string, number> = {};
    const serviceCount: Record<string, number> = {};

    logs.forEach((log) => {
      const resource = log.resource?.name;
      const service = log.service?.name;

      if (resource) resourceCount[resource] = (resourceCount[resource] || 0) + 1;
      if (service) serviceCount[service] = (serviceCount[service] || 0) + 1;
    });

    const topUsedResource =
      Object.entries(resourceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const mostConsumedService =
      Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const reusableTools = logs.filter(
      (log) => log.resource?.resource_type === "reusable"
    ).length;

    return {
      totalUsedToday,
      topUsedResource,
      mostConsumedService,
      reusableTools,
    };
  }, [logs]);

  return (
    <AdminLayout>
      <div className="min-h-screen font-inter">
        <h1 className="text-2xl mb-5 font-semibold font-poppins text-[#3BA1AF]">
          Resource Usage Logs
        </h1>

        {/* ✅ KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Resources Used Today"
            value={kpiData.totalUsedToday}
            icon={PackageOpen}
            color="text-[#3A6FD7]"
          />
          <KPICard
            title="Top Used Resource"
            value={kpiData.topUsedResource}
            icon={ShieldCheck}
            color="text-[#EF5B5B]"
          />
          <KPICard
            title="Most Consumed Service"
            value={kpiData.mostConsumedService}
            icon={TestTube}
            color="text-[#F97316]"
          />
          <KPICard
            title="Reusable Tools Logged"
            value={kpiData.reusableTools}
            icon={Repeat}
            color="text-[#10B981]"
          />
        </div>

        <div className="bg-white mb-5 flex flex-wrap gap-4 items-center p-4 rounded-md shadow">
          <input
            type="text"
            placeholder="Search patient or resource..."
            className="w-64 px-3 py-3 border border-gray-200 rounded text-sm"
          />
          <select className="px-3 py-3 border border-gray-200 rounded text-sm text-gray-700">
            <option>Date: Today</option>
            <option>This Week</option>
            <option>Custom Range</option>
          </select>
          <select className="px-3 py-3 border border-gray-200 rounded text-sm text-gray-700">
            <option>Classification</option>
            <option>Consumable</option>
            <option>Reusable</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-800 font-poppins text-left">
              <tr>
                <th className="px-4 py-4">Date/Time</th>
                <th className="px-4 py-4">Resource</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Quantity</th>
                <th className="px-4 py-4">Used For</th>
                <th className="px-4 py-4">Patient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-gray-800">
                    {new Date(log.date_used).toDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-gray-800">
                    {log.resource?.name}
                  </td>
                  <td className="px-4 py-3.5 text-gray-800">
                    <span
                      className={`inline-block py-1.5 px-4 rounded-full text-sm font-medium ${log.resource?.resource_type === "reusable"
                          ? "bg-blue-100 text-[#3BA1AF]"
                          : "bg-[#fad5ea] text-[#ed1191]"
                        }`}
                      title={
                        log.resource?.resource_type === "reusable"
                          ? "Reusable. Quantity = uses logged"
                          : "Consumable. Deducted from inventory"
                      }
                    >
                      {log.resource?.resource_type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-800">1</td>
                  <td className="px-4 py-3.5 text-gray-800">
                    {log.service?.name}
                  </td>
                  <td className="px-4 py-3.5 text-gray-800">
                    {log.patient
                      ? `${log.patient.first_name} ${log.patient.last_name}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
