import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import mlogo from "./male.jpg";
import LoadingSpin from "react-loading-spin";
const AiChat = () => {
  const [userInp,setUserInp] = useState("");
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);
    const handleSubmit =async () => {
        if(userInp){
          setLoading(true);
          console.log(userInp);
          await axios.get(`https://chat-app-lovat-delta.vercel.app/chat/ai/${userInp}`).then((response) => {
            setMessages([...messages,{
              sender : userInp,
              bot: response.data.bot
            }]);
          }).catch((err) => {
            console.log(err);
          })
        setUserInp('');
        setLoading(false);
      }
      }
  return (
    <div className='w-[920px] ml-2 h-[820px] flex flex-col p-3 my-auto rounded-md bg-white'>
     <div className='mt-3 flex flex-row p-3 mx-auto border-[2px] bg-blue-300 rounded-md w-[100%]'>
     <img
     className='border-none rounded-full w-[80px] h-[80px] shadow-2xl'
      src={mlogo} />
      <h1 className='text-[20px] ml-4 my-auto font-bold'>AI</h1>
     </div>
     <div
      className='w-[100%] p-2 overflow-y-scroll mt-2 h-[80%] rounded-md bg-gray-100'
      >
        {messages.map((message,index) => {
         return (
          <div key={index}>
              <div
              className='w-[200px] mt-3 p-2 text-left h-max border shadow-2xl rounded-md bg-blue-200 ml-[76%]'
              >
                <p
                className='my-auto text-left text-[20px] italic indent-2 text-white font-bold mx-auto inline-block'
                >{message.sender}</p>
              </div>
              <div
              className='w-[400px] mt-3 p-2 text-left h-max border shadow-2xl rounded-md bg-white ml-[2%]'
              >
                <p
                className='my-auto italic indent-2 font-bold text-left mx-auto inline-block'
                >{message.bot}</p>
              </div>
              </div>
          )
        })}
      </div>
      <div className='flex mt-2 flex-row'>
        <input
        type='text'
        placeholder='Enter your text'
        value={userInp}
        onChange={(e) => {
          setUserInp(e.target.value);
        }}
        className='border w-[93%] h-[40px] p-2 my-auto rounded-md border-black'
         />
         {!loading ? 
         <button
         onClick={handleSubmit}
         className='ml-3 p-2 my-auto mx-auto rounded-md font-bold bg-blue-200'
         >Send</button>
          : 
          <button type="button" className="bg-indigo-500 rounded-md ml-2 p-2 flex flex-row">
           <LoadingSpin
             size="26px"
             numberOfRotationsInAnimation={4}
            />
            <p className='ml-2 text-white mx-auto font-bold'>processing...</p>
          </button>
        }
      </div>
    </div>
  )
}

export default AiChat;
