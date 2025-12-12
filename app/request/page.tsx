"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./request.module.css"; 
import { FaPlus } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { PiExportBold } from "react-icons/pi";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

export default function RequestPage() {
  const router = useRouter();

  const [requestNo, setRequestNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [requester, setRequester] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    const dummy = Array.from({ length: 20 }, (_, i) => ({
      requestNo: (i + 1).toString().padStart(3, "0"),
      supplier: ["A", "B", "C"][i % 3],
      requester: ["X", "Y", "Z"][i % 3],
      reviewer: ["R1", "R2", "R3"][i % 3],
      total: Math.floor(Math.random() * 5000) + 500,
      requestDate: `2025-11-${(i % 30 + 1).toString().padStart(2, "0")}`,
      dueDate: `2025-12-${(i % 30 + 1).toString().padStart(2, "0")}`,
      status: ["Submitted", "Approved", "Reject"][i % 3],
    }));

    setData(dummy);
    setFilteredData(dummy);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });

  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    setLoading(true);

    const filtered = data.filter((item) => {
      const itemRequest = new Date(item.requestDate);
      const itemDue = new Date(item.dueDate);

      return (
        (!requestNo || item.requestNo.includes(requestNo)) &&
        (!supplier || item.supplier === supplier) &&
        (!requester || item.requester === requester) &&
        (!reviewer || item.reviewer === reviewer) &&
        (!status || item.status === status) &&
        (!startDate || itemRequest >= startDate) &&
        (!endDate || itemDue <= endDate)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
    setLoading(false);
  };

  const handleReset = () => {
    setRequestNo("");
    setSupplier("");
    setRequester("");
    setReviewer("");
    setStatus("");
    setStartDate(null);
    setEndDate(null);
    setFilteredData(data);
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const goTonewRequest = () => {
    router.push("/request/newRequest");
  };

  if (data.length === 0) {
    return <div className={styles.requestContainer}>Loading...</div>;
  }

  return (
    <div className={styles.requestContainer}>
      <h2 className={styles.requestTitle}>Po Request</h2>

      <div className={styles.requestBox}>
        <div className={styles.rowSearch}>
          <div style={{ display: "flex", gap: 12, flex: 1 }}>
            <input
              className={styles.inputBox}
              placeholder="Search Request No."
              value={requestNo}
              onChange={(e) => setRequestNo(e.target.value)}
            />
            <button className={styles.search} onClick={handleSearch}>Search</button>
            <button className={styles.reset} onClick={handleReset}>Reset</button>
          </div>

          <div className={styles.exportWrap}>
            <button className={styles.export}>
              <PiExportBold size={13} /> Export
            </button>
            <button className={styles.detail} onClick={goTonewRequest}>
              <FaPlus size={12} /> New Request
            </button>
          </div>
        </div>

        <div className={styles.row}>
          <select className={`${styles.dropdown} ${styles.requestSelect}`} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">Select Supplier</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>

          <select className={`${styles.dropdown} ${styles.requestSelect}`} value={requester} onChange={(e) => setRequester(e.target.value)}>
            <option value="">Select Requester</option>
            <option value="X">X</option>
            <option value="Y">Y</option>
            <option value="Z">Z</option>
          </select>

          <select className={`${styles.dropdown} ${styles.requestSelect}`} value={reviewer} onChange={(e) => setReviewer(e.target.value)}>
            <option value="">Select Reviewer</option>
            <option value="R1">R1</option>
            <option value="R2">R2</option>
            <option value="R3">R3</option>
          </select>

          <div style={{ display: "flex", gap: 10 }}>
            <div className={styles.datepickerWrapper}>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  if (endDate && date && date > endDate) setEndDate(null);
                }}
                placeholderText="Start Date"
                dateFormat="dd/MM/yyyy"
                className={styles.datepickerInput}
              />
              <LuCalendarDays className={styles.calendarIcon} />
            </div>

            <div className={styles.datepickerWrapper}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={startDate ?? undefined}
                placeholderText="End Date"
                dateFormat="dd/MM/yyyy"
                className={styles.datepickerInput}
              />
              <LuCalendarDays className={styles.calendarIcon} />
            </div>
          </div>

          <select className={`${styles.dropdown} ${styles.requestSelect}`} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Reject">Reject</option>
          </select>
        </div>
      </div>

      {loading && <p style={{ marginTop: 10 }}>Loading...</p>}

      <div className={styles.tableBox}>
        <table className={styles.requestTable}>
          <thead>
            <tr>
              {["RequestNo", "Supplier", "Requester", "Reviewer", "Total Amount", "RequestDate", "DueDate", "Status"].map((col) => (
                <th key={col} onClick={() => handleSort(col)}>
                  <span className={styles.thText}>{col.replace(/([A-Z])/g, " $1")}</span>
                  <span className={styles.sortIcon}>{getSortIcon(col)}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pagedData.length > 0 ? (
              pagedData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.requestNo}</td>
                  <td>{item.supplier}</td>
                  <td>{item.requester}</td>
                  <td>{item.reviewer}</td>
                  <td>{item.total}</td>
                  <td>{item.requestDate}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span
                      className={
                        item.status === "Submitted"
                          ? styles.statusSubmitted
                          : item.status === "Approved"
                          ? styles.statusApproved
                          : styles.statusReject
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 40 }}>No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>
          {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
        </span>

        <div className={styles.pageButtons}>
          <span onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>‹ Prev</span>

          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className={currentPage === i + 1 ? styles.activePage : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}

          <span onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>Next ›</span>
        </div>
      </div>
    </div>
  );
}