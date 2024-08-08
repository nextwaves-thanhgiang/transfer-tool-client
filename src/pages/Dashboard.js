import React from "react";
import { Input, DatePicker, Select, Button, Row, Col, Table } from "antd";
import "antd/dist/antd.css";
import {
  SearchOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

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
      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        <Row gutter={16} align="middle" justify="space-between">
          <Col>
            <Input
              placeholder="Transfer No."
              style={{ width: 300 }}
              suffix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              style={{ marginRight: "10px" }}
            >
              Create
            </Button>
            <Button>Export</Button>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: "20px" }}>
          <Col>
            <DatePicker placeholder="Start date" />
          </Col>
          <Col>
            <DatePicker placeholder="End date" />
          </Col>
          <Col>
            <Select placeholder="Original ..." style={{ width: 150 }}>
              {/* Các Option ở đây */}
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="Destination ..." style={{ width: 150 }}>
              {/* Các Option ở đây */}
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="Status" style={{ width: 150 }}>
              {/* Các Option ở đây */}
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="Arrival Status" style={{ width: 150 }}>
              {/* Các Option ở đây */}
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
            </Select>
          </Col>
          <Col>
            <Select defaultValue="25 ..." style={{ width: 150 }}>
              {/* Các Option ở đây */}
              <Option value="25">25 ...</Option>
              <Option value="50">50 ...</Option>
              <Option value="100">100 ...</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Dashboard;
