import { FC } from "react";
import { MessageCircle, PhoneCall, Calendar, Users, AlertTriangle } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  riskLevel: "Low" | "Medium" | "High";
  lastScreeningDate?: string;
}

const riskConfig = {
  Low: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-400"
  },
  Medium: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-400"
  },
  High: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: "bg-red-100 text-red-600",
    dot: "bg-red-400"
  },
};

const patients: Patient[] = [
  {
    id: "1",
    name: "Jane Mwangi",
    age: 36,
    phone: "254712345678",
    riskLevel: "High",
    lastScreeningDate: "2025-05-12",
  },
  {
    id: "2",
    name: "Aisha Kamau",
    age: 29,
    phone: "254798765432",
    riskLevel: "Medium",
    lastScreeningDate: "2025-04-18",
  },
  {
    id: "3",
    name: "Grace Wanjiku",
    age: 42,
    phone: "254701234567",
    riskLevel: "Low",
    lastScreeningDate: "2025-06-01",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const PatientTable: FC = () => {
  return (
    <div className="p-6 font-montserra">
      <p className="text-xl text-slate-800">Patient List</p>
      <div className="bg-white rounded-2xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/30">
                <th className="text-left px-6 py-4 text-sm text-gray-600">Patient</th>
                <th className="text-left px-6 py-4 text-sm text-gray-600">Age</th>
                <th className="text-left px-6 py-4 text-sm text-gray-600">Risk Level</th>
                <th className="text-left px-6 py-4 text-sm text-gray-600">Last Screening</th>
                <th className="text-left px-6 py-4 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className="group hover:bg-slate-50/50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#3BA1AF] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{patient.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-medium">{patient.age} years</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${riskConfig[patient.riskLevel].dot}`}></div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${riskConfig[patient.riskLevel].color}`}>
                        {patient.riskLevel} Risk
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {patient.lastScreeningDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">
                          {formatDate(patient.lastScreeningDate)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                        <span className="text-slate-400 italic font-medium">No screening</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${patient.phone}?text=Hello%20${patient.name},%20we'd%20like%20to%20follow%20up%20on%20your%20cervical%20screening.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn p-2.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 border border-emerald-200 hover:border-emerald-300"
                        title={`Call ${patient.name}`}
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>

                      <button
                        className="group/btn p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200 hover:border-blue-300"
                        title={`Message ${patient.name}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State (if no patients) */}
        {patients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No patients found</h3>
            <p className="text-slate-600">Start by adding your first patient to the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTable;