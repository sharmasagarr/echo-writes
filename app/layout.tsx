import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Mynerve, Niconne, Outfit } from 'next/font/google'

const mynerve = Mynerve({ weight: '400', subsets: ['latin'] })
const niconne = Niconne({ weight: '400', subsets: ['latin'] })
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
      className={`${mynerve.className} ${niconne.className} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
