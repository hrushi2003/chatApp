import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import mlogo from './male.jpg';
import glogo from "./female.jpg";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAvatar = () => {
    const [gender,setGender] = useState("M");
    const inpRef = useRef(null);
    const [user,SetUser] = useState({
        id : "",
        username : ""
    });
    const [profilePic,setProfilePic] = useState(null);
    const navigate = useNavigate();
    const handleImage = () => {
        inpRef.current.click();
    }
    const handleChange = (event) => {
        const file = event.target.files[0];
        setProfilePic(file);
    }
    const handleUpload = async () => {
       if(profilePic){
        const formData = new FormData();
        formData.append('image', profilePic);
        try{
            await axios.post(`http://localhost:3000/avatar/${user._id}`,formData).then((res)=>{
                navigate('/chat');
            });
       }catch(err){
        console.error(err);
       }
      }else{
        if(gender === "M"){
            fetch(mlogo).then(response => response.blob())
            .then(async (blob) => {
                const formData = new FormData();
                formData.append('image',blob);
                try{
                    await axios.post(`http://localhost:3000/avatar/${user._id}`,formData).then((res)=>{
                        navigate('/chat');
                    });
                  }catch(err){
                    toast.error("Error occured in uploading image, Try again!",{
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
            }).catch((err) => {
                toast.error("Error occured in uploading image, Try again!",{
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
        }
        else{
            fetch(glogo).then(response => response.blob())
            .then(async (blob) => {
                const formData = new FormData();
                formData.append('image',blob);
                try{
                    await axios.post(`http://localhost:3000/avatar/${user._id}`,formData).then((res)=>{
                        navigate('/chat');
                    });
                  }catch(err){
                    console.error(err);
                }    
            }).catch((err) => {
                alert("image uploading failed, try again!");
            })
        }
      }
    }
    useEffect(() => {
        async function validate(){
        const token = localStorage.getItem("token");
        if(token === null || token === ""){
            navigate('/');
        }else{
    const headers = {
        Authorization : `Bearer ${token}`
    };
      await axios.get("http://localhost:3000/register/avatar", {headers}).then((response) => {
        SetUser(response.data.user);
      }).catch((err) => {
        console.log(err);
        navigate('/');
      });
    }
    }
    validate();
    },[]);
  return (
    <div 
    className='w-[350px] mb-4 h-max border shadow-2xl p-4 border-green-200 flex flex-col mt-[200px] rounded-xl bg-gradient-to-b from-blue-500 to-green-300 mx-auto'
    >
        <ToastContainer />
    <div className='w-full h-[50%] flex flex-col mx-auto my-auto'>
       <img 
       className='mx-auto border-[3px] cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 border-blue-400 rounded-full w-[200px] h-[200px] shadow-2xl'
       src = {profilePic ? URL.createObjectURL(profilePic) : (gender === "M" ? mlogo : glogo)} alt='avatar'
       onClick={handleImage}
        />
       <input
       className='mx-auto'
        type='file'
        hidden = {true}
        accept='image/*' 
        onChange={handleChange}
        ref={inpRef}    
        />
    </div>
    <div
     className='mx-auto mt-4 flex flex-col'
     >
    <h1 
    className='mx-auto font-bold text-[24px] text-white'
    >{user.username}</h1>
     <label className='mx-auto font-bold text-[14px] text-white' htmlFor ="gender">choose gender</label>
    <div 
    className='mx-auto mt-2'>
        <select
        onChange={(e) => {
            setGender(e.target.value);
            console.log(e.target.value);
        }}
        className='w-[100px] border-[2px] text-white font-bold border-green-300 p-2 rounded-md bg-transparent shadow-xl'
         name='gender' id='gender'>
            <option value="M">Male</option>
            <option value="F">Female</option>
        </select>
    </div>
    <button className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 mx-auto mt-4 font-bold w-[300px] text-white shadow-2xl p-2 border rounded-md bg-gradient-to-br from-blue-500 to-green-300 border-blue-400'
    onClick={handleUpload}
    >CONTINUE</button>
    </div>
    </div>
  )
}

export default AddAvatar;
