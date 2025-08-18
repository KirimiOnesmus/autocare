import React from 'react'
import { Login, Register } from './pages/auth'
import { Home, BusinessProfile, Bookings } from "./pages/customer"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BusinessDashboard from './pages/business/BusinessDashboard'
import Overview from './components/layout/Overview'
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/business/:id" element={<BusinessProfile />} />
        <Route path="/bookings" element={<Bookings/>}/>

        <Route path="/business/dashboard" element={<BusinessDashboard />}>
          <Route index element={<Overview />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App