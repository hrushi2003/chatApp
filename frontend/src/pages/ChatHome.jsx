import React, { useState,useEffect } from 'react';
import AiChat from './AiChat';
import Info from './Info';
import mlogo from "./male.jpg";
import FriendChat from './FriendChat';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
const ChatHome = () => {
  const navigate = useNavigate();
  const [activeId,setActiveId] = useState('');
  const [aiActive,setAiActive] = useState(false);
  const [friends,setFriends] = useState([]);
  const [user,SetUser] = useState({});
  const getFriends = async () => {
    const token = localStorage.getItem("token");
    if(token === null || token === ""){
        navigate('/');
    }else{
      const headers = {
        Authorization : `Bearer ${token}`
      };
      await axios.get("https://chat-app-self-five.vercel.app/chat/users", {headers}).then((response) => {
        console.log(response.data.user)
        setFriends(response.data.friends);
        SetUser(response.data.user);
      }).catch((err) => {
        console.log(err);
      });
    }  
  };
 /* const getImage = async (data) => {
    return 'data:image/jpeg;base64,'+data;
  }*/
  const activateAi = () => {
    setAiActive(!aiActive);
  }
  useEffect(()=>{
    getFriends();
    },[]);
  return (
    <div className="flex flex-col">
      <div className='w-[100%] h-[60px] mx-auto rounded-md bg-green-300'>
           <button className='bg-white w-[100px] h-[40px] ml-[92%] mt-2 rounded-md'
           onClick={()=>{
            localStorage.clear();
            navigate("/");
           }}>
            Logout
           </button>
      </div>
    <div className='ml-3 flex mt-1 flex-row'>
    <div
    className='w-[520px] border rounded-md h-[820px] my-auto bg-blue-300 flex flex-col shadow-xl'
    >
     <div className='mt-6 flex flex-row hover:cursor-pointer p-3 mx-auto border-[2px] border-black w-[92%]' 
     onClick={activateAi}
     >
     <img
     className='border-none shadow-md rounded-full w-[50px] h-[50px]'
      src={mlogo} alt='ai-profile' />
      <h1 className='text-[20px] ml-4 my-auto font-bold'>AI</h1>
     </div>
     {friends.map((val,index) => {
        return (
        <div key={val.id} onClick={() => setActiveId(val.id)} className='mt-6 flex flex-row p-3 hover:cursor-pointer mx-auto border-[2px] rounded-md border-white w-[92%]'
        >
     <img
     className='border-none shadow-md rounded-full w-[50px] h-[50px]'
      src={"data:image/png;base64,"+val.imageData} alt='profile photo' />
      <h1 className='text-[20px] ml-4 my-auto font-bold'>{val.username}</h1>
     </div>
        )
      })}
    </div>
    <div>
      {aiActive ? <AiChat /> : activeId !== "" ? <FriendChat userId = {activeId} currUser = {user.username} details = {friends} /> : <Info />}
    </div>
    </div>
    </div>
  )
}

export default ChatHome;
