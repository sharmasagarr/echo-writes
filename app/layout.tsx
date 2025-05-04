import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Mynerve, Outfit } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import NavBar from "@/components/NavBar";

const mynerve = Mynerve({ weight: '400', subsets: ['latin'] })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: "EchoWrites",
  description: "Resonate, Write, Inspire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" 
      className={`${mynerve.className} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <Providers>
            <NavBar />
            {children}
            <Toaster position="top-center" />
          </Providers>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
