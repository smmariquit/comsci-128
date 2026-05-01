
"use client"

import { useState } from "react"
import AssignmentClient from "./AssignmentClient"

type Unit = {
  id: number
  name: string
  occupants: number
  freeSlots: number
  bedType: string
}

type Applicant = {
  application_id: number
  expected_moveout_date: string
  student_account_number: number | null
  student: any
}

export default function AssignmentWrapper({ 
        units: initialUnits, 
        initialApplicants, 
        housingId 
    }: { 
        units: Unit[]; 
        initialApplicants: Applicant[]; 
        housingId: number 
    }) {

  const [applicants, setApplicants] = useState(initialApplicants)
  const [units, setUnits] = useState(initialUnits)
  
  return (
    <AssignmentClient
      units={units}
      setUnits={setUnits}
      applicants={applicants}
      setApplicants={setApplicants}
      housingId={housingId}
    />
  )
}