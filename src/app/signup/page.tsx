'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: ""
  });

  useEffect(() => {
    const canvas = document.getElementById('gradient-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const animate = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#1a1a40');
          gradient.addColorStop(1, '#000000');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          requestAnimationFrame(animate);
        };
        animate();
      }
    }
  }, []);

  const saveUserToDatabase = async (userData: {
    user_id: string;
    email: string;
    username: string;
    full_name: string;
    date_of_birth?: string;
    photo_url?: string;
  }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user data');
      }
  
      return await response.json();
    } catch (error: any) {
      console.error('Error saving user:', error);
      throw new Error(error.message || 'Failed to save user data');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const username = formData.email.split('@')[0];

      await saveUserToDatabase({
        user_id: userCredential.user.uid,
        email: formData.email,
        username: username,
        full_name: formData.name,
        date_of_birth: formData.dateOfBirth
      });

      router.push("/additional-details");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const username = user.email?.split('@')[0] || '';

      await saveUserToDatabase({
        user_id: user.uid,
        email: user.email!,
        username: username,
        full_name: user.displayName || username,
        photo_url: user.photoURL || undefined,
        date_of_birth: '' // For Google sign-in, we'll collect this in additional details
      });

      router.push("/additional-details");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen relative">
      <canvas id="gradient-canvas" className="absolute top-0 left-0 w-full h-full -z-10" />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join us on your journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-transparent">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-gray-600 rounded-lg text-white transition duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-400 hover:text-purple-300 transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;