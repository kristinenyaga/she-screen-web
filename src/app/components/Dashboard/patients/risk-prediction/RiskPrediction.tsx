"use client"
import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { useRouter } from 'next/navigation';
import { MdInfo } from 'react-icons/md';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RiskPrediction = () => {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient_id');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number:'',
    date_of_birth: '',
    area_of_residence: '',
    is_sexually_active: '',
    number_of_sexual_partners: '',
    first_sexual_intercourse_age: '',
    smoking_status: '',
    stds_history: '',
    hpv_result: '',
    immune_compromised: '',
    immune_condition_detail:'',
    contraceptive_using: '',
   contraceptive_use_years: '',
    hpv_vaccinated: '',
    has_children: '',
    children_count: '',
    first_pregnancy_age: '',
    family_history: '',
  });
  const immuneConditions = [
    "HIV/AIDS",
    "Undergoing cancer treatment",
    "Organ transplant (on immunosuppressants)",
    "Long-term corticosteroid use",
    "Autoimmune disease (e.g. lupus, rheumatoid arthritis)",
    "Diabetes (type 1 or 2)",
    "Other"
  ];
  
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  async function getCurrentUserId() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("http://127.0.0.1:8000/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.id;
  }
  
  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      let patientIdToUse = patientId;
      let newPatientCreated = false;

      if (!patientIdToUse) {
        const res = await fetch("http://localhost:8000/patients/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth: formData.date_of_birth,
            area_of_residence: formData.area_of_residence,
            phone_number: formData.phone_number,
            created_by_id: await getCurrentUserId(),
          }),
        });

        if (!res.ok) throw new Error("Failed to create patient");

        const patient = await res.json();
        patientIdToUse = patient.id;
        newPatientCreated = true;
      }

      const profileRes = await fetch("http://localhost:8000/patient-profiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          patient_id: patientIdToUse,
          contraceptive_use_years: parseInt(formData.contraceptive_use_years || "0"),
          children_count: parseInt(formData.children_count || "0"),
          number_of_sexual_partners: parseInt(formData.number_of_sexual_partners || "0"),
          first_sexual_intercourse_age: parseInt(formData.first_sexual_intercourse_age || "0"),
        }),
      });

      if (!profileRes.ok) throw new Error("Failed to create patient profile");

      const predictionRes = await fetch("http://localhost:8000/patients/risk-assessment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: patientIdToUse,
          number_of_sexual_partners: parseInt(formData.number_of_sexual_partners || "0"),
          first_sexual_intercourse_age: parseInt(formData.first_sexual_intercourse_age || "0"),
          smoking_status: formData.smoking_status,
          stds_history: formData.stds_history,
        }),
      });

      if (!predictionRes.ok) throw new Error("Prediction failed");

      const prediction = await predictionRes.json();
      router.push(`/dashboard/patients/risk-prediction-results?patient=${prediction.patient_id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };
  


  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;

      const res = await fetch(`http://127.0.0.1:8000/patients/${patientId}`);
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        area_of_residence: data.area_of_residence,
        date_of_birth: data.date_of_birth,
      }));
    };

    fetchPatient();
  }, [patientId]);


  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-[50vw] font-montserrat space-y-8">
        <h1 className="text-xl font-medium font-poppins">New Risk Assessment</h1>

        <div className="relative">
          <div className="flex justify-between mb-3 z-50">
            {['Personal Info', 'History', 'Additional'].map((label, i) => (
              <div key={label} className='flex items-center gap-5'>
                <div className="flex flex-col items-center text-xs font-medium">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step === i + 1 ? 'bg-[#3BA1AF] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {i + 1}
                  </div>
                  <span className={`mt-2 text-sm text-center ${step === i + 1 ? 'text-[#3BA1AF]' : 'text-gray-600'}`}>{label}</span>
                </div>
                <div className={`w-[300px] h-[1px] bg-[#3BA1AF] ${i === 2 ? 'hidden' : 'block'}`} />
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="flex items-start gap-3  border-l-4 bg-gray-50  p-4 rounded-md">
              <MdInfo className="mt-1 text-xl" />
              <p className="text-base text-gray-600">
                <strong>Step 1:</strong> Basic personal details to identify the patient and support risk profiling.
              </p>
            </div>
            {patientId ? (
              <div className="space-y-4 text-gray-700">
                <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                {/* <p><strong>Phone:</strong> {formData.phone_number}</p> */}
                <p><strong>Location:</strong> {formData.area_of_residence}</p>
                <p><strong>Date of Birth:</strong> {formData.date_of_birth}</p>
              </div>
            ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">Patient&apos;s First Name?</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">Patient&apos;s Last Name?</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">Patient&apos;s Phone number?</label>
                    <input name="phone_number" type='phone' value={formData.phone_number} onChange={handleChange} className="w-full border border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">Where do you currently live?</label>
                    <input name="area_of_residence" value={formData.area_of_residence} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">What is your date of birth?</label>
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                </div>
            )}

          </>
        )}

        {step === 2 && (
          <>

            <div className="flex items-center gap-3  border-l-4 bg-gray-50  p-4 rounded-md">
              <MdInfo className=" text-xl" />
              <p className="text-base text-gray-600">
                <strong className="">Step 2:</strong> Enter lifestyle and medical history of the patient for risk assessment.
              </p>
            </div>
            <div className="space-y-5">

              <div>
                <label className="block mb-1 font-medium text-gray-600">Do you smoke?</label>
                <select name="smoking_status" value={formData.smoking_status} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Have you ever been diagnosed with an STD?</label>
                <select name="stds_history" value={formData.stds_history} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">What was the result of your last HPV test?</label>
                <select name="hpv_result" value={formData.hpv_result} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                  <option value="Unknown">Never been tested</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Are you sexually active?</label>
                <select name="is_sexually_active" value={formData.is_sexually_active} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData.is_sexually_active === 'Yes' && (
                <>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">How many sexual partners have you had?</label>
                    <input name="number_of_sexual_partners" value={formData.number_of_sexual_partners} onChange={handleChange} placeholder="e.g. 3 or 'Prefer not to say'" className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">At what age was your first sexual intercourse?</label>
                    <input name="first_sexual_intercourse_age" value={formData.first_sexual_intercourse_age} onChange={handleChange} placeholder="e.g. 17 or 'Prefer not to say'" className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center gap-3  border-l-4 bg-gray-50  p-4 rounded-md">
              <MdInfo className=" text-xl" />
              <p className="text-base text-gray-600 font-medium">
                <strong>Step 3:</strong> Additional clinical risk factors (optional but valuable for future care).
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block mb-1 font-medium text-gray-600">Have you received the HPV vaccine?</label>
                <select name="hpv_vaccinated" value={formData.hpv_vaccinated} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Do you have any children?</label>
                <select name="has_children" value={formData.has_children} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData.has_children === 'Yes' && (
                <>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">How many children do you have?</label>
                    <input name="children_count" value={formData.children_count} onChange={handleChange} className="w-full border border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-600">At what age did you have your first full-term pregnancy?</label>
                    <input name="first_pregnancy_age" value={formData.first_pregnancy_age} onChange={handleChange} className="w-full border border-gray-300 px-3 py-3 rounded-md focus:outline-none focus:border-gray-400 text-gray-700" />
                  </div>
                </>
              )}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Have you been diagnosed with an immune-compromising condition?
                  <span className="block text-sm text-gray-500">
                    (e.g., HIV, cancer, transplants, autoimmune disorders)
                  </span>
                </label>
                <select
                  name="immune_compromised"
                  value={formData.immune_compromised}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-4 rounded-md mb-3"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Unsure">Not Sure</option>
                </select>

                {formData.immune_compromised === 'Yes' && (
                  <div className="mt-2">
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                      Select the immune-compromising condition
                    </label>
                    <select
                      name="immune_condition_detail"
                      value={formData.immune_condition_detail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-4 rounded-md"
                    >
                      <option value="">Choose condition</option>
                      {immuneConditions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-600">Are you currently using oral contraceptives?</label>
                <select name="contraceptive_using" value={formData.contraceptive_using} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData.contraceptive_using === 'Yes' && (
                <div>
                  <label className="block mb-1 font-medium text-gray-600">Have you used oral contraceptives for more than 5 years?</label>
                  <select name="contraceptive_use" value={formData.contraceptive_use_years} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unsure">Not Sure</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block mb-1 font-medium text-gray-600">Is there a family history of cervical cancer?</label>
                <select name="family_history" value={formData.family_history} onChange={handleChange} className="w-full border border-gray-300 px-3 py-4 rounded-md focus:outline-none focus:border-gray-400 text-gray-700">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Unsure">Not Sure</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 flex gap-5">
          {step > 1 && (
            <button onClick={prevStep} className="text-base cursor-pointer px-14 py-4 bg-gray-100 rounded-md">Back</button>
          )}
          {step < 3 && (
            <button onClick={nextStep} className="text-base cursor-pointer px-14 py-4 bg-[#3BA1AF] text-white rounded-md">Next</button>
          )}
          {step === 3 && (
            <button onClick={() => {
              handleSubmit()
              // router.push('/dashboard/patients/risk-assessment')
            }} className="text-base cursor-pointer px-14 py-4 bg-[#3BA1AF] text-white rounded-md">
              Run Prediction
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiskPrediction;
