import React from 'react'
import HeroSec from './components/heroSec'
import Menu from './components/menu'
import Footer from './components/footer'
import CoresolMarq from './components/coresolMarq'
import ReviweUser from './reviwe-user'
import ProductCompare from './components/ProductCompare'
import BrandFeatures from './components/BrandFeatures'
function App() {
  return (
    <div>
      <Menu/>
      <HeroSec/>
      <CoresolMarq/>
      {/* <FeaturedProducts/> */}
      <ProductCompare/>
      <BrandFeatures/>
      
      {/* <ReviweUser/> */}
      <Footer/> 
    </div>
  )
}

export default App