"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import styles from "../../detail.module.css";

interface Roles {
  requester: boolean;
  approver: boolean;
  admin: boolean;
}

interface ErrorType {
  code?: string;
  name?: string;
  email?: string;
  password?: string;
}

function AddUserManagement() {
  const router = useRouter();

  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [roles, setRoles] = useState<Roles>({
    requester: false,
    approver: false,
    admin: false
  });

  const [isActive, setIsActive] = useState<boolean>(true);
  const [errors, setErrors] = useState<ErrorType>({});

  const handleRoleChange = (role: keyof Roles) => {
    setRoles({ ...roles, [role]: !roles[role] });
  };

  const handleSubmit = () => {
    const newErrors: ErrorType = {};
    if (!code) newErrors.code = "Code is required";
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "E-mail is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(
        `User saved!\nCode: ${code}\nName: ${name}\nEmail: ${email}\nRoles: ${Object.keys(roles)
          .filter((r) => roles[r as keyof Roles])
          .join(", ")}\nStatus: ${isActive ? "Active" : "InActive"}`
      );

      router.push("/AddUserManagement");
    }
  };

  return (
    <div className={styles.adduserContainer}>
      <button className={styles.btnBack} onClick={() => router.back()}>
        <FaAngleLeft style={{ marginRight: 6 }} /> Back
      </button>

      <div className={styles.adduserBox}>
        <h2 className={styles.adduserTitle}>Add User</h2>

        {/* Code */}
        <div className={styles.formRow}>
          <label>
            Code <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.inputBox}
            value={code}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setCode(onlyNumbers);
            }}
            placeholder="Number Only"
          />
          {errors.code && <div className={styles.inputError}>{errors.code}</div>}
        </div>

        {/* Name */}
        <div className={styles.formRow}>
          <label>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.inputBox}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className={styles.inputError}>{errors.name}</div>}
        </div>

        {/* Email */}
        <div className={styles.formRow}>
          <label>
            E-mail <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.inputBox}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <div className={styles.inputError}>{errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className={styles.formRow}>
          <label>
            Password <span className={styles.required}>*</span>
          </label>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.inputBox}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
            </span>
          </div>
          {errors.password && (
            <div className={styles.inputError}>{errors.password}</div>
          )}
        </div>

        {/* Role */}
        <div className={styles.formRow}>
          <label>Role</label>
          <div className={styles.checkboxRow}>
            {["requester", "approver", "admin"].map((role) => (
              <label className={styles.checkboxLabel} key={role}>
                <input
                  type="checkbox"
                  checked={roles[role as keyof Roles]}
                  onChange={() => handleRoleChange(role as keyof Roles)}
                />
                <span className={styles.customCheckbox}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className={styles.formRow}>
          <label>Status</label>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <span className={styles.slider}></span>
            <span className={styles.statusText}>
              {isActive ? "Active" : "InActive"}
            </span>
          </label>
        </div>

        {/* Save */}
        <div className={styles.saveRow}>
          <button className={styles.btnDetail} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUserManagement;