"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const cleanUrl = url.toString();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid credentials" : res.error);
      } else if (res?.ok) {
        setEmail("");
        setPassword("");
        router.push(cleanUrl);
        toast.success("Login successful");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className='flex justify-between items-center'>
        <div className="flex items-center gap-2">
          <Image src="/logo-blue.svg" alt="logo-blue" width={50} height={50} />
          <span className="text-[#000000] dark:text-white text-lg">Welcome Back 😊</span>
        </div>
        <X
          onClick={() => router.push(cleanUrl)}
          className='w-5 h-5 cursor-pointer'
        />
      </div>
      <div className="text-[#000000] dark:text-gray-300 text-[12px] mt-2 ml-2">
        By continuing, you agree to our{" "}
        <Link href="/" className="text-[#0066ff] dark:text-blue-400">
          terms of service
        </Link>{" "}
        and acknowledge you have read our{" "}
        <Link href="/" className="text-[#0066ff] dark:text-blue-400">
          privacy policy
        </Link>.
      </div>
      <div className="flex flex-col gap-2 mt-3 items-center justify-center">
        <button 
          onClick={() => signIn("google", {callbackUrl: cleanUrl})}
          className="w-full flex justify-center  cursor-pointer border border-gray-400 dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <div className="h-10 rounded-lg flex justify-center items-center gap-3">
            <Image src="/google.svg" alt="google-icon" className="block dark:hidden" width={25} height={25} />
            <Image src="/google-dark.svg" alt="google-icon" className="hidden dark:block" width={25} height={25} />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Google</span>
          </div>
        </button>
        <button 
          onClick={() => signIn("github", {callbackUrl: cleanUrl})}
          className="w-full flex justify-center cursor-pointer border border-gray-400 dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <div className="h-10 rounded-lg flex justify-center items-center gap-3">
            <Image src="/github.svg" alt="github-icon" className="block dark:hidden" width={25} height={25} />
            <Image src="/github-dark.svg" alt="github-icon" className="hidden dark:block" width={25} height={25} />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Github</span>
          </div>
        </button>
      </div>
      <hr className="mt-6 border-gray-300 dark:border-white" />
      <div className="-mt-[14px] flex justify-center">
        <span className="w-fit text-gray-400 dark:text-gray-200 text-[16px] bg-white dark:bg-gray-900 pl-2 pr-2">OR</span>
      </div>
      <form className="text-black dark:text-white" onSubmit={handleLogin}>
        <label htmlFor="email" className="text-[15px] ml-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
          required
        />
        <label htmlFor="password" className="text-[15px] ml-1">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
          required
        />
        {error && <div className="text-red-500 mt-1 text-[12px] text-center">{error}</div>}
        <button
          type="submit"
          className={cn("cursor-pointer w-full mt-2 p-1 text-white text-[0.9rem] bg-[#0066ff] hover:bg-[#0053cc] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md",
            loading && 'bg-gray-400 hover:cursor-not-allowed hover:bg-gray-400'
          )}
          disabled={loading}
        >
          {loading ? 'Loging In...' : 'Login'}
        </button>
      </form>
      <div className="text-black dark:text-white text-[16px] mt-2">
        Don&apos;t have an account?{" "}
        <button
          className="text-[#0066ff] dark:text-blue-400 cursor-pointer"
          onClick={() => router.push(`${cleanUrl}/?modal=signup`)}
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
