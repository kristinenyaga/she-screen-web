import React, { Suspense } from 'react';
import RiskPrediction from "@/app/components/Dashboard/patients/risk-prediction/RiskPrediction";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
        <RiskPrediction />
    </Suspense>)
}