import React from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import MainPrincipal from './components/MainPrincipal'

function App() {

  return (
    <>
      <Header></Header>
      <Navbar></Navbar>
      <MainPrincipal></MainPrincipal>
      <h1>Esto es el Index</h1>
      <Footer></Footer>
    </>
  )
}

export default App
