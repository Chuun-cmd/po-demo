"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import styles from "../backOffice.module.css";
import { FaPencil, FaSort, FaSortDown, FaSortUp, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface ProductItem {
  code: string;
  name: string;
  status: string;
}

interface SortConfig {
  key: keyof ProductItem | null;
  direction: "asc" | "desc";
}

function ProductManagement() {
  const router = useRouter();

  // Dummy data
  const dummyData: ProductItem[] = Array.from({ length: 20 }, (_, i) => ({
    code: `P${(i + 1).toString().padStart(3, "0")}`,
    name: `Product ${i + 1}`,
    status: i % 2 === 0 ? "Active" : "InActive",
  }));

  const [showMenu, setShowMenu] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [uploadedBase64, setUploadedBase64] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setUploadedBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const [data] = useState(dummyData);
  const [filteredData, setFilteredData] = useState(dummyData);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        (item.code.includes(searchText) || item.name.includes(searchText)) &&
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

  const handleSort = (key: keyof ProductItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  };

  const getSortIcon = (key: keyof ProductItem) => {
    if (sortConfig.key !== key) return <FaSort className={styles.sortIcon} />;
    return sortConfig.direction === "asc" ? 
    <FaSortUp className={styles.sortIcon}/> : <FaSortDown className={styles.sortIcon} />;
  };

  return (
    <div className={styles.userContainer}>
      <h2 className={styles.userTitle}>Product Management</h2>

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
            <option value="InActive">InActive</option>
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
              <IoSettingsSharp style={{ marginRight: 6 }} />
              Setting
            </button>

            {showMenu && (
              <div className={styles.settingMenu}>
                <div onClick={() => router.push("/backOffice/productManagement/addProduct")}>Add Item</div>
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

      <div className={styles.tableBox}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort("code")}>Code {getSortIcon("code")}</th>
              <th onClick={() => handleSort("name")}>Name {getSortIcon("name")}</th>
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
                  <td>
                    {item.status === "Active" ? (
                      <FaCircleCheck style={{ color: "#8ebb6c", fontSize: 18 }} />
                    ) : (
                      <FaCircleXmark style={{ color: "#d5786d", fontSize: 18 }} />
                    )}
                  </td>
                  <td>
                    <FaPencil className={styles.actionIcon} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={styles.tableEmpty} colSpan={4}>
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>
          {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
        </span>

        <div className={styles.pageButtons}>
          <span
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            ‹ Previous
          </span>

          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                cursor: "pointer",
                fontWeight: currentPage === i + 1 ? "bold" : "normal",
              }}
            >
              {i + 1}
            </span>
          ))}

          <span
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
          >
            Next ›
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
