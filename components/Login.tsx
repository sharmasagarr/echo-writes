"use client";

import { useState } from 'react';
import { signIn } from "next-auth/react";

export default function Login({ setIsClickedLogin }: { setIsClickedLogin: (value: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        console.log("Login successful");
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
      <div className="flex items-center gap-2">
        <img src="/logo-blue.svg" alt="logo-blue" className="h-8 w-8" />
        <span className="text-[#000000] dark:text-white text-lg">Welcome Back 😊</span>
      </div>
      <div className="text-[#000000] dark:text-gray-300 text-[12px] mt-2 ml-2">
        By continuing, you agree to our{" "}
        <a href="/" className="text-[#0066ff] dark:text-blue-400">
          terms of service
        </a>{" "}
        and acknowledge you have read our{" "}
        <a href="/" className="text-[#0066ff] dark:text-blue-400">
          privacy policy
        </a>.
      </div>
      <div className="flex flex-col gap-2 mt-3 items-center justify-center">
        <button 
          onClick={() => signIn("google")}
          className="cursor-pointer border border-gray-600 dark:border-white rounded-md"
        >
          <div className="w-50 h-10 pl-2 rounded-lg flex items-center gap-3">
            <img src="/google.svg" alt="google-icon" className="w-5 h-5" />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Google</span>
          </div>
        </button>
        <button 
          onClick={() => signIn("github")}
          className="cursor-pointer border border-gray-400 dark:border-white rounded-md"
        >
          <div className="w-50 h-10 pl-2 rounded-lg flex items-center gap-3">
            <img src="/github.svg" alt="github-icon" className="w-5 h-5 block dark:hidden" />
            <img src="/github-dark.svg" alt="github-icon" className="w-5 h-5 hidden dark:block" />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Github</span>
          </div>
        </button>
      </div>
      <hr className="mt-6 border-gray-300 dark:border-white" />
      <div className="-mt-[14px] flex justify-center">
        <span className="w-fit text-gray-400 dark:text-gray-200 text-[16px] bg-white dark:bg-gray-900 pl-2 pr-2">OR</span>
      </div>
      <form className="text-black dark:text-white p-4 -mt-[15px]" onSubmit={handleLogin}>
        <label htmlFor="email" className="text-[16px] ml-2">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
          required
        />
        <label htmlFor="password" className="text-[16px] ml-2">Password</label>
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
          className={`cursor-pointer w-full mt-2 p-1 text-white text-[0.9rem] bg-[#0066ff] hover:bg-[#0053cc] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md ${
            loading ? 'bg-gray-400' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Loging In...' : 'Login'}
        </button>
      </form>
      <div className="text-black dark:text-white text-[16px]">
        Don't have an account?{" "}
        <button
          className="text-[#0066ff] dark:text-blue-400 cursor-pointer"
          onClick={() => setIsClickedLogin(false)}
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
