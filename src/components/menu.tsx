import React, { useState, useEffect } from 'react'
import './menu.css'
import { Menu } from 'lucide-react'

function MenuBar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <nav className="navbar">
      <div className="nav-left">
        <Menu className="menu-icon" />
        <span className="menu-text">Menu</span>
      </div>
      
      <div className="nav-center">
        <h1 className="brand">VIRTUAL WARE</h1>
      </div>
      
      <div className="nav-right">
        <button className="btn btn-login">
          <span>Login</span>
          <span>Login</span>
        </button>
        <button className="btn btn-join">
          <span>Join</span>
          <span>Join</span>
        </button>
      </div>
    </nav>

    {/* Marquee Banner - Under the menu */}
    <div className={`marquee-banner ${isScrolled ? 'scrolled' : ''}`}>
      <div className="marquee-track">
        <span>EXPLORE THE OSMO SHOWCASE ✦</span>
        <span>EXPLORE THE OSMO SHOWCASE ✦</span>
        <span>EXPLORE THE OSMO SHOWCASE ✦</span>
        <span>EXPLORE THE OSMO SHOWCASE ✦</span>
        <span>EXPLORE THE OSMO SHOWCASE ✦</span>
        <span>EXPLORE THE OSMO SHOWCASE ✦</span>
      </div>
    </div>
    </>
  )
}

export default MenuBar