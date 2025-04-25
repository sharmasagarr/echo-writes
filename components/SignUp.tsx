'use client';

import { useState, useActionState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { signIn } from "next-auth/react";
import { signup } from "@/app/actions/auth";

export default function SignUp({ setIsClickedLogin }: {setIsClickedLogin: (value: boolean) => void}) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [state, action, pending] = useActionState(signup, undefined);

  console.log(state);

  async function handleLogin(email:string, password:string) {
    try {
      // Attempt to log the user in immediately after signup success
      const login = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (login?.error) {
          alert("User created succesfully.");
      } else {
        alert("User signed up and logged in successfully.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        message: "An error occurred while logging in. Please try again later.",
      };
    }
  }

  useEffect(() => {
    if (state?.success) {
      handleLogin(email, password);
    }
  }, [state?.success]);
  
  return (
    <>
      <div className="flex items-center gap-2">
        <Image src="/logo-blue.svg" alt="logo-blue" width={50} height={50} />
        <span className="text-[#000000] dark:text-white text-lg">Join Echo Writes</span>
      </div>
      <div className="text-[#000000] dark:text-gray-300 text-[12px] mt-2 ml-2">
        By clicking “Sign up”, you agree to our{" "}
        <Link href="/" className="text-[#0066ff] dark:text-blue-400">terms of service</Link>{" "} and acknowledge you have read our{" "}
        <Link href="/" className="text-[#0066ff] dark:text-blue-400">privacy policy</Link>.
      </div>
      <div className="flex flex-col gap-2 mt-3 items-center justify-center">
        <button
          onClick={async () => await signIn("google")}
          className="w-full flex justify-center cursor-pointer border border-gray-400 dark:border-white rounded-md"
        >
          <div className="h-10 pl-2 rounded-lg flex items-center gap-3">
            <Image src="/google.svg" alt="google-icon" width={23} height={23} />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Google</span>
          </div>
        </button>
        <button 
            onClick={async() => await signIn("github")}
            className="w-full flex justify-center cursor-pointer border border-gray-400 dark:border-white rounded-md"
        >
          <div className="h-10 pl-2 rounded-lg flex items-center gap-3">
            <Image src="/github.svg" alt="github-icon" className="block dark:hidden" width={23} height={23} />
            <Image src="/github-dark.svg" alt="github-icon" className="hidden dark:block" width={28} height={28} />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Github</span>
          </div>
        </button>
      </div>
      <hr className="mt-6 border-gray-300 dark:border-white" />
      <div className="-mt-[14px] flex justify-center">
        <span className="w-fit text-gray-400 dark:text-gray-200 text-[16px] bg-white dark:bg-gray-900 pl-2 pr-2">OR</span>
      </div>
      <form action={action} className=" text-black dark:text-white">
        <label htmlFor="name" className="text-[16px] ml-1">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
        />
        {state?.errors?.name && <div className="text-red-500 mt-1 text-[12px]">{state.errors.name}</div>}
        <label htmlFor="email" className="text-[16px] ml-1">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="abc@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
        />
        {state?.errors?.email && <div className="text-red-500 mt-1 text-[12px]">{state.errors.email}</div>}
        <label htmlFor="password" className="text-[16px] ml-1">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="8+ characters (atleast 1 letter & 1 symbol)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
        />
        {state?.errors?.password && (<div className="text-red-500 mt-1 text-[12px]">Password must {state.errors.password[0]}</div>)}
        {state?.message && <div className="text-red-500 mt-1 text-[12px] text-center">{state.message}</div>}
        <button
          type="submit"
          className={`cursor-pointer w-full mt-2 p-1 text-white text-[0.9rem] bg-[#0066ff] hover:bg-[#0053cc] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md ${
            pending ? 'bg-gray-400' : ''
          }`}
          disabled={pending}
        >
          {pending ? 'Signing Up...' : 'SignUp'}
        </button>
      </form>
      <div className="text-black dark:text-white text-[16px] mt-2">
        Already have an account?{" "}
        <button className="text-[#0066ff] dark:text-blue-400 cursor-pointer" onClick={() => setIsClickedLogin(true)}>
          Log in
        </button>
      </div>
    </>
  );
}
