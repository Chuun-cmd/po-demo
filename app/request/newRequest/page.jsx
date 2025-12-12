"use client";

import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./newRequest.module.css";

import { 
  HiOutlineChevronDown, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineClock 
} from "react-icons/hi";
import { MdOutlineAddCircle } from "react-icons/md";

registerLocale("th", th);

function newRequest() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [requestNumber, setRequestNumber] = useState("");

  const [status, setStatus] = useState(""); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [dueDate, setDueDate] = useState(null);
  const [remark, setRemark] = useState("");

  const [products, setProducts] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupProduct, setPopupProduct] = useState("");
  const [popupQuality, setPopupQuality] = useState("");
  const [popupPrice, setPopupPrice] = useState(0);
  const [popupAmount, setPopupAmount] = useState(0);

  const [productOptions, setProductOptions] = useState([]);

  const [popupProductError, setPopupProductError] = useState("");
  const [popupQualityError, setPopupQualityError] = useState("");

  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [supplierError, setSupplierError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [runningNumbers, setRunningNumbers] = useState({});

  useEffect(() => {
    setSuppliers([
      { id: 1, code: "2294", name: "Supplier A", tel: "012-3456789", address: "Bangkok" },
      { id: 2, code: "2438", name: "Supplier B", tel: "022-111222", address: "Khon Kaen" },
      { id: 3, code: "2384", name: "Supplier C", tel: "033-555666", address: "Chiang Mai" }
    ]);

    setCategories([
      { id: 10, name: "Food & Beverage" },
      { id: 20, name: "Office Equipment" },
      { id: 30, name: "Computer Accessories" }
    ]);

    setProductOptions([
      { id: 1, code: "A001", name: "Product A", unit: "pcs", price: 100 },
      { id: 2, code: "B002", name: "Product B", unit: "box", price: 200 },
      { id: 3, code: "C003", name: "Product C", unit: "set", price: 300 }
    ]);
  }, []);

  const generateRequestNumber = (supplierCode) => {
    const now = new Date();
    const yyyy = now.getFullYear() + 543;
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const ym = `${yyyy}${mm}`;
    const currentRun = runningNumbers[ym] || 0;
    const newRun = currentRun + 1;
    setRunningNumbers({ ...runningNumbers, [ym]: newRun });
    const nnnnn = String(newRun).padStart(5, "0");
    return `${supplierCode}-${ym}-${nnnnn}`;
  };

  const isFormComplete = () => {
    return selectedSupplier && selectedCategory && dueDate;
  };

  const handleSupplierChange = (e) => {
    const id = e.target.value;
    setSelectedSupplier(id);
    setSupplierError("");

    const sup = suppliers.find(s => String(s.id) === id);
    if (sup) {
      setTelephone(sup.tel);
      setAddress(sup.address);
    } else {
      setTelephone("");
      setAddress("");
    }
  };

  useEffect(() => {
    setPopupAmount(popupPrice * (Number(popupQuality) || 0));
  }, [popupPrice, popupQuality]);

  const openPopup = () => {
    setPopupProduct("");
    setPopupQuality("");
    setPopupPrice(0);
    setPopupAmount(0);
    setPopupProductError("");
    setPopupQualityError("");
    setIsPopupOpen(true);
  };

  const savePopup = () => {
    let valid = true;

    if (!popupProduct) { setPopupProductError("Required"); valid = false; }
    if (!popupQuality) { setPopupQualityError("Required"); valid = false; }

    if (!valid) return;

    const prod = productOptions.find(p => String(p.id) === popupProduct);

    setProducts([...products, {
      id: Date.now(),
      code: prod.code,
      name: prod.name,
      unit: prod.unit,
      quality: popupQuality,
      price: prod.price,
      amount: prod.price * Number(popupQuality)
    }]);

    setIsPopupOpen(false);
  };

  const addHistoryLog = (action, remarkText = "") => {
    const now = new Date();
    const timestamp = `${now.getDate().toString().padStart(2,"0")}/${
      (now.getMonth()+1).toString().padStart(2,"0")}/${now.getFullYear()} ${
      now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;

    setHistoryLogs(prev => [
      ...prev,
      { status: action, user: "Admin", timestamp, remark: remarkText }
    ]);
  };

  const handleSave = () => {
    let valid = true;

    if (!selectedSupplier) { setSupplierError("กรุณาเลือก Supplier"); valid = false; }
    if (!selectedCategory) { setCategoryError("กรุณาเลือก Category"); valid = false; }
    if (!dueDate) { valid = false; }

    if (!valid) return;

    if (!requestNumber) {
      const sup = suppliers.find(s => String(s.id) === selectedSupplier);
      if (sup) {
        setRequestNumber(generateRequestNumber(sup.code));
      }
    }

    setStatus("Draft");
    addHistoryLog("Draft", "Saved");
  };

  const handleSubmit = () => {
    if (!isFormComplete()) return;
    setStatus("Submitted");
    addHistoryLog("Submitted", "Form submitted");
  };

  const handleApprove = () => {
    setStatus("Approved");
    addHistoryLog("Approved", "Request approved");
  };

  const handleReject = () => {
    setShowRejectPopup(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert("กรุณากรอก Reason");
      return;
    }

    setStatus("Rejected");
    addHistoryLog("Rejected", rejectReason);
    setShowRejectPopup(false);
    setRejectReason("");
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Draft": return <HiOutlineClock />;
      case "Submitted": return <HiOutlineCheckCircle />;
      case "Approved": return <HiOutlineCheckCircle style={{ color: "#ffffff" }} />;
      case "Rejected": return <HiOutlineXCircle style={{ color: "#ffffff" }} />;
      default: return null;
    }
  };

  return (
    <div className={styles.requestContainer}>

      <div className={styles.requestHeader}>
        <div className={styles.requestMeta}>
          <span className={styles.requestNumber}>Request No: {requestNumber || "-"}</span>

          {status && (
            <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
              {getStatusIcon(status)}
              {status}
            </span>
          )}
        </div>

        <div className={styles.requestActions}>
          {status !== "Submitted" && (
            <button className={styles.btnSave} onClick={handleSave}>Save</button>
          )}
          {status === "Draft" && isFormComplete() && (
            <button className={styles.btnSubmit} onClick={handleSubmit}>Submit</button>
          )}
          {status === "Submitted" && (
            <>
              <button className={styles.btnApprove} onClick={handleApprove}>Approve</button>
              <button className={styles.btnReject} onClick={handleReject}>Reject</button>
            </>
          )}
        </div>
      </div>

      <div className={styles.requestGrid}>
        <div className={styles.requestBox}>
          <div className={styles.supplierBox}>Supplier Info</div>

          <div className={styles.requestField}>
            <label>Supplier <span className={styles.req}>*</span></label>

            <div className={styles.selectWrap}>
              <select value={selectedSupplier} onChange={handleSupplierChange}>
                <option value="">Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <HiOutlineChevronDown className={styles.selectIcon} />
            </div>

            {supplierError && <div className={styles.errorText}>{supplierError}</div>}
          </div>

          <div className={styles.requestField}>
            <label>Telephone</label>
            <input type="text" value={telephone} disabled className={styles.disabledInput} />
          </div>

          <div className={styles.requestField}>
            <label>Address</label>
            <input type="text" value={address} disabled className={styles.disabledInput} />
          </div>
        </div>

        <div className={styles.requestBox}>
          <div className={styles.supplierBox}>Request Info</div>

          <div className={styles.requestField}>
            <label>Category <span className={styles.req}>*</span></label>

            <div className={styles.selectWrap}>
              <select 
                value={selectedCategory} 
                onChange={(e) => { setSelectedCategory(e.target.value); setCategoryError(""); }}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <HiOutlineChevronDown className={styles.selectIcon} />
            </div>

            {categoryError && <div className={styles.errorText}>{categoryError}</div>}
          </div>

          <div className={styles.requestField}>
            <label>Due Date</label>
            <DatePicker 
              selected={dueDate} 
              onChange={setDueDate} 
              locale="th" 
              dateFormat="dd/MM/yyyy" 
              placeholderText="Due Date"
              className={styles.datePickerInput}
            />
          </div>

          <div className={styles.requestField}>
            <label>Remark</label>
            <input type="text" value={remark} onChange={e => setRemark(e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.requestBox}>
        <div className={styles.itemBox}>
          Item List

          <div className={styles.addRow}>
            <button className={styles.btnAdd} onClick={openPopup}>
              <MdOutlineAddCircle />
              ADD
            </button>
          </div>
        </div>
        <div className={styles.productHeader}>
          <span>Total Amount: {products.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)}</span>

        </div>

        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Unit</th>
              <th>Quality</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="6" className={styles.tableEmpty}>- No Items -</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td>{p.code}</td>
                  <td>{p.name}</td>
                  <td>{p.unit}</td>
                  <td>{p.quality}</td>
                  <td>{p.price}</td>
                  <td>{p.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.requestBox}>
        <div className={styles.itemBox}>History Logs</div>

        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Status</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>Remark</th>
            </tr>
          </thead>

          <tbody>
            {historyLogs.length === 0 ? (
              <tr><td colSpan="4" className={styles.tableEmpty}>- No Items -</td></tr>
            ) : (
              historyLogs.map((h, i) => (
                <tr key={i}>
                  <td>{h.status}</td>
                  <td>{h.user}</td>
                  <td>{h.timestamp}</td>
                  <td>{h.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {isPopupOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>

            <div className={styles.popupHeader}>
              <h3>Add Product</h3>
              <button onClick={() => setIsPopupOpen(false)}>X</button>
            </div>

            <div className={styles.popupField}>
              <label>Product <span className={styles.req}>*</span></label>

              <div className={styles.popupSelectWrap}>
                <select 
                  value={popupProduct}
                  onChange={(e) => {
                    setPopupProduct(e.target.value);
                    setPopupProductError("");
                    const p = productOptions.find(p => String(p.id) === e.target.value);
                    setPopupPrice(p ? p.price : 0);
                  }}
                >
                  <option value="">- Select -</option>
                  {productOptions.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <HiOutlineChevronDown className={styles.popupSelectIcon} />
              </div>

              {popupProductError && <div className={styles.errorText}>{popupProductError}</div>}
            </div>

            <div className={styles.popupField}>
              <label>Quality <span className={styles.req}>*</span></label>
              <input
                type="text"
                className={styles.popupInputBox}
                value={popupQuality}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setPopupQuality(val);
                    setPopupQualityError("");
                  }
                }}
              />
              {popupQualityError && <div className={styles.errorText}>{popupQualityError}</div>}
            </div>

            <div className={styles.popupField}>
              <label>Price</label>
              <input type="text" className={styles.popupInput} value={popupPrice} disabled />
            </div>

            <div className={styles.popupField}>
              <label>Amount</label>
              <input type="text" className={styles.popupInput} value={popupAmount} disabled />
            </div>

            <div className={styles.popupFooter}>
              <button className={`${styles.btnPopup} ${styles.cancel}`} onClick={() => setIsPopupOpen(false)}>Cancel</button>
              <button className={`${styles.btnPopup} ${styles.save}`} onClick={savePopup}>Save</button>
            </div>

          </div>
        </div>
      )}


      {showRejectPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h3>Reject Reason</h3>
            </div>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              className={styles.rejectTextarea}
            />

            <div className={styles.popupFooter}>
              <button className={`${styles.btnPopup} ${styles.cancel}`} onClick={() => setShowRejectPopup(false)}>Cancel</button>
              <button className={`${styles.btnPopup} ${styles.save}`} onClick={submitReject}>Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default newRequest;