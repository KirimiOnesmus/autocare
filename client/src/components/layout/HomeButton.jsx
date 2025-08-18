import React from 'react'
import { MdHome } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const HomeButton = ({ className }) => {
    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate('/home'); 
    };
  return (
    <button
      onClick={handleHomeClick}
      className={`bg-blue-500 text-white hover:bg-white hover:text-blue-500 rounded-full text-2xl p-4 hover:border border-blue-500 cursor-pointer ${className}`}
    >
      <MdHome />
    </button>
)
}

export default HomeButton