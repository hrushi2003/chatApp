import React, { useState } from 'react'
import logo from "./logo.gif"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const userLogin = () => {
     if(username !== "" && password !== ""){
        axios.post('https://chat-app-lovat-delta.vercel.app/login',{username,password}).then((response) => {
          console.log("Successfully logged in",response.data);
          localStorage.setItem('token', response.data.token);
          navigate('/chat');
        }).catch((err) => {
          console.log(err);
        })
     }else{
      alert("enter valid details");
     }
  }
  return (
    <div className=''>
        <img
        className='mx-auto w-[100px] h-[100px] flex mt-[120px]'
         src = {logo} alt='logo' />
         <div className='ml-[520px] shadow-2xl mt-[40px] border border-lime-500 w-max h-max p-5 rounded-lg flex flex-col bg-white'>
         <h1 className='mb-2 font-bold text-[12px]'>ENTER YOUR USERNAME : </h1>
           <input
           className='mb-4 border border-slate-900 rounded-md p-2 w-[400px] h-[35px]'
           placeholder='Enter your username'
           type='text'
           onChange={(e) => {
            setUsername(e.target.value);
           }}
            />
        <h1 className='mb-2 font-bold text-[12px]'>ENTER YOUR PASSWORD : </h1>
            <input
           className='mb-4 border rounded-md p-2 w-[400px] h-[35px] border-slate-900'
           placeholder='Enter your password'
           type='password'
           onChange={(e) => {
            setPassword(e.target.value);
           }}
            />
            <button
             className='mt-2 border rounded-md h-[35px] font-bold text-[15px]'
             onClick = {userLogin}
             >
            LOG IN
            </button>
            <p className='mt-3 mx-auto text-[13px] font-bold'>
                New to this app ? 
                <Link className='text-blue-600' to="/register"> Register</Link>
            </p>
         </div>
    </div>
  )
}

export default Login
