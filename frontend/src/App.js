import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import AddAvatar from './pages/AddAvatar'
import ChatHome from './pages/ChatHome'
const App = () => {
  return (
    <Routes>
      <Route path='/' element = {<Home />} />
      <Route path='/register' element = {<Register />} />
      <Route path='/login' element= {<Login />} />
      <Route path='/register/avatar' element ={<AddAvatar />}></Route>
      <Route path='/chat' element = {<ChatHome />}></Route>
    </Routes>
  )
}

export default App;