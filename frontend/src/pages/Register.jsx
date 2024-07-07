import React, { useState } from 'react'
import logo from "./logo.gif"
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPass,setConfirmPass] = useState('');
  const containsSpecialChars =(str) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }
  const isValidUser = () => {
    return !containsSpecialChars(username);
  }
  const isValidEmail = () => {
    if(email === ""){
      return true;
    }
    return /@/.test(email);
  }
  const isvalidPassword = () => {
    if(containsSpecialChars(password) && password === confirmPass){
      return true;
    }else if(password === ""){
      return true;
    }
    else{
      return false;
    }
  }
  const submitUser =() => {
       if((isValidEmail && isValidUser) && isvalidPassword){
        if((username !== "" && password !== "" ) && username !== ""){
           axios.post('https://chat-app-lovat-delta.vercel.app/register',{
            username,
            password,
            email
          }).then((response) => {
            localStorage.setItem("token",response.data.token);
            console.log(localStorage.getItem("token"));
            navigate('/register/avatar');
          }).catch((err) => {
            console.log(err);
            alert("Enter valid details")
           // navigate('/register');
          })
          return;
        }
       }
       alert("Enter valid details");
  }
  return (
    <div className ='w-auto h-auto'>
        <img
        className='mx-auto w-[100px] h-[100px] bg-chat-bg flex mt-[120px]'
         src = {logo} alt='logo' />
        <div className='ml-[520px] shadow-2xl mt-[40px] border border-lime-500 w-max h-max p-5 rounded-lg flex flex-col bg-white'>
            <h1 className='mb-2 ml-1 font-bold text-[12px]'>ENTER YOUR USERNAME : </h1>
           <input
           className='mb-3 border border-slate-900 rounded-md p-2 w-[400px] h-[35px]'
           name='username'
           placeholder='Enter your username'
           type='text'
           onChange={(e) => {
            setUsername(e.target.value);
           }}
            />
            {isValidUser() === true ? ""
            : <span className='text-red-500 mb-2 text-[12px]'>username should not contain specialChars</span>
            }
             <h1 className='mb-2 font-bold text-[12px] ml-1'>ENTER YOUR EMAIL : </h1>
            <input
           className='mb-3 border rounded-md p-2 w-[400px] h-[35px] border-slate-900'
           name='email'
           placeholder='Enter your email'
           type='email'
           onChange={(e) => {
            setEmail(e.target.value);
           }}
            />
            {isValidEmail() === true ? ""
            : <span className='text-red-500 mb-2 text-[12px]'>Enter valid email</span>
            }
             <h1 className='mb-2 font-bold text-[12px] ml-1'>ENTER YOUR PASSWORD : </h1>
            <input
           className='mb-3 border rounded-md p-2 w-[400px] h-[35px] border-slate-900'
           name='password'
           placeholder='Enter your password'
           type='password'
           onChange={(e) => {
            setPassword(e.target.value);
           }}
            />
            {isvalidPassword() === true ? "" 
            : <span className='text-red-500 mb-2 text-[12px]'>Enter valid password</span>
            }
             <h1 className='mb-2 font-bold text-[12px] ml-1'>CONFIRM YOUR PASSWORD : </h1>
            <input
           className='mb-3 border rounded-md p-2 w-[400px] h-[35px]  border-slate-900'
           name='confirmPass'
           placeholder='confirm your password'
           type='password'
           onChange={(e) => {
            setConfirmPass(e.target.value);
           }}
            />
            <button
             className='mt-2 border rounded-md h-[35px] font-bold text-[15px]'
             onClick={submitUser}>
            SUBMIT
            </button>
            <p className='mt-3 mx-auto text-[13px] font-bold'>
                Already have an account? 
                <Link className='text-blue-600' to="/login"> Login</Link>
            </p>
        </div>
    </div>
  )
}

export default Register;
