'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import ClickOutside from '@/components/ClickOutside';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          // First set basic Firebase data
          setUser({
            name: currentUser.displayName || 'User',
            image: currentUser.photoURL || '/images/user/user-01.png',
            email: currentUser.email,
            role: 'User',
          });

          // Fetch additional data from Astra DB
          const response = await fetch(`/api/users?userId=${currentUser.uid}`);
          const data = await response.json();

          // Update user state with Astra DB data if available
          if (data && !data.error) {
            setUser((prev: { name: any; image: any }) => ({
              ...prev,
              name: data.full_name || prev.name,
              image: data.photo_url || prev.image,
              role: 'Member', // You can fetch this from your database
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        router.push('/signin');
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
    <header className="sticky top-0 z-999 flex w-full bg-white dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-0.5 px-4">
        <div className="flex items-center gap-3">
          {/* Profile Dropdown */}
          <ClickOutside onClick={() => setDropdownOpen(false)}>
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4 cursor-pointer"
              >
                <span className="hidden text-right lg:block">
                  <span className="block text-sm font-medium text-black dark:text-white">
                    {user?.name || 'Loading...'}
                  </span>
                  <span className="block text-xs font-medium">
                    {user?.role || 'Loading...'}
                  </span>
                </span>

                <span className="h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={user?.image || '/images/user/user-01.png'}
                    alt="User"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </span>
              </div>

              {/* Dropdown Start */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                    <li>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                      >
                        Account Settings
                      </Link>
                    </li>
                  </ul>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </ClickOutside>
        </div>
      </div>
    </header>
  );
};

export default Header;
