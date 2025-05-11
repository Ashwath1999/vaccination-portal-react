import { useState } from 'react'
import Login from './components/login/Login'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from './components/dashboard/Dashboard'
import ManageStudents from './components/manage-students/ManageStudents'
import VaccinationDrives from './components/vaccination-drives/ManageVaccinationDrives'
import VaccinationRecords from './components/vaccination-records/VaccinationRecords'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/students" element={<ManageStudents />}/>
          <Route path="/drives" element={<VaccinationDrives />}/>
          <Route path="/records" element={<VaccinationRecords />}/>
          <Route path="/Logout" element={<Login />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
