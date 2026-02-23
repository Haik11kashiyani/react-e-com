import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './menu.css'
import { Menu as MenuIcon, X, ShoppingCart, Heart, Sun, Moon, User } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useTheme } from '../hooks/useTheme'

function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalItems } = useCart()
  const { dark, toggle } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
        window.removeEventListener('scroll', handleScroll)
        document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen])

  return (
    <>
    {/* Placeholder to prevent layout shift when navbar becomes fixed/absolute */}
    <div className="navbar-placeholder"></div>

    {/* Morphing Navbar Container */}
    <nav className={`navbar ${isMenuOpen ? 'open' : ''} ${isScrolled && !isMenuOpen ? 'scrolled-view' : ''}`}>
      
      {/* Header Section (Always Visible, transforms) */}
      <div className="navbar-header">
          <div className="nav-left" onClick={toggleMenu} style={{ cursor: 'pointer', zIndex: 20 }}>
            {isMenuOpen ? <X className="menu-icon" /> : <MenuIcon className="menu-icon" />}
            <span className="menu-text" style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                {isMenuOpen ? 'Close' : 'Menu'}
            </span>
          </div>
          
          <div className="nav-center">
            <Link to="/" className="brand" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>VIRTUAL WARE</Link>
          </div>
          
          <div className="nav-right">
            <Link to="/cart" className="nav-icon-link cart-icon-link" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="btn btn-join">
                <span>Join</span>
                <span>Join</span>
                </button>
            </Link>
          </div>
      </div>

      {/* Expanded Content (Hidden initially, fades in) */}
      <div className="menu-content">
            <div className="menu-column">
                <span className="menu-label">OUR PRODUCTS</span>
                <ul className="menu-links">
                    <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link></li>
                    <li><Link to="/products?category=phone" onClick={() => setIsMenuOpen(false)}>Phones</Link></li>
                    <li><Link to="/products?category=laptop" onClick={() => setIsMenuOpen(false)}>Laptops</Link></li>
                    <li><Link to="/products?category=audio" onClick={() => setIsMenuOpen(false)}>Audio</Link></li>
                    <li><Link to="/products?category=smartwatch" onClick={() => setIsMenuOpen(false)}>Smartwatches <span className="badge-new">NEW</span></Link></li>
                </ul>
            </div>

            <div className="menu-column">
                <span className="menu-label">EXPLORE</span>
                <ul className="menu-links">
                    <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                    <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                    <li><Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</Link></li>
                    <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
                </ul>
                <div className="menu-socials">
                    <a href="#">in</a>
                    <a href="#">ig</a>
                    <a href="#">x</a>
                </div>
            </div>

            <div className="menu-column">
                <span className="menu-label">ACCOUNT</span>
                <ul className="menu-links menu-links--sm">
                    <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                    <li><Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
                </ul>
                <button className="menu-theme-toggle" onClick={toggle}>
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
      </div>
    </nav>

    </>
  )
}

export default MenuBar