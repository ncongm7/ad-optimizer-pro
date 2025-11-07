import { useState, useEffect } from "react";

// ============================================================
// UTILITY: Decision Logic Engine - "Săn đơn Chớp nhoáng"
// ============================================================
const calculateDecision = (adGroup, cpaLimit) => {
  const { sodon, cpa, datieu, ngansach } = adGroup;

  const conv_today = parseFloat(sodon) || 0;
  const spend_today = parseFloat(datieu) || 0;
  const currentBudget = parseFloat(ngansach) || 0;
  const targetCpa = parseFloat(cpaLimit) || 0;

  if (currentBudget === 0 || targetCpa === 0) {
    return {
      action: "KHÔNG HỢP LỆ",
      newBudget: currentBudget,
      reason: "Ngân sách hoặc CPA target không hợp lệ",
      expertNote: "",
      timeFrame: "ERROR",
    };
  }

  const cpa_today = conv_today > 0 ? spend_today / conv_today : 0;
  const pacing = spend_today / currentBudget;

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const elapsed_hours = (now - startOfDay) / (1000 * 60 * 60);

  let timeFrame = "";
  if (elapsed_hours <= 12.5) {
    timeFrame = "KHUNG_1030";
  } else if (elapsed_hours <= 16.5) {
    timeFrame = "KHUNG_1430";
  } else if (elapsed_hours <= 22.5) {
    timeFrame = "KHUNG_1730";
  } else {
    return {
      action: "NGOÀI GIỜ",
      newBudget: currentBudget,
      reason: "Ngoài giờ tối ưu (sau 22:30)",
      expertNote: "🌙 Nghỉ ngơi và chuẩn bị cho ngày mới!",
      timeFrame: "OUT_OF_HOURS",
    };
  }

  if (timeFrame === "KHUNG_1030") {
    return executeFrame1030(
      conv_today,
      cpa_today,
      spend_today,
      currentBudget,
      targetCpa,
      pacing
    );
  } else if (timeFrame === "KHUNG_1430") {
    return executeFrame1430(
      conv_today,
      cpa_today,
      spend_today,
      currentBudget,
      targetCpa,
      pacing
    );
  } else if (timeFrame === "KHUNG_1730") {
    return executeFrame1730(conv_today, cpa_today, currentBudget, targetCpa);
  }
};

const executeFrame1030 = (
  conv_today,
  cpa_today,
  spend_today,
  currentBudget,
  cpaLimit,
  pacing
) => {
  if (conv_today >= 7 && spend_today >= 0.7 * currentBudget) {
    return {
      action: "TĂNG RẤT MẠNH",
      newBudget: Math.round(currentBudget * 3),
      reason: `Siêu Sao: ${conv_today} đơn, đã tiêu ${spend_today.toLocaleString()}₫ (${(
        pacing * 100
      ).toFixed(0)}%)`,
      expertNote:
        "🌟 Tín hiệu bùng nổ! Cần bơm vốn ngay lập tức để chiếm lĩnh thị trường.",
      timeFrame: "KHUNG_1030",
    };
  }

  if (conv_today >= 4 && cpa_today <= cpaLimit * 0.75) {
    return {
      action: "TĂNG MẠNH",
      newBudget: Math.round(currentBudget * 2.5),
      reason: `Hiệu suất Vàng: ${conv_today} đơn, CPA ${cpa_today.toLocaleString()}₫ rẻ hơn 25%`,
      expertNote: "💰 Hiệu suất xuất sắc, CPA cực rẻ. Mở rộng quy mô ngay.",
      timeFrame: "KHUNG_1030",
    };
  }

  if (
    conv_today >= 4 &&
    cpa_today > cpaLimit * 0.75 &&
    cpa_today <= cpaLimit * 0.85
  ) {
    return {
      action: "TĂNG VỪA",
      newBudget: Math.round(currentBudget * 2),
      reason: `Hiệu suất Tốt: ${conv_today} đơn, CPA trong ngưỡng an toàn`,
      expertNote:
        "✅ Hiệu suất tốt, CPA trong ngưỡng an toàn. Tiếp tục đẩy mạnh.",
      timeFrame: "KHUNG_1030",
    };
  }

  if (conv_today >= 2 && conv_today < 4 && cpa_today <= cpaLimit * 0.85) {
    return {
      action: "TĂNG NHẸ",
      newBudget: Math.round(currentBudget * 1.5),
      reason: `Tiềm năng: ${conv_today} đơn, CPA ${cpa_today.toLocaleString()}₫ rẻ`,
      expertNote: "📈 Có tín hiệu đơn tốt và CPA rẻ. Tăng nhẹ để thăm dò.",
      timeFrame: "KHUNG_1030",
    };
  }

  if (conv_today < 2 && spend_today >= cpaLimit * 0.8) {
    return {
      action: "GIẢM MẠNH",
      newBudget: Math.round(currentBudget * 0.7),
      reason: `Cắt lỗ sớm: Chỉ ${conv_today} đơn nhưng đã tiêu ${spend_today.toLocaleString()}₫`,
      expertNote:
        "⚠️ Rủi ro cao. Đã tiêu đáng kể nhưng không có đủ tín hiệu chuyển đổi.",
      timeFrame: "KHUNG_1030",
    };
  }

  return {
    action: "GIỮ NGUYÊN",
    newBudget: currentBudget,
    reason: `Mặc định: ${conv_today} đơn, CPA ${cpa_today.toLocaleString()}₫`,
    expertNote:
      "⏳ Dữ liệu chưa đủ rõ ràng. Cần theo dõi thêm đến khung giờ tiếp theo.",
    timeFrame: "KHUNG_1030",
  };
};

