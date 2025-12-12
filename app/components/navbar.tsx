"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineLogout } from "react-icons/md";
import styles from "./navbar.module.css";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.navTitle}>PO Request</div>

        <div className={styles.navLinks}>
          <Link href="/request" className={`${styles.navLink} ${isActive("/request") ? styles.active : ""}`}>
            Request
          </Link>

          <Link href="/dashboard" className={`${styles.navLink} ${isActive("/dashboard") ? styles.active : ""}`}>
            Dashboard
          </Link>

          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button className={styles.dropdownButton} onClick={() => setShowDropdown(!showDropdown)}>
              Back Office
              <svg
                width="14"
                height="8"
                viewBox="0 0 12 6"
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease"
                }}
              >
                <path
                  d="M2 1.5L6 4.5L10 1.5"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <Link href="/backOffice/userManagement" className={styles.dropdownLink}>
                  User Management
                </Link>
                <Link href="/backOffice/productManagement" className={styles.dropdownLink}>
                  Product Management
                </Link>
                <Link href="/backoffice/suppliers" className={styles.dropdownLink}>
                  Supplier Management
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.navRight}>
        <span>{userName}</span>
        <button className={styles.navLogout} onClick={handleLogout}>
          <MdOutlineLogout />
        </button>
      </div>
    </nav>
  );
}