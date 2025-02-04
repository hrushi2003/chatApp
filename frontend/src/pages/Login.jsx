import React, { useState } from 'react'
import logo from "./logo.gif"
import { Link } from 'react-router-dom';
import axios from 'axios';
import eyeClose from "./eyeClose.png";
import eye from "./eye.png";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [username,setUsername] = useState('');
  const[visibilty,setVisibility] = useState(false);
  const [password,setPassword] = useState('');
  const userLogin = () => {
     if(username !== "" && password !== ""){
        axios.post('https://chatapp-yf38.onrender.com/login',{username,password}).then((response) => {
          localStorage.setItem('token', response.data.token);
          navigate('/chat');
        }).catch((err) => {
          toast.error('Invalid username or password',{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
     }else{
       toast.error("Enter valid details",{
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
       });
     }
  }
  const changeVisibility = () => {
    setVisibility(!visibilty);
  }
  return (
    <div className=''>
       <ToastContainer/>
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
        <div className='mx-auto flex flex-row border border-slate-900 rounded-md pl-2'>
            <input
           className='rounded-md align-middle w-[360px] h-[35px]'
           placeholder='Enter your password'
           type={visibilty ? 'text': 'password'}
           onChange={(e) => {
            setPassword(e.target.value);
           }}
          />
          <button onClick={changeVisibility} className='w-[25px] ml-1 mx-auto my-auto h-[35px]'><img className='mx-auto align-middle w-[25px] pr-2' src= {visibilty ? eye : eyeClose}/></button>
          </div>
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
