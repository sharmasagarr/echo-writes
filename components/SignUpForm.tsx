'use client';

import { useState, useActionState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { signIn } from "next-auth/react";
import { signup } from "@/app/api/actions/auth";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [state, action, pending] = useActionState(signup, undefined);
  const router = useRouter();
  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const cleanUrl = url.toString();

  async function handleLogin(email:string, password:string) {
    try {
      // Attempt to log in the user in immediately after signup success
      const login = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (!login?.error) {
        router.push(cleanUrl, { scroll: false });
        toast.success("Sign up succesful.");
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
  }, [state?.success, email, password]);
  
  return (
    <>
      <div className='flex justify-between items-center'>
        <div className="flex items-center gap-2">
          <Image src="/logo-blue.svg" alt="logo-blue" width={50} height={50} />
          <span className="text-[#000000] dark:text-white text-lg">Join Echo Writes</span>
        </div>
        <button
          type="button"
          onClick={() => router.push(cleanUrl, { scroll: false })}
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition duration-200 ease-in-out cursor-pointer"
        >
          <X size={23} />
        </button>
      </div>
      <div className="text-[#000000] dark:text-gray-300 text-[12px] mt-2 ml-2">
        By clicking “Sign up”, you agree to our{" "}
        <Link href="/" className="text-[#0066ff] dark:text-blue-400">terms of service</Link>{" "} and acknowledge you have read our{" "}
        <Link href="/" className="text-[#0066ff] dark:text-blue-400">privacy policy</Link>.
      </div>
      <div className="flex flex-col gap-2 mt-3 items-center justify-center">
        <button
          onClick={async () => await signIn("google", {callbackUrl: cleanUrl})}
          className="w-full flex justify-center cursor-pointer border border-gray-400 dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          disabled={pending}
        >
          <div className="h-10 rounded-lg flex justify-center items-center gap-3">
            <Image src="/google.svg" alt="google-icon" className="block dark:hidden" width={25} height={25} />
            <Image src="/google-dark.svg" alt="google-icon" className="hidden dark:block" width={25} height={25} />
            <span className="text-black dark:text-white text-sm w-fit">Continue with Google</span>
          </div>
        </button>
        <button 
          onClick={async() => await signIn("github", {callbackUrl: cleanUrl})}
          className="w-full flex justify-center cursor-pointer border border-gray-400 dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          disabled={pending}
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
      <form action={action} className="text-black dark:text-white" id="signup-form">
        <label htmlFor="name" className="text-[15px] ml-1">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
          disabled={pending}
        />
        {state?.errors?.name && <div className="text-red-500 mt-1 text-[12px]">{state.errors.name}</div>}
        <label htmlFor="email" className="text-[15px] ml-1">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="abc@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
          disabled={pending}
        />
        {state?.errors?.email && <div className="text-red-500 mt-1 text-[12px]">{state.errors.email}</div>}
        <label htmlFor="password" className="text-[15px] ml-1">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="8+ characters (atleast 1 letter & 1 symbol)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 dark:border-gray-400 dark:bg-gray-850 dark:text-white rounded-md w-full pl-2 text-[0.8rem] h-8"
          disabled={pending}
        />
        {state?.errors?.password && (<div className="text-red-500 mt-1 text-[12px]">Password must {state.errors.password[0]}</div>)}
        <button
          type="submit"
          className={cn("cursor-pointer w-full mt-2 p-1 text-white text-[0.9rem] bg-[#0066ff] hover:bg-[#0053cc] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md",
            pending && 'bg-gray-400 dark:bg-gray-400 dark:hover:bg-gray-400 hover:cursor-not-allowed hover:bg-gray-400'
          )}
          disabled={pending}
        >
          {pending ? 'Signing Up...' : 'SignUp'}
        </button>
      </form>
      <div className="text-black dark:text-white text-[16px] mt-2">
        Already have an account?{" "}
        <button 
          className="text-[#0066ff] dark:text-blue-400 cursor-pointer"
          onClick={() => router.push(`?modal=login`, { scroll: false })}
          disabled={pending}
        >
          Log in
        </button>
      </div>
    </>
  );
}