const executeFrame1430 = (
  conv_today,
  cpa_today,
  spend_today,
  currentBudget,
  cpaLimit,
  pacing
) => {
  if (pacing < 0.65) {
    if (conv_today >= 6 && cpa_today <= cpaLimit * 0.8) {
      return {
        action: "TĂNG NHẸ",
        newBudget: Math.round(currentBudget * 1.5),
        reason: `Slow Spend (${(pacing * 100).toFixed(
          0
        )}%) nhưng hiệu quả: ${conv_today} đơn`,
        expertNote: "📈 Hiệu suất rất tốt nhưng cần tăng tốc chi tiêu.",
        timeFrame: "KHUNG_1430",
      };
    }

    if (conv_today >= 2 && cpa_today <= cpaLimit * 0.9) {
      return {
        action: "GIỮ NGUYÊN",
        newBudget: currentBudget,
        reason: `Slow Spend (${(pacing * 100).toFixed(
          0
        )}%) ổn định: ${conv_today} đơn`,
        expertNote: "👀 Hiệu suất ổn, cần theo dõi thêm.",
        timeFrame: "KHUNG_1430",
      };
    }

    return {
      action: "GIẢM",
      newBudget: Math.round(currentBudget * 0.7),
      reason: `Slow Spend (${(pacing * 100).toFixed(
        0
      )}%) kém: ${conv_today} đơn`,
      expertNote:
        "⚠️ Vừa tiêu tiền chậm, vừa không hiệu quả. Cần siết chặt ngân sách.",
      timeFrame: "KHUNG_1430",
    };
  }

  if (pacing >= 0.65 && pacing <= 0.85) {
    if (conv_today >= 8 && cpa_today <= cpaLimit * 0.85) {
      return {
        action: "TĂNG NHẸ",
        newBudget: Math.round(currentBudget * 1.3),
        reason: `Stable Spend (${(pacing * 100).toFixed(
          0
        )}%) xuất sắc: ${conv_today} đơn`,
        expertNote:
          "✨ Trạng thái hoàn hảo. Tăng nhẹ để duy trì đà tăng trưởng.",
        timeFrame: "KHUNG_1430",
      };
    }

    if (conv_today >= 4 && cpa_today <= cpaLimit) {
      return {
        action: "GIỮ NGUYÊN",
        newBudget: currentBudget,
        reason: `Stable Spend (${(pacing * 100).toFixed(
          0
        )}%) tốt: ${conv_today} đơn`,
        expertNote: "💪 Nhóm đang hoạt động tốt và ổn định. Không can thiệp.",
        timeFrame: "KHUNG_1430",
      };
    }

    return {
      action: "GIẢM",
      newBudget: Math.round(currentBudget * 0.8),
      reason: `Stable Spend (${(pacing * 100).toFixed(0)}%) nhưng CPA cao`,
      expertNote:
        "⚠️ Pacing ổn định nhưng CPA đang có dấu hiệu tăng. Cần kiểm soát.",
      timeFrame: "KHUNG_1430",
    };
  }

  if (conv_today >= 10 && cpa_today <= cpaLimit) {
    return {
      action: "GIỮ NGUYÊN",
      newBudget: currentBudget,
      reason: `Fast Spend (${(pacing * 100).toFixed(
        0
      )}%) nhưng thắng lớn: ${conv_today} đơn`,
      expertNote:
        "🔥 Nhóm đang thắng lớn, chấp nhận Pacing nhanh. Không bơm thêm để tránh mất ổn định.",
      timeFrame: "KHUNG_1430",
    };
  }

  return {
    action: "GIẢM MẠNH",
    newBudget: Math.round(currentBudget * 0.6),
    reason: `Fast Spend (${(pacing * 100).toFixed(0)}%) kém: ${conv_today} đơn`,
    expertNote:
      "🚨 Cảnh báo! Nhóm đang đốt tiền quá nhanh mà không đủ hiệu quả. Phải giảm ngay.",
    timeFrame: "KHUNG_1430",
  };
};

const executeFrame1730 = (conv_today, cpa_today, currentBudget, cpaLimit) => {
  if (conv_today >= 12 && cpa_today <= cpaLimit * 0.8) {
    return {
      action: "TĂNG MẠNH CUỐI NGÀY",
      newBudget: Math.round(currentBudget * 1.5),
      reason: `Siêu Sao Về Đích: ${conv_today} đơn, CPA ${cpa_today.toLocaleString()}₫`,
      expertNote:
        "🏆 Đây là nhóm tốt nhất! Tất tay cho Giờ Vàng để tối đa hóa lợi nhuận.",
      timeFrame: "KHUNG_1730",
    };
  }

  if (conv_today >= 8 && cpa_today <= cpaLimit) {
    return {
      action: "GIỮ NGUYÊN",
      newBudget: currentBudget,
      reason: `Chiến Binh Ổn định: ${conv_today} đơn, CPA ${cpa_today.toLocaleString()}₫`,
      expertNote:
        "💪 Nhóm đang hoạt động rất ổn định. Giữ nguyên để nó tự tin chạy hết Giờ Vàng.",
      timeFrame: "KHUNG_1730",
    };
  }

  return {
    action: "GIẢM MẠNH / TẮT",
    newBudget: Math.round(currentBudget * 0.5),
    reason: `Cắt bỏ Gánh nặng: ${conv_today} đơn không đạt yêu cầu`,
    expertNote:
      "🛑 Không đủ hiệu quả để đầu tư vào Giờ Vàng. Giảm mạnh để bảo vệ vốn.",
    timeFrame: "KHUNG_1730",
  };
};

// ============================================================
// MODAL: Add Product
// ============================================================
const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [cpaLimit, setCpaLimit] = useState("");

  const handleSave = () => {
    if (!name.trim() || !cpaLimit) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSave(name.trim(), parseFloat(cpaLimit));
    setName("");
    setCpaLimit("");
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1e1e2e",
      borderRadius: "12px",
      padding: "30px",
      maxWidth: "500px",
      width: "100%",
      border: "1px solid #45475a",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#a6e3a1",
      marginBottom: "25px",
      textAlign: "center",
    },
    field: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      color: "#cdd6f4",
      marginBottom: "8px",
      fontWeight: "600",
    },
    input: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#313244",
      color: "#cdd6f4",
      border: "2px solid #45475a",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "border 0.2s",
      boxSizing: "border-box",
    },
    buttons: {
      display: "flex",
      gap: "12px",
      marginTop: "30px",
    },
    button: {
      flex: 1,
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    saveBtn: {
      backgroundColor: "#a6e3a1",
      color: "#1e1e2e",
    },
    cancelBtn: {
      backgroundColor: "#45475a",
      color: "#cdd6f4",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>➕ Thêm Sản Phẩm Mới</div>

        <div style={styles.field}>
          <label style={styles.label}>Tên Sản Phẩm</label>
          <input
            type="text"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Miếng dán di động"
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>CPA Target (₫)</label>
          <input
            type="number"
            style={styles.input}
            value={cpaLimit}
            onChange={(e) => setCpaLimit(e.target.value)}
            placeholder="VD: 27500"
            step="500"
          />
        </div>

        <div style={styles.buttons}>
          <button
            style={{ ...styles.button, ...styles.cancelBtn }}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            style={{ ...styles.button, ...styles.saveBtn }}
            onClick={handleSave}
          >
            💾 Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MODAL: Number Picker (for Số Đơn)
// ============================================================
const NumberPickerModal = ({ isOpen, onClose, onSelect, currentValue }) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30];

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1e1e2e",
      borderRadius: "12px",
      padding: "25px",
      maxWidth: "400px",
      width: "100%",
      border: "1px solid #45475a",
    },
    header: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#89dceb",
      marginBottom: "20px",
      textAlign: "center",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
      marginBottom: "20px",
    },
    numberBtn: {
      padding: "15px",
      backgroundColor: "#313244",
      color: "#cdd6f4",
      border: "2px solid #45475a",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    activeBtn: {
      backgroundColor: "#89dceb",
      color: "#1e1e2e",
      borderColor: "#89dceb",
    },
    closeBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#45475a",
      color: "#cdd6f4",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>Chọn Số Đơn</div>
        <div style={styles.grid}>
          {numbers.map((num) => (
            <button
              key={num}
              style={{
                ...styles.numberBtn,
                ...(currentValue === num ? styles.activeBtn : {}),
              }}
              onClick={() => {
                onSelect(num);
                onClose();
              }}
            >
              {num}
            </button>
          ))}
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

// ============================================================
// ProductManager Component
// ============================================================
const ProductManager = ({
  products,
  selectedProductId,
  onProductChange,
  onAddProduct,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const styles = {
    container: {
      padding: "25px",
      backgroundColor: "#1e1e2e",
      borderRadius: "12px",
      marginBottom: "20px",
      border: "1px solid #2d2d44",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    header: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#a6e3a1",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      alignItems: "center",
    },
    select: {
      flex: "1 1 250px",
      minWidth: "250px",
      padding: "14px",
      backgroundColor: "#313244",
      color: "#cdd6f4",
      border: "2px solid #45475a",
      borderRadius: "8px",
      fontSize: "15px",
      cursor: "pointer",
      fontWeight: "500",
      outline: "none",
    },
    button: {
      padding: "14px 20px",
      backgroundColor: "#89b4fa",
      color: "#1e1e2e",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      whiteSpace: "nowrap",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    buttonAdd: {
      backgroundColor: "#a6e3a1",
    },
    buttonDanger: {
      backgroundColor: "#f38ba8",
    },
    buttonSuccess: {
      backgroundColor: "#94e2d5",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>📦 Quản Lý Sản Phẩm</div>

      <div style={styles.row}>
        <select
          style={styles.select}
          value={selectedProductId}
          onChange={(e) => onProductChange(e.target.value)}
        >
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (CPA: {product.cpaLimit.toLocaleString()}₫)
            </option>
          ))}
        </select>

        <button
          style={{ ...styles.button, ...styles.buttonAdd }}
          onClick={onAddProduct}
        >
          ➕ Thêm
        </button>

        <button
          style={{ ...styles.button, ...styles.buttonSuccess }}
          onClick={onSaveProduct}
        >
          💾 Sửa
        </button>

        <button
          style={{ ...styles.button, ...styles.buttonDanger }}
          onClick={onDeleteProduct}
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};

// ============================================================
// AdGroupRow Component
// ============================================================
const AdGroupRow = ({ adGroup, index, onUpdate, onRemove }) => {
  const [showPicker, setShowPicker] = useState(false);

  const styles = {
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr 60px",
      gap: "12px",
      padding: "20px",
      backgroundColor: "#1e1e2e",
      borderRadius: "10px",
      border: "1px solid #2d2d44",
      marginBottom: "12px",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    rowMobile: {
      "@media (max-width: 768px)": {
        gridTemplateColumns: "1fr",
        gap: "15px",
      },
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "11px",
      color: "#a6adc8",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "12px",
      backgroundColor: "#313244",
      color: "#cdd6f4",
      border: "2px solid #45475a",
      borderRadius: "6px",
      fontSize: "15px",
      fontWeight: "500",
      outline: "none",
      transition: "border 0.2s",
    },
    inputDisabled: {
      backgroundColor: "#181825",
      cursor: "not-allowed",
      color: "#6c7086",
    },
    display: {
      padding: "12px",
      backgroundColor: "#181825",
      color: "#f9e2af",
      border: "2px solid #313244",
      borderRadius: "6px",
      fontSize: "15px",
      fontWeight: "700",
    },
    sodonContainer: {
      position: "relative",
    },
    sodonInput: {
      width: "100%",
      cursor: "pointer",
      userSelect: "none",
    },
    incrementBtns: {
      display: "flex",
      gap: "4px",
      marginTop: "4px",
    },
    incrementBtn: {
      flex: 1,
      padding: "6px",
      backgroundColor: "#45475a",
      color: "#cdd6f4",
      border: "none",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    removeBtn: {
      width: "50px",
      height: "50px",
      backgroundColor: "#f38ba8",
      color: "#1e1e2e",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
  };

  const handleChange = (field, value) => {
    const updated = { ...adGroup, [field]: value };

    if (field === "sodon" || field === "cpa") {
      const sodon = parseFloat(field === "sodon" ? value : adGroup.sodon) || 0;
      const cpa = parseFloat(field === "cpa" ? value : adGroup.cpa) || 0;
      if (sodon > 0) {
        updated.datieu = sodon * cpa;
      }
    }

    onUpdate(index, updated);
  };

  const incrementSodon = (amount) => {
    const current = parseFloat(adGroup.sodon) || 0;
    const newValue = Math.max(0, current + amount);
    handleChange("sodon", newValue);
  };

  const isSodonZero = parseFloat(adGroup.sodon) === 0 || !adGroup.sodon;

  return (
    <>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Tên Nhóm</label>
          <input
            type="text"
            style={styles.input}
            value={adGroup.tennhom}
            onChange={(e) => handleChange("tennhom", e.target.value)}
            placeholder="Nhập tên nhóm"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Số Đơn</label>
          <div style={styles.sodonContainer}>
            <input
              type="number"
              style={{ ...styles.input, ...styles.sodonInput }}
              value={adGroup.sodon}
              onChange={(e) => handleChange("sodon", e.target.value)}
              onClick={() => setShowPicker(true)}
              readOnly
            />
            <div style={styles.incrementBtns}>
              <button
                style={styles.incrementBtn}
                onClick={() => incrementSodon(-1)}
              >
                -1
              </button>
              <button
                style={styles.incrementBtn}
                onClick={() => incrementSodon(1)}
              >
                +1
              </button>
              <button
                style={styles.incrementBtn}
                onClick={() => incrementSodon(5)}
              >
                +5
              </button>
            </div>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>CPA (₫)</label>
          <input
            type="number"
            style={{
              ...styles.input,
              ...(isSodonZero ? styles.inputDisabled : {}),
            }}
            value={adGroup.cpa}
            onChange={(e) => handleChange("cpa", e.target.value)}
            placeholder="0"
            disabled={isSodonZero}
            step="100"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Đã Tiêu (₫)</label>
          {isSodonZero ? (
            <input
              type="number"
              style={styles.input}
              value={adGroup.datieu}
              onChange={(e) => handleChange("datieu", e.target.value)}
              placeholder="0"
              step="1000"
            />
          ) : (
            <div style={styles.display}>
              {parseFloat(adGroup.datieu || 0).toLocaleString()}₫
            </div>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ngân Sách (₫)</label>
          <input
            type="number"
            style={styles.input}
            value={adGroup.ngansach}
            onChange={(e) => handleChange("ngansach", e.target.value)}
            placeholder="150000"
            step="10000"
          />
        </div>

        <button
          style={styles.removeBtn}
          onClick={() => onRemove(index)}
          title="Xóa nhóm"
        >
          🗑️
        </button>
      </div>

      <NumberPickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(num) => handleChange("sodon", num)}
        currentValue={parseFloat(adGroup.sodon) || 0}
      />
    </>
  );
};

// ============================================================
// AdGroupInput Component
// ============================================================
const AdGroupInput = ({ adGroups, onAdGroupsChange }) => {
  const styles = {
    container: {
      padding: "25px",
      backgroundColor: "#1e1e2e",
      borderRadius: "12px",
      marginBottom: "20px",
      border: "1px solid #2d2d44",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    header: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#89dceb",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    addButton: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#a6e3a1",
      color: "#1e1e2e",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s",
      marginTop: "15px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    empty: {
      padding: "60px 20px",
      textAlign: "center",
      color: "#6c7086",
      fontSize: "15px",
      lineHeight: "1.6",
    },
  };

  const handleUpdate = (index, updatedAdGroup) => {
    const newAdGroups = [...adGroups];
    newAdGroups[index] = updatedAdGroup;
    onAdGroupsChange(newAdGroups);
  };

  const handleRemove = (index) => {
    if (confirm("Bạn có chắc muốn xóa nhóm này?")) {
      const newAdGroups = adGroups.filter((_, i) => i !== index);
      onAdGroupsChange(newAdGroups);
    }
  };

  const handleAdd = () => {
    const newAdGroup = {
      id: Date.now(),
      tennhom: `Nhóm ${adGroups.length + 1}`,
      sodon: 5,
      cpa: "",
      datieu: "",
      ngansach: 150000,
    };
    onAdGroupsChange([...adGroups, newAdGroup]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>📊 Danh Sách Nhóm Quảng Cáo</div>

      {adGroups.length === 0 ? (
        <div style={styles.empty}>
          Chưa có nhóm quảng cáo nào.
          <br />
          Nhấn nút bên dưới để thêm nhóm mới.
        </div>
      ) : (
        adGroups.map((adGroup, index) => (
          <AdGroupRow
            key={adGroup.id}
            adGroup={adGroup}
            index={index}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        ))
      )}

      <button style={styles.addButton} onClick={handleAdd}>
        ➕ Thêm Nhóm Mới
      </button>
    </div>
  );
};

// ============================================================
// ActionButton Component
// ============================================================
const ActionButton = ({ onClick, isLoading }) => {
  const styles = {
    button: {
      width: "100%",
      padding: "22px",
      background: "linear-gradient(135deg, #f9e2af, #f5c2e7)",
      color: "#1e1e2e",
      border: "none",
      borderRadius: "12px",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: isLoading ? "wait" : "pointer",
      transition: "all 0.3s",
      marginBottom: "25px",
      boxShadow: "0 6px 12px rgba(249, 226, 175, 0.3)",
      opacity: isLoading ? 0.7 : 1,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  };

  return (
    <button style={styles.button} onClick={onClick} disabled={isLoading}>
      {isLoading ? "⏳ ĐANG PHÂN TÍCH..." : "🚀 KIỂM TRA & ĐỀ XUẤT"}
    </button>
  );
};

// ============================================================
// ResultCard Component
// ============================================================
const ResultCard = ({ result, adGroup }) => {
  const getActionColor = (action) => {
    if (action.includes("TĂNG")) return "#a6e3a1";
    if (action.includes("GIẢM") || action.includes("TẮT")) return "#f38ba8";
    return "#89dceb";
  };

  const styles = {
    card: {
      padding: "25px",
      backgroundColor: "#1e1e2e",
      borderRadius: "12px",
      border: `3px solid ${getActionColor(result.action)}`,
      marginBottom: "16px",
      boxShadow: `0 4px 12px ${getActionColor(result.action)}33`,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "18px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#cdd6f4",
    },
    action: {
      padding: "10px 18px",
      backgroundColor: getActionColor(result.action),
      color: "#1e1e2e",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    budget: {
      fontSize: "32px",
      fontWeight: "bold",
      color: getActionColor(result.action),
      marginBottom: "12px",
    },
    reason: {
      fontSize: "15px",
      color: "#a6adc8",
      marginBottom: "12px",
      lineHeight: "1.6",
    },
    expertNote: {
      padding: "15px",
      backgroundColor: "#313244",
      borderLeft: "4px solid #f9e2af",
      borderRadius: "6px",
      fontSize: "14px",
      color: "#f9e2af",
      lineHeight: "1.6",
      marginTop: "12px",
    },
    timeFrame: {
      fontSize: "12px",
      color: "#6c7086",
      marginTop: "12px",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>{adGroup.tennhom || "Nhóm không tên"}</div>
        <div style={styles.action}>{result.action}</div>
      </div>

      <div style={styles.budget}>{result.newBudget.toLocaleString()}₫</div>

      <div style={styles.reason}>{result.reason}</div>

      {result.expertNote && (
        <div style={styles.expertNote}>{result.expertNote}</div>
      )}

      {result.timeFrame && (
        <div style={styles.timeFrame}>Khung giờ: {result.timeFrame}</div>
      )}
    </div>
  );
};

// ============================================================
// ResultsDisplay Component
// ============================================================
const ResultsDisplay = ({ results, adGroups }) => {
  const styles = {
    container: {
      padding: "25px",
      backgroundColor: "#181825",
      borderRadius: "12px",
      border: "1px solid #2d2d44",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#f9e2af",
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    summary: {
      padding: "20px",
      backgroundColor: "#1e1e2e",
      borderRadius: "10px",
      marginBottom: "25px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "15px",
    },
    summaryItem: {
      textAlign: "center",
    },
    summaryLabel: {
      fontSize: "13px",
      color: "#a6adc8",
      marginBottom: "8px",
      fontWeight: "600",
    },
    summaryValue: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#f9e2af",
    },
  };

  if (!results || results.length === 0) {
    return null;
  }

  const totalGroups = results.length;
  const tangCount = results.filter((r) => r.action.includes("TĂNG")).length;
  const giamCount = results.filter(
    (r) => r.action.includes("GIẢM") || r.action.includes("TẮT")
  ).length;
  const giuCount = results.filter((r) => r.action.includes("GIỮ")).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>📈 Kết Quả Phân Tích</div>

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <div style={styles.summaryLabel}>Tổng nhóm</div>
          <div style={styles.summaryValue}>{totalGroups}</div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryLabel}>🟢 Tăng</div>
          <div style={{ ...styles.summaryValue, color: "#a6e3a1" }}>
            {tangCount}
          </div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryLabel}>🔵 Giữ</div>
          <div style={{ ...styles.summaryValue, color: "#89dceb" }}>
            {giuCount}
          </div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryLabel}>🔴 Giảm/Tắt</div>
          <div style={{ ...styles.summaryValue, color: "#f38ba8" }}>
            {giamCount}
          </div>
        </div>
      </div>

      {results.map((result, index) => (
        <ResultCard
          key={adGroups[index]?.id || index}
          result={result}
          adGroup={adGroups[index]}
        />
      ))}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const AdOptimizerPro = () => {
  const STORAGE_KEY = "adOptimizerPro_data_v2";

  const initialProducts = [
    { id: 1, name: "MIẾNG DÁN DI ĐÂY", cpaLimit: 27500, adGroups: [] },
    { id: 2, name: "Xoong inox", cpaLimit: 18000, adGroups: [] },
    { id: 3, name: "CHỔI VỆ SINH", cpaLimit: 17500, adGroups: [] },
    { id: 4, name: "Dầu bôi trơn", cpaLimit: 25000, adGroups: [] },
    { id: 5, name: "Cốc gấu", cpaLimit: 21500, adGroups: [] },
    { id: 6, name: "BỘ LỤC GIÁC", cpaLimit: 23000, adGroups: [] },
    { id: 7, name: "LÓT GIÀY", cpaLimit: 24000, adGroups: [] },
    { id: 8, name: "THÔNG VỆ SINH", cpaLimit: 22000, adGroups: [] },
    { id: 9, name: "GIỎ ĐỰNG QUẦN ÁO", cpaLimit: 20000, adGroups: [] },
    { id: 10, name: "CUỘN BẠC", cpaLimit: 19000, adGroups: [] },
    { id: 11, name: "Miếng gỗ", cpaLimit: 16000, adGroups: [] },
    { id: 12, name: "BOC CHAN CHONG XE", cpaLimit: 20000, adGroups: [] },
    { id: 13, name: "Tui xach", cpaLimit: 22000, adGroups: [] },
    { id: 14, name: "Cuon dan buon rua bat", cpaLimit: 23000, adGroups: [] },
  ];

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [selectedProductId, setSelectedProductId] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const currentProduct = products.find(
    (p) => p.id === parseInt(selectedProductId)
  );
  const currentAdGroups = currentProduct?.adGroups || [];

  const handleProductChange = (productId) => {
    setSelectedProductId(productId);
    setResults([]);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleSaveNewProduct = (name, cpaLimit) => {
    const newProduct = {
      id: Date.now(),
      name,
      cpaLimit,
      adGroups: [],
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
    alert("✅ Thêm sản phẩm thành công!");
  };

  const handleSaveProduct = () => {
    if (!currentProduct) {
      alert("⚠️ Vui lòng chọn sản phẩm!");
      return;
    }

    const name = prompt("Nhập tên mới:", currentProduct.name);
    if (!name) return;

    const cpaLimit = parseFloat(
      prompt("Nhập CPA target mới (₫):", currentProduct.cpaLimit)
    );
    if (isNaN(cpaLimit)) {
      alert("⚠️ CPA không hợp lệ!");
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === currentProduct.id ? { ...p, name, cpaLimit } : p
      )
    );
    alert("✅ Lưu thành công!");
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) {
      alert("⚠️ Vui lòng chọn sản phẩm!");
      return;
    }

    if (!confirm(`Xóa sản phẩm "${currentProduct.name}"?`)) return;

    setProducts(products.filter((p) => p.id !== currentProduct.id));
    setSelectedProductId("");
    setResults([]);
    alert("✅ Xóa thành công!");
  };

  const handleAdGroupsChange = (newAdGroups) => {
    setProducts(
      products.map((p) =>
        p.id === currentProduct.id ? { ...p, adGroups: newAdGroups } : p
      )
    );
  };

  const handleCheck = () => {
    if (!currentProduct) {
      alert("⚠️ Vui lòng chọn sản phẩm!");
      return;
    }

    if (currentAdGroups.length === 0) {
      alert("⚠️ Vui lòng thêm nhóm quảng cáo!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newResults = currentAdGroups.map((adGroup) =>
        calculateDecision(adGroup, currentProduct.cpaLimit)
      );
      setResults(newResults);
      setIsLoading(false);
    }, 800);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#11111b",
      color: "#cdd6f4",
      padding: "20px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      fontSize: "36px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "12px",
      background: "linear-gradient(135deg, #a6e3a1, #89dceb, #f9e2af)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      textAlign: "center",
      fontSize: "15px",
      color: "#a6adc8",
      marginBottom: "35px",
      fontWeight: "500",
    },
    maxWidth: {
      maxWidth: "1600px",
      margin: "0 auto",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <h1 style={styles.title}>⚡ AdOptimizer Pro</h1>
        <div style={styles.subtitle}>
          Chiến lược "Săn đơn Chớp nhoáng" - Mục tiêu: 50 đơn/ngày
        </div>

        <ProductManager
          products={products}
          selectedProductId={selectedProductId}
          onProductChange={handleProductChange}
          onAddProduct={handleAddProduct}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
        />

        {currentProduct && (
          <>
            <AdGroupInput
              adGroups={currentAdGroups}
              onAdGroupsChange={handleAdGroupsChange}
            />

            <ActionButton onClick={handleCheck} isLoading={isLoading} />

            <ResultsDisplay results={results} adGroups={currentAdGroups} />
          </>
        )}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewProduct}
      />
    </div>
  );
};

export default AdOptimizerPro;
