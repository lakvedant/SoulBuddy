'use client'

import Image from "next/image";
import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          setUser({
            name: currentUser.displayName || 'User',
            image: currentUser.photoURL || '/images/user/user-01.png',
            email: currentUser.email
          });

          const response = await fetch(`/api/users?userId=${currentUser.uid}`);
          const data = await response.json();

          if (data && !data.error) {
            setUser((prev: { name: any; image: any; }) => ({
              ...prev,
              name: data.full_name || prev.name,
              image: data.photo_url || prev.image,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="w-full flex justify-center py-4 px-6 fixed z-50">
      <div className="w-fit flex items-center border border-white bg-black/10 backdrop-blur-sm rounded px-6 py-2">
        {/* Logo Section */}
        <div className="flex items-center mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-white font-semibold">SoulBuddy</span>
          </Link>
        </div>

        {/* Menu Items */}
        <ul className="flex items-center space-x-8">
          <li>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </li>

          {/* Auth Section */}
          <li className="ml-4">
            {user ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="hidden md:flex md:flex-col md:items-end mr-3">
                    <span className="text-sm font-semibold text-white">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user.email}
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src={user.image}
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-purple-600 hover:border-purple-700 transition-all"
                    />
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <DashboardIcon className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <SettingsIcon className="w-4 h-4" />
                          Settings
                        </Link>
                        <hr className="my-2 border-white/10" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full text-left"
                        >
                          <LogoutIcon className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/signin" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <PersonIcon className="w-4 h-4" />
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};