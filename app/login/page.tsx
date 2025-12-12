"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { FiMail, FiLock } from "react-icons/fi";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { CgFileDocument } from "react-icons/cg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={styles.screen}>
      <div className={styles.card}>

        <div className={styles.iconBox}>
          <CgFileDocument size={26} color="#444" />
        </div>

        <div className={styles.title}>PO Request</div>

        <div className={styles.group}>
          <FiMail className={styles.leftIcon} />
          <input
            className={styles.field}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <FiLock className={styles.leftIcon} />
          <input
            className={styles.field}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className={styles.rightIcon}
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <LuEye /> : <LuEyeClosed />}
          </span>
        </div>

        <div className={styles.forgot}>Forgot password?</div>

        <button className={styles.mainBtn}>Sign In</button>
      </div>
    </div>
  );
}

export default LoginPage;