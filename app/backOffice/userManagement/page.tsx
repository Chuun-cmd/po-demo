"use client";

import { useState, useRef } from "react";
import { FaPencil } from "react-icons/fa6";
import styles from "../backOffice.module.css";
import { useRouter } from "next/navigation";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa6";
import { BiEdit } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

export default function UserManagement() {
  const router = useRouter();

  const dummyData = Array.from({ length: 20 }, (_, i) => ({
    code: `U${(i + 1).toString().padStart(3, "0")}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 2 === 0 ? "Active" : "InActive",
  }));

  const [showMenu, setShowMenu] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [uploadedBase64, setUploadedBase64] = useState("");

  // FIX useRef error
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedBase64("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [data] = useState(dummyData);
  const [filteredData, setFilteredData] = useState(dummyData);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState<{
    key: "code" | "name" | "email" | "status" | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        (item.code.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email.toLowerCase().includes(searchText.toLowerCase())) &&
        (!statusFilter || item.status === statusFilter)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchText("");
    setStatusFilter("");
    setFilteredData(data);
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  const handleSort = (key: "code" | "name" | "email" | "status") => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      const valA = String(a[key]).toLowerCase();
      const valB = String(b[key]).toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <FaSort className={styles.sortIcon} />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className={styles.sortIcon} />
    ) : (
      <FaSortDown className={styles.sortIcon} />
    );
  };

  return (
    <div className={styles.userContainer}>
      <h2 className={styles.userTitle}>User Management</h2>

      {/* Filter Box */}
      <div className={styles.userBox}>
        <div className={styles.filterRow}>
          <input
            className={styles.inputBox}
            placeholder="Search Keywords"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className={styles.dropdownStatusSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="InActive">Inactive</option>
          </select>

          <button className={`${styles.btn} ${styles.btnSearch}`} onClick={handleSearch}>
            Search
          </button>

          <button className={`${styles.btn} ${styles.btnReset}`} onClick={handleReset}>
            Reset
          </button>

          <div className={styles.settingWrapper} style={{ marginLeft: "auto" }}>
            <button
              className={styles.settingBtn}
              onClick={() => setShowMenu(!showMenu)}
            >
              <IoSettingsSharp style={{ marginRight: "6px" }} />
              Setting
            </button>

            {showMenu && (
              <div className={styles.settingMenu}>
                <div
                  onClick={() => {
                    router.push("/backOffice/userManagement/addUser");
                    setShowMenu(false);
                  }}
                >
                  Add Item
                </div>
                <div
                  onClick={() => {
                    setShowImportPopup(true);
                    setShowMenu(false);
                  }}
                >
                  Import
                </div>
                <div
                  onClick={() => {
                    alert("Export clicked");
                    setShowMenu(false);
                  }}
                >
                  Export
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableBox}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort("code")}>Code {getSortIcon("code")}</th>
              <th onClick={() => handleSort("name")}>Name {getSortIcon("name")}</th>
              <th onClick={() => handleSort("email")}>Email {getSortIcon("email")}</th>
              <th onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {pagedData.length > 0 ? (
              pagedData.map((item) => (
                <tr key={item.code}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.status === "Active" ? (
                      <FaCircleCheck
                        style={{
                          color: "#8ebb6c",
                          fontSize: "18px",
                          marginLeft: "16px",
                        }}
                      />
                    ) : (
                      <FaCircleXmark
                        style={{
                          color: "#d5786d",
                          fontSize: "18px",
                          marginLeft: "16px",
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <BiEdit className={styles.actionIcon} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.tableEmpty}>
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <span>
          {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length} records
        </span>

        <div className={styles.pageButtons}>
          <span
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            ‹ Previous
          </span>

          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              style={{
                fontWeight: currentPage === i + 1 ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}

          <span
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          >
            Next ›
          </span>
        </div>
      </div>

      {showImportPopup && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowImportPopup(false)}
        >
          <div
            className={styles.popupBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.popupHeader}>
              Import File
              <span
                className={styles.popupClose}
                onClick={() => setShowImportPopup(false)}
              >
                ×
              </span>
            </div>

            <div
              className={styles.uploadArea}
              onClick={() => !fileName && fileInputRef.current?.click()}
            >
              {!fileName ? (
                <>Click to upload or drag file here</>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>{fileName}</span>
                  <span
                    style={{
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    <TiDelete />
                  </span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>

            <button
              className={styles.popupSubmit}
              onClick={() => alert("Submit Import")}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
