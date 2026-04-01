"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function NavProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    // Pathname changed — animation complete
    if (prevPathname.current !== pathname) {
      // If we were animating, finish it
      if (visible) {
        setProgress(100);
        const t = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 300);
        return () => clearTimeout(t);
      }
      prevPathname.current = pathname;
    }
  }, [pathname, visible]);

  useEffect(() => {
    // Intercept link clicks to start progress
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href === pathname) return;

      // Internal navigation — start progress bar
      prevPathname.current = pathname;
      setProgress(0);
      setVisible(true);

      // Simulate progress: fast start, slow middle
      let current = 0;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        current += Math.random() * 15 + (current < 50 ? 10 : 3);
        if (current >= 90) {
          current = 90;
          clearInterval(timerRef.current);
        }
        setProgress(current);
      }, 150);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearInterval(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5">
      {/* Glow backdrop */}
      <div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 blur-sm transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Main bar */}
      <div
        className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Leading pulse */}
      <div
        className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent to-primary/50 animate-pulse transition-all duration-300 ease-out"
        style={{ left: `calc(${progress}% - 6rem)`, opacity: progress < 100 ? 1 : 0 }}
      />
    </div>
  );
}
