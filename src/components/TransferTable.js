import React, { useEffect, useState } from "react";
import "./TransferTable.css";
import { Button } from "antd";
import toast from "react-hot-toast";
import axios from "axios";

const TransferTable = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [transfers, setDataTransfer] = useState([]);

  const toggleRow = (transferId) => {
    setExpandedRowKeys((prevKeys) => {
      if (prevKeys.includes(transferId)) {
        return prevKeys.filter((key) => key !== transferId);
      } else {
        return [...prevKeys, transferId];
      }
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "completed-row";
      case "cancelled":
        return "cancelled-row";
      case "pending":
        return "pending-row";
      default:
        return "";
    }
  };

  const getTransportTypeLabel = (type) => {
    switch (type) {
      case "lanh_vat_tu_san_xuat":
        return "Lãnh vật tư sản xuất";
      case "tra_vat_tu_dang_do":
        return "Trả vật tư dang dở";
      default:
        return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Đang chờ";
      default:
        return status;
    }
  };

  const handleActionClick = async (transferId) => {
    const action = window.prompt(
      "Nhập 'hủy' để hủy, hoặc 'hoàn thành' để hoàn thành:"
    );

    // Kiểm tra nếu action là null hoặc undefined
    if (!action) {
      console.log("Không có hành động nào được nhập.");
      return;
    }

    // Chuyển thành chữ thường và kiểm tra chuỗi nhập vào
    const normalizedAction = action.toLowerCase();
    if (normalizedAction === "hủy" || normalizedAction === "huy") {
      try {
        console.log(transferId);

        const response = await axios.post(
          "http://localhost:3003/api/transfer/update-status",
          {
            transferId,
            status: "cancelled",
          }
        );
        toast.success(response.data.message, {
          position: "top-right",
        });
        console.log("Hủy thành công");
      } catch (error) {
        console.error("Error cancelling transfer:", error);
        toast.error("Có lỗi xảy ra khi hủy phiếu. Vui lòng thử lại.", {
          position: "top-right",
        });
      }
    } else if (
      normalizedAction === "hoàn thành" ||
      normalizedAction === "hoan thanh"
    ) {
      const confirmation = window.prompt(
        "Vui lòng nhập lại mã phiếu để xác nhận hoàn thành:"
      );

      if (confirmation === transferId) {
        try {
          const response = await axios.post(
            "http://localhost:3003/api/transfer/update-status",
            {
              transferId,
              status: "completed",
            }
          );
          toast.success(response.data.message, {
            position: "top-right",
          });
          console.log("Hoàn thành thành công");
        } catch (error) {
          console.error("Error completing transfer:", error);
          toast.error("Có lỗi xảy ra khi hoàn thành phiếu. Vui lòng thử lại.", {
            position: "top-right",
          });
        }
      } else {
        console.log("Mã phiếu không khớp. Hoàn thành thất bại.");
        toast.error("Mã phiếu không khớp. Vui lòng thử lại.", {
          position: "top-right",
        });
      }
    } else {
      console.log("Hành động không hợp lệ.");
      toast.error("Hành động không hợp lệ. Vui lòng thử lại.", {
        position: "top-right",
      });
    }
    fetchDataTransfer();
  };

  const fetchDataTransfer = () => {
    axios
      .get("http://localhost:3003/api/transfer/get-all-transfer")
      .then((response) => {
        setDataTransfer(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchDataTransfer();
  }, []);

  return (
    <div className="transfer-table-container">
      <Button
        onClick={() => (window.location.href = "create-transfer")}
        type="primary"
      >
        Tạo mới phiếu
      </Button>
      <table className="transfer-table">
        <thead>
          <tr>
            <th></th> {/* Cột dành cho nút */}
            <th style={{ minWidth: "150px" }}>Mã Phiếu</th>
            <th>Thời Gian</th>
            <th>Ngày</th>
            <th>Loại Điều Chuyển</th>
            <th>Kho Xuất</th>
            <th>Kho Nhận</th>
            <th>Người Chịu Trách Nhiệm</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <React.Fragment key={transfer._id}>
              <tr className={`main-row ${getStatusClass(transfer.status)}`}>
                <td>
                  <button
                    className="expand-btn"
                    onClick={() => toggleRow(transfer.transferId)}
                  >
                    {expandedRowKeys.includes(transfer.transferId) ? "-" : "+"}
                  </button>
                </td>
                <td
                  data-label="Mã phiếu"
                  onClick={() =>
                    (window.location.href = `transfer-slip-detail?trcode=${transfer.transferId}`)
                  }
                >
                  {transfer.transferId}
                </td>
                <td data-label="Thời Gian">{transfer.time}</td>
                <td data-label="Ngày">{transfer.date}</td>
                <td data-label="Loại điều chuyển">
                  {getTransportTypeLabel(transfer.transport_type)}
                </td>
                <td data-label="Kho xuất">{transfer.fromWarehouse}</td>
                <td data-label="Kho nhận">{transfer.toWarehouse}</td>
                <td data-label="Người chịu trách nhiệm">
                  {transfer.responsiblePerson}
                </td>
                <td data-label="Trạng thái">
                  <span
                    className={`status-label ${getStatusClass(
                      transfer.status
                    )}`}
                    onClick={() => {
                      if (transfer.status === "pending") {
                        handleActionClick(transfer.transferId);
                      }
                    }}
                  >
                    <Button disabled={transfer.status !== "pending"}>
                      {getStatusLabel(transfer.status)}
                    </Button>
                  </span>
                </td>
              </tr>
              {expandedRowKeys.includes(transfer.transferId) && (
                <tr>
                  <td colSpan="9">
                    <div
                      className={`expandable-content ${
                        expandedRowKeys.includes(transfer.transferId)
                          ? "expanded"
                          : ""
                      }`}
                    >
                      <table className="inner-table">
                        <thead>
                          <tr>
                            <th>Mã vật tư</th>
                            <th>Tên vật tư</th>
                            <th>Danh mục</th>
                            <th>ĐVT</th>
                            <th>Số lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transfer.products.map((product) => (
                            <tr key={product._id}>
                              <td style={{ width: 100 }}>{product.code}</td>
                              <td style={{ width: 1000 }}>{product.name}</td>
                              <td style={{ width: 150 }}>{product.category}</td>
                              <td>{product.unit}</td>
                              <td style={{ width: 100 }}>{product.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferTable;
