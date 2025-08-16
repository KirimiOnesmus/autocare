import { Login,Register } from './pages/auth'
import {Home,BusinessProfile,Bookings} from "./pages/customer"
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import "./index.css"
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/business/:id" element={<BusinessProfile />} />
        <Route path ="/bookings" element={<Bookings/>}/>
      </Routes>    
      </BrowserRouter>
      
    </>
  )
}

export default App
