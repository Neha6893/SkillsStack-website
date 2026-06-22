import React from 'react'
import logo from "../ourResource/logo.svg";
import { useNavigate } from 'react-router-dom';
import ISUserLogged from './IsUserLogged';


const Nav = () => {
  const navigate =useNavigate();
  return (
        <div className=" flex h-20 p-4 mb-2 items-center justify-around bg-yellow-200 shadow-lg sticky ">
          <img src={logo} alt="logo" className="h-16 w-45 ml-14"></img>
          <div className="first-div font-semibold space-x-4 ml-auto pr-24 text-lg md:text-lg">
            <a href="/" className=" hover:text-blue-500">
              Home
            </a>
            <a href="/all" className="hover:text-blue-500">
              Browse Notes
            </a>
            <a href="/" className="hover:text-blue-500">
              Upload Notes
            </a>
            <a href="/" className="hover:text-blue-500">
              Leaderboard
            </a>
            <button>
              <ISUserLogged/>
            </button>

          </div>
        </div>
    )
}

export default Nav