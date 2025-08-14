import { Login,Register } from './pages/auth'
import {Home} from "./pages/customer"
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
      </Routes>    
      </BrowserRouter>
      
    </>
  )
}

export default App
