import { ReactNode, useState, useRef, useEffect } from "react";

interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
}
export function Popover({ children, content }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{children}</div>
      {open && (
        <div className="absolute z-10 p-2 mt-1 bg-white dark:bg-gray-800 border rounded shadow">
          {content}
        </div>
      )}
    </div>
  );
}
