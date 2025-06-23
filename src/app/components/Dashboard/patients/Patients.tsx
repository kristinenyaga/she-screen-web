import React from 'react'
import DashboardLayout from '../DashboardLayout'
import PatientTable from './PatientsTable'

const Patients = () => {
  return (
    <DashboardLayout>
      <PatientTable />
    </DashboardLayout>
  )
}

export default Patients