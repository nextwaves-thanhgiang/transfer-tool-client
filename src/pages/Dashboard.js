import React from "react";
import { Input, DatePicker, Select, Button, Row, Col, Table } from "antd";
import "antd/dist/antd.css";
import {
  SearchOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import TransferTable from "../components/TransferTable";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const dataSource = [
  {
    key: "1",
    transferNo: "TRA24808081042",
    createTime: "08/08/2024 10:42",
    originalStore: "Kho đường số 8",
    destinationStore: "Kho đường số 10",
    status: "Trong kho",
    note: "Chuyển gấp",
    arrivalStatus: "Đã nhận",
    deliveryDate: "2024-08-08",
  },
  // Add more data here
];

const columns = [
  {
    title: "Mã điều chuyển",
    dataIndex: "transferNo",
    key: "transferNo",
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "Kho ban đầu",
    dataIndex: "originalStore",
    key: "originalStore",
  },
  {
    title: "Kho đến",
    dataIndex: "destinationStore",
    key: "destinationStore",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Tình trạng đến",
    dataIndex: "arrivalStatus",
    key: "arrivalStatus",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
  },
  {
    title: "Ngày giao hàng",
    dataIndex: "deliveryDate",
    key: "deliveryDate",
  },
];

const Dashboard = () => {
  return (
    <div className="p-8 bottom-12">
      <TransferTable />
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </div>
  );
};

export default Dashboard;
