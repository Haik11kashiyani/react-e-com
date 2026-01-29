import React from 'react'

function login() {
  return (
    <>
    <h1>
         login
    </h1>
    <div>
        <input type="text" placeholder='email'/>
        <input type="password" placeholder='password'/>
        <button>login</button>
        <p>don't have an account <a href="">signup</a></p>
        <p>forgot password <a href="">click here</a></p>
        
        <button>login with google</button>
        
    </div>
        </>
  )
}

export default login