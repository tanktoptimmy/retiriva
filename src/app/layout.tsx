"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans transition-colors overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div className="min-h-screen">
            <Header />
            <main className="min-h-screen p-4 sm:p-6 max-w-full overflow-x-hidden">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="px-4 py-3 shadow flex justify-end items-center transition-colors min-w-0 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <ThemeToggle />
    </header>
  );
}
