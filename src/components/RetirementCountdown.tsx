"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface RetirementCountdownProps {
  retirementDate: Date | null;
  retirementAge: number | null;
}

interface CountdownTime {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function RetirementCountdown({ retirementDate, retirementAge }: RetirementCountdownProps) {
  const { resolvedTheme } = useTheme();
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolved theme to determine dark mode, fallback to false during SSR
  const darkMode = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    if (!retirementDate || !mounted) return;

    const calculateTimeLeft = (): CountdownTime => {
      const now = new Date();
      const target = new Date(retirementDate.getTime());

      if (target.getTime() <= now.getTime()) {
        return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      // Calculate years by comparing full years
      let years = target.getFullYear() - now.getFullYear();
      let tempDate = new Date(now.getFullYear() + years, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
      
      // If we've gone past the target date, subtract a year
      if (tempDate.getTime() > target.getTime()) {
        years--;
        tempDate = new Date(now.getFullYear() + years, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
      }

      // Calculate months
      let months = 0;
      while (true) {
        const nextMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + months + 1, tempDate.getDate(), tempDate.getHours(), tempDate.getMinutes(), tempDate.getSeconds());
        if (nextMonth.getTime() > target.getTime()) {
          break;
        }
        months++;
      }
      
      // Update temp date to include the months
      tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth() + months, tempDate.getDate(), tempDate.getHours(), tempDate.getMinutes(), tempDate.getSeconds());
      
      // Calculate remaining time in milliseconds
      const remainingMs = target.getTime() - tempDate.getTime();
      
      // Calculate days, hours, minutes, seconds from the remaining milliseconds
      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      return { years, months, days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [retirementDate, mounted]);

  if (!retirementDate || !timeLeft || !mounted) {
    return null;
  }

  const isRetired = timeLeft.years === 0 && timeLeft.months === 0 && timeLeft.days === 0 && 
                   timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isRetired) {
    return (
      <div className={`p-6 rounded-xl shadow-lg text-center bg-gradient-to-br ${
        darkMode 
          ? 'from-green-900/50 to-emerald-900/50 border-green-700/30' 
          : 'from-green-50 to-emerald-50 border-green-200'
      } border`}>
        <h2 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-green-200' : 'text-green-800'
        }`}>
          🎉 Congratulations!
        </h2>
        <p className={`text-lg ${
          darkMode ? 'text-green-300' : 'text-green-700'
        }`}>
          You&apos;ve reached your retirement date! Time to enjoy the fruits of your planning.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${
      darkMode 
        ? 'from-blue-900/50 to-purple-900/50 border-blue-700/30' 
        : 'from-blue-50 to-purple-50 border-blue-200'
    } border`}>
      <div className="text-center mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-blue-200' : 'text-blue-800'
        }`}>
          ⏳ Time Until Retirement
        </h2>
        <p className={`text-sm ${
          darkMode ? 'text-blue-300' : 'text-blue-700'
        }`}>
          You can retire at age {retirementAge} on {retirementDate.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-800/40">
          <div className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-200">
            {timeLeft.years}
          </div>
          <div className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-300">
            Years
          </div>
        </div>

        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-800/40">
          <div className="text-2xl md:text-3xl font-bold text-purple-800 dark:text-purple-200">
            {timeLeft.months}
          </div>
          <div className="text-xs md:text-sm font-medium text-purple-600 dark:text-purple-300">
            Months
          </div>
        </div>

        <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-800/40">
          <div className="text-2xl md:text-3xl font-bold text-indigo-800 dark:text-indigo-200">
            {timeLeft.days}
          </div>
          <div className="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-300">
            Days
          </div>
        </div>

        <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-800/40">
          <div className="text-xl md:text-2xl font-bold text-cyan-800 dark:text-cyan-200">
            {timeLeft.hours}
          </div>
          <div className="text-xs md:text-sm font-medium text-cyan-600 dark:text-cyan-300">
            Hours
          </div>
        </div>

        <div className="p-3 rounded-lg bg-teal-100 dark:bg-teal-800/40">
          <div className="text-xl md:text-2xl font-bold text-teal-800 dark:text-teal-200">
            {timeLeft.minutes}
          </div>
          <div className="text-xs md:text-sm font-medium text-teal-600 dark:text-teal-300">
            Minutes
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-800/40">
          <div className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            {timeLeft.seconds}
          </div>
          <div className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-300">
            Seconds
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-blue-600 dark:text-blue-300">
        <p>Keep saving and investing! Every day brings you closer to financial freedom. 💪</p>
      </div>
    </div>
  );
}
