import React, { useEffect, useRef, useState } from 'react';
import LoadingSpin from "react-loading-spin";
import {io} from "socket.io-client";
import axios from 'axios';
import {v4 as uuidv4} from "uuid";
const socket = io('https://chat-app-lovat-delta.vercel.app',{
    auth: {
      serverOffset: 0
    },
     withCredentials: true,
     extraHeaders: {
        "my-custom-header": "abcd"
    },
    ackTimeout: 10000,
    retries: 3,
});
const FriendChat = (props) => {
    socket.auth = {username : props.currUser};
    const [userInp,setUserInp] = useState('');
    const [history,setHistory] = useState([]);
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [online,setOnline] = useState(true);
    const scrollRef = useRef();
    const userData = props.details.filter(user => user.id === props.userId);
    useEffect(() => {
      const fetchChat = async () => {
        try{
       const response =  await axios.post("https://chat-app-lovat-delta.vercel.app/chat/chatHistory",{
        user1 : props.currUser,
        user2 : userData[0].username
      });
      setHistory(prevHistory => [...prevHistory,...response.data.messages]);
    }catch(err){
      console.log(err);
    }
      };
      fetchChat(); 
    },[]);
    /*const handleSubmit = (props) => {
      setLoading(true);
      if(userInp !== ""){
        setMessages([...messages,{
          sender : userInp,
          bot : userInp
        }]);
      }
      setUserInp("");
      setLoading(false);
    };*/
    useEffect(() => {
      socket.emit('authenticate',props.currUser);
      return () => {
        socket.disconnect();
      }
    },[props.currUser]);

    useEffect(() => {
    try{ 
      socket.on("privateMessage",(message,serverOffset)=> {
        setMessages([...messages,{
          bot : message
        }]
        );
        socket.auth.serverOffset = serverOffset;
      });
    }catch(error){
      console.log(error);
    }
  },[messages]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  },[messages])
    const handleMessages  = () => {
      setLoading(true);
      if (userInp === "") return;
      setMessages([...messages,{
        sender : userInp
      }])
     // const socket = io('http://localhost:3000');
      const message = userInp;
      const recipient = userData[0].username;
      const uniqueOffset = uuidv4();
      socket.emit("private",{recipient,message,sender : props.currUser,Unique : uniqueOffset});
      setUserInp("");
      setLoading(false);
    }
  return (
    <div className='w-[920px] ml-2 h-[820px] flex flex-col p-3 my-auto rounded-md bg-white'>
     <div className='mt-3 flex flex-col p-3 mx-auto border-[2px] bg-orange-50 rounded-md w-[100%]'>
      <div className='flex flex-row'>
     <img
     className='border-none rounded-full w-[80px] h-[80px] shadow-2xl'
      src={"data:image/png;base64,"+userData[0].imageData} alt='display picture' />
      <div className='mt-5'>
      <h1 className='text-[22px] text-blue-600 ml-4 my-auto font-bold'>{userData[0].username}</h1>
      {online ? (<p className='ml-4 font-bold text-green-500 text-[19px]'>Online</p>) : 
      (<p className='ml-4 font-bold text-red-500 text-[19px]'>Offline</p>)
      } 
      </div>
      </div>
     </div>
     <div
      className='w-[100%] p-2 overflow-y-scroll mt-2 h-[80%] rounded-md bg-gray-100'
      >

       {history.map((chats,index) => {
         return (
          <div key={chats._id}>
            {chats.sender === props.currUser ? (
              <div
              className='w-[200px] mt-3 p-2 text-left h-max border shadow-2xl rounded-md bg-blue-200 ml-[76%]'
              >
                <p
                className='my-auto text-left text-[20px] italic indent-2 text-white font-bold mx-auto inline-block'
                >{chats.message.text}</p>
              </div>
            ): ""}
              {chats.sender === userData[0].username ? (
              <div key={chats._id}
              className='w-[400px] mt-3 p-2 text-left h-max border shadow-2xl rounded-md bg-white ml-[2%]'
              >
                <p
                className='my-auto italic indent-2 font-bold text-left mx-auto inline-block'
                >{chats.message.text}</p>
              </div>
              ) : ""}
              </div>
          )
        })}
        {messages.map((message,index) => {
         return (
          <div ref={scrollRef} key={index}>
            {message.sender ? (
              <div
              className='w-[200px] mt-3 p-2 text-left h-max border shadow-2xl rounded-md bg-blue-200 ml-[76%]'
              >
                <p
                className='my-auto text-left text-[20px] italic indent-2 text-white font-bold mx-auto inline-block'
                >{message.sender}</p>
              </div>
            ): ""}
              {message.bot ? (
              <div
              className='w-[400px] mt-3 p-2 text-left h-max border shadow-2xl rounded-md bg-white ml-[2%]'
              >
                <p
                className='my-auto italic indent-2 font-bold text-left mx-auto inline-block'
                >{message.bot}</p>
              </div>
              ) : ""}
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
         onClick={handleMessages}
         className='ml-3 p-2 my-auto mx-auto rounded-md font-bold bg-blue-200'
         >Send</button>
          : 
          <button type="button" class="bg-indigo-500 rounded-md ml-2 p-2 flex flex-row">
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
export default FriendChat
