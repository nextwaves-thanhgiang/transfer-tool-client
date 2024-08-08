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
  selectedProducts: [],
};

const data = {
  time: "02:51:01",
  date: "2024-08-09",
  transport_type: "Lãnh vật tư sản xuất",
  receiver_name: "Nguyễn Thanh Giang",
  notes: "Hàng chuyển gấp",
  selectedProducts: [
    {
      code: "78239456",
      name: "Bột gạo",
      unit: "kg",
      quantity: 1,
    },
    {
      code: "82457392",
      name: "Bột mì",
      unit: "kg",
      quantity: 2,
    },
    {
      code: "93728461",
      name: "Tinh bột khoai mì",
      unit: "kg",
      quantity: 3,
    },
  ],
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

  console.log(123);

  const formatData = (data) => {
    return {
      time: data.time,
      date: data.date,
      transport_type:
        data.transport_type === "lanh_vat_tu_san_xuat"
          ? "Lãnh vật tư sản xuất"
          : "Trả vật tư dang dở",
      receiver_name: data.responsiblePerson, // Cần đổi tên trường này nếu khác
      notes: "Hàng chuyển gấp", // Nếu cần lấy từ server data, hãy thêm vào
      selectedProducts: data.products.map((product) => ({
        code: product.code,
        name: product.name,
        unit: product.unit,
        quantity: product.quantity,
      })),
    };
  };
  useEffect(() => {
    // Fetch transfer details from the API
    const fetchTransferDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3003/api/transfer/transfer-details/${trcode}`
        );
        setDataTransfer(response.data);
        JsBarcode(barcodeRef.current, dataTransfer.transferId, {
          format: "CODE128",
          displayValue: true,
          fontSize: 18,
          height: 50,
        });
        const formattedData = formatData(response.data);
        setTransferDetails(formattedData);

        console.log(formattedData);
        console.log(data);
      } catch (error) {
        setError("Error fetching transfer details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransferDetails();
  }, []);

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
          {/* <p>
            <strong>Số lượng:</strong> {data.selectedProducts.length}
          </p> */}

          <p>
            <strong>Tên người lấy hàng:</strong> {transferDetails.receiver_name}
          </p>
          <p>
            <strong>Tên người bàn giao hàng:</strong>
          </p>

          <p>
            <strong>Ghi chú:</strong> {transferDetails.notes}
          </p>
        </div>
        <h2>Danh sách vật tư</h2>
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
