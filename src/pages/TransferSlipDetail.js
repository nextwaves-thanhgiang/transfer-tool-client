import React, { useState, useEffect, useRef } from "react";
import "./TransferSlipDetail.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../assets/images/btf_logo.png";
import axios, { formToJSON } from "axios";
import { useLocation } from "react-router-dom";
import JsBarcode from "jsbarcode";
const initState = {
  time: "",
  date: "",
  transport_type: "",
  receiver_name: "",
  notes: "",
  createdByFullName: "",
  selectedProducts: [],
};

const TransferSlipDetail = () => {
  const [transferDetails, setTransferDetails] = useState(initState);
  const [dataTransfer, setDataTransfer] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const trcode = searchParams.get("trcode");
  const barcodeRef = useRef(null);

  const formatData = (data) => {
    return {
      time: data.time,
      date: data.date,
      transport_type:
        data.transport_type === "lanh_vat_tu_san_xuat"
          ? "Lãnh vật tư sản xuất"
          : "Trả vật tư dang dở",
      receiver_name: data.responsiblePerson, // Cần đổi tên trường này nếu khác
      createdByFullName: data.createdByFullName,
      notes: data.notes, // Nếu cần lấy từ server data, hãy thêm vào
      selectedProducts: data.products.map((product) => ({
        code: product.code,
        name: product.name,
        unit: product.unit,
        quantity: product.quantity,
      })),
    };
  };
  useEffect(() => {
    const fetchTransferDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3003/api/transfer/transfer-details/${trcode}`
        );

        // Cập nhật dữ liệu trước
        setDataTransfer(response.data);

        // Định dạng dữ liệu
        const formattedData = formatData(response.data);
        setTransferDetails(formattedData);

        setLoading(false);
      } catch (error) {
        setError("Error fetching transfer details");
        setLoading(false);
      }
    };

    fetchTransferDetails();
  }, [trcode]);

  useEffect(() => {
    // Chỉ tạo barcode sau khi dataTransfer.transferId đã được cập nhật
    if (dataTransfer.transferId) {
      JsBarcode(barcodeRef.current, dataTransfer.transferId, {
        format: "CODE128",
        displayValue: true,
        fontSize: 18,
        height: 50,
      });
    }
  }, [dataTransfer.transferId]);

  const exportPDF = () => {
    const input = document.getElementById("transfer-slip");

    // Set the scale for higher resolution
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Create PDF with higher quality settings
      const pdf = new jsPDF({
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      // Add image with higher resolution
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("transfer-slip.pdf");
    });
  };

  return (
    <div>
      <div id="transfer-slip" className="transfer-slip">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img src={logo} alt="Logo" className="logo" />
          <div>
            Thời gian:{transferDetails.time}
            <br />
            Ngày: {transferDetails.date}
          </div>
        </div>
        <div className="header">
          <h1 style={{ fontWeight: "700" }}>PHIẾU ĐIỀU CHUYỂN VẬT TƯ</h1>
        </div>
        <div style={{ textAlign: "center" }}>
          <h3 className="bold-center">Mã phiếu: {dataTransfer.transferId}</h3>
          <div style={{ display: "inline-block", margin: "0 auto" }}>
            <svg ref={barcodeRef}></svg>
          </div>
        </div>
        <div className="transfer-slip-info">
          <p>
            <strong>Loại điều chuyển:</strong> {transferDetails.transport_type}
          </p>

          <p>
            <strong>Bộ phận đề xuất:</strong>
          </p>
          <p>
            <strong>Mục đích:</strong>
          </p>
          <p>
            <strong>Người tạo phiếu :</strong>{" "}
            {transferDetails.createdByFullName}
          </p>

          <p>
            <strong>Người bàn giao :</strong>
          </p>
          <p>
            <strong>Người nhận bàn giao:</strong>
          </p>

          <p>
            <strong>Ghi chú:</strong> {transferDetails.notes}
          </p>
        </div>
        <h2>Danh sách vật tư</h2>
        <div className="transfer-slip-table-wrapper">
          <table className="transfer-slip-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Mã vật tư</th>
                <th style={{ width: "140px" }}>Tên</th>
                <th style={{ width: "40px" }}>ĐVT</th>
                <th style={{ width: "40px" }}>SL</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {transferDetails.selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.code}</td>
                  <td style={{ padding: "15px" }}>{product.name}</td>
                  <td>{product.unit}</td>
                  <td>{product.quantity}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="transfer-slip-signature">
          <p>
            <strong>Người nhận</strong>
          </p>
          <p>
            <strong>Trưởng bộ phận</strong>
          </p>
          <p>
            <strong>Người soạn hàng</strong>
          </p>
        </div>
      </div>
      <button onClick={exportPDF}>Xuất PDF</button>
    </div>
  );
};

export default TransferSlipDetail;
