import React, { Suspense } from 'react';
import RiskAssessmentResults from "@/app/components/Dashboard/patients/risk-prediction/RiskAssessmentResults";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
      <RiskAssessmentResults />
    </Suspense>
  );
}
