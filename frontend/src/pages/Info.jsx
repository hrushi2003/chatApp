import React from 'react'
import home from "./home.jpg";
const Info = () => {
  return (
    <div className='w-[920px] ml-2 h-[800px] flex mt-2 flex-col p-3 my-auto rounded-md bg-chat-bg bg-white'>
        <img
        className='w-[50%] mt-[16%] mx-auto h-[50%] border rounded-2xl mb-4'
         src={home} />
       <h1 className='mx-auto p-4 w-[50%] rounded-xl text-center text-[20px] bg-white font-bold mb-2 text-green-600'
       >We're delighted you're here with us! Let's make sure you find exactly what you're looking for.</h1>
    </div>
  )
}

export default Info;