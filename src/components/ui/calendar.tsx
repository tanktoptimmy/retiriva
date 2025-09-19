"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
}

export function Calendar({ selected, onSelect }: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(date) => date && onSelect(date)}
      fromYear={1900}
      toYear={2100}
      className="bg-white dark:bg-gray-800 p-2 rounded-md shadow"
    />
  );
}
