'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#2D1B69] text-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Logo, Name, Description & Socials */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* Replace with your actual logo */}
              <div className="w-10 h-10 relative">
                <Image 
                  src="/images/logo/logo.png"
                  alt="Logo"
                  fill
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold">SoulBuddy</h3>
            </div>
            
            <p className="text-gray-300 max-w-sm">
            Personalized Rituals and Recommendations for Your Unique Journey.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          
          {/* Center Section - Quick Links */}
          <div className="md:col-span-1 flex justify-center">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/dashboard" 
                    className="hover:text-white transition-colors hover:underline"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/breathing" 
                    className="hover:text-white transition-colors hover:underline"
                  >
                    Breathing Exercises
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/meditation" 
                    className="hover:text-white transition-colors hover:underline"
                  >
                    Meditation Sessions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right Section - Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              {/* <p>Email: support@mindfulspace.com</p> */}
              <p>Phone: 846949594</p>
              <p>Address: SVNIT - Surat, Ichchanath, Keval chowk - 395007</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} MindfulSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer