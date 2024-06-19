import React from 'react'
import { useNavigate } from 'react-router-dom'
import home from "./home.jpg";
const Home = () => {
    const navigate = useNavigate();
    const handleChange = () => {
        navigate('/login');
    }
  return (
    <div className='w-[540px] p-4 mx-auto bg-blend-multiply mt-[60px] shadow-xl rounded-xl h-max flex flex-col bg-white border border-green-300'>
        <img
        className='w-full mx-auto h-[50%] border rounded-2xl mb-4'
         src={home} />
       <h1 className='mx-auto text-center font-bold mb-2 text-green-600'
       >We're delighted you're here with us! Let's make sure you find exactly what you're looking for.</h1>
       <button
       className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 border-[2px] h-[40px] shadow-xl bg-green-400 rounded-md'
       onClick={handleChange}
       >GET STARTED</button>
    </div>
  )
}

export default Home