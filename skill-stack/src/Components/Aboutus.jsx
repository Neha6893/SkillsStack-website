import React from "react";
import { useNavigate } from 'react-router-dom';


export default function AboutUs() {
  const navigate =useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 text-black px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

        {/* Intro */}
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">
          Welcome to <span className="font-semibold">SkillStack</span> — 
          your go-to platform for sharing, accessing, and learning through study notes. 
          We believe education thrives when knowledge is shared freely.
        </p>

        {/* Two Column Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p>
              To empower learners with tools and resources that make studying easier, 
              more organized, and more accessible. We want to help you learn smarter, not harder.
            </p>
          </div>

          {/* What We're Building */}
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold">What We're Building</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Secure authentication & session management</li>
              <li>Responsive UI with Tailwind CSS</li>
              <li>MySQL database for storing notes & user data</li>
              <li>Payment integration for premium content</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Join Us on This Journey</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            We are currently in the development phase, but our vision is clear: 
            to make learning collaborative and barrier-free for everyone.
          </p>
          <button className="bg-black text-yellow-300 px-6 py-3 rounded-2xl font-medium hover:bg-gray-800"
            onClick={()=>{navigate("/")}}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
