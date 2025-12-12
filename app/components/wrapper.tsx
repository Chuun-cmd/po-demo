"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login");

  return (
    <>
      {!hideNavbar && <Navbar userName="Som" />}
      <main>
        {children}
      </main>
    </>
  );
}