import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Row,
  Col,
  Table,
  Space,
  InputNumber,
  message,
} from "antd";
import "antd/dist/antd.css";
import { debounce } from "lodash";
import axios from "axios";
import moment from "moment";
import data from "../data.json";

const { Option } = Select;
const { TextArea } = Input;

const CreateTransfer = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState(data);
  const [selectedCategory, setSelectedCategories] = useState("");

  useEffect(() => {
    form.setFieldsValue({
      time: moment(),
      date: moment(),
    });
  }, [form]);

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 300);

  const handleCategoryChange = (value) => {
    setSelectedCategories(value);
  };

  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearchText =
      normalizeString(product.name).includes(normalizeString(searchText)) ||
      normalizeString(product.code).includes(normalizeString(searchText));
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;

    return matchesSearchText && matchesCategory;
  });
  const onFinish = async (values) => {
    console.log(selectedProducts);

    const selectedProductDetails = selectedProducts.map((product) => ({
      code: product.code,
      name: product.name,
      category: product.category,
      unit: product.unit, // đảm bảo bao gồm unit ở đây
      quantity: product.quantity,
    }));

    console.log("selectedProductDetails: ", selectedProductDetails);

    const transferDetails = {
      time: values.time.format("HH:mm:ss"),
      date: values.date.format("YYYY-MM-DD"),
      transport_type: values.transport_type,
      receiver_name: values.receiver_name,
      notes: values.notes,
      selectedProducts: selectedProductDetails,
    };

    console.log("Transfer Details:", transferDetails);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3003/api/transfer/create",
        transferDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);
      window.location.href = `/transfer-slip-detail/${response.data.transferId}`;
      message.success("Xuất phiếu điều chuyển thành công!");
    } catch (error) {
      console.error("Error creating transfer slip:", error);
      message.error("Có lỗi xảy ra khi xuất phiếu điều chuyển");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const addProductToSelected = (product) => {
    const { code, name, category, unit, quantity } = product;

    console.log(unit);

    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.code === code
    );

    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
    } else {
      const newProduct = { code, name, category, unit, quantity: 1 };
      setSelectedProducts([...selectedProducts, newProduct]);
    }
  };

  const removeProductFromSelected = (key) => {
    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.key === key
    );
    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      if (updatedProducts[existingProductIndex].quantity > 1) {
        updatedProducts[existingProductIndex].quantity -= 1;
      } else {
        updatedProducts.splice(existingProductIndex, 1);
      }
      setSelectedProducts(updatedProducts);
    }
  };

  const columns = [
    // {
    //   title: "Hình ảnh",
    //   dataIndex: "image",
    //   key: "image",
    //   render: (text) => (
    //     <img src={text} alt="product" style={{ width: "50px" }} />
    //   ),
    // },
    {
      title: "Mã vật tư",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên vật tư",
      dataIndex: "name",
      key: "name",
      width: 400,
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      width: 200,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (text, record) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => {
            const updatedProducts = selectedProducts.map((p) => {
              if (p.code === record.code) {
                return { ...p, quantity: value };
              }
              return p;
            });
            setSelectedProducts(updatedProducts);
          }}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => removeProductFromSelected(record.code)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const availableColumns = [
    // {
    //   title: "Hình ảnh",
    //   dataIndex: "image",
    //   key: "image",
    //   render: (text) => (
    //     <img src={text} alt="product" style={{ width: "50px" }} />
    //   ),
    // },
    // {
    //   title: "Mã vật tư",
    //   dataIndex: "code",
    //   key: "code",
    // },
    {
      title: "Tên vật tư",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => addProductToSelected(record)}>Thêm</Button>
        </Space>
      ),
    },
  ];

  return (
    <Form
      form={form}
      name="collection_form"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{
        margin: "0 auto",
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item
            label="Thời gian"
            name="time"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item
            label="Ngày"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Loại vận chuyển"
            name="transport_type"
            rules={[
              { required: true, message: "Vui lòng chọn loại vận chuyển!" },
            ]}
          >
            <Select placeholder="Chọn loại vận chuyển">
              <Option value="lanh_vat_tu_san_xuat">Lãnh vật tư sản xuất</Option>
              <Option value="tra_vat_tu_dang_do">Trả vật tư dang dở</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            label="Tên người nhận hàng"
            name="receiver_name"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận hàng!" },
            ]}
          >
            <Input placeholder="Nhập tên người nhận hàng" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item
            label="Ghi chú"
            name="notes"
            rules={[{ required: false, message: "Vui lòng nhập ghi chú!" }]}
          >
            <Input placeholder="Nhập ghi chú" rows={4} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Chọn danh mục"
              onChange={handleCategoryChange}
              style={{ width: "200px" }}
            >
              <Option value="">Tất cả</Option>
              <Option value="Nguyên liệu phụ">Nguyên liệu phụ</Option>
              <Option value="Bán thành phẩm">Bán thành phẩm</Option>
              <Option value="Thành phẩm">Thành phẩm</Option>
              <Option value="Hỗn hợp">Hỗn hợp</Option>
              <Option value="Bao bì">Bao bì</Option>
            </Select>
          </div>
          <Table
            dataSource={filteredProducts}
            columns={availableColumns}
            pagination={false}
            title={() => (
              <div
                style={{
                  fontWeight: "bold",
                  color: "#1890ff",
                  fontSize: "16px",
                }}
              >
                Sản phẩm có sẵn
              </div>
            )}
            scroll={{ y: 400 }}
          />
        </Col>
        <Col span={16}>
          <Table
            dataSource={selectedProducts}
            columns={columns}
            pagination={false}
            title={() => (
              <div
                style={{
                  fontWeight: "bold",
                  color: "#1890ff",
                  fontSize: "16px",
                }}
              >
                Sản phẩm đã chọn
              </div>
            )}
            scroll={{ y: 400 }}
          />
        </Col>
      </Row>

      <Form.Item
        style={{
          marginTop: "30px",
          marginRight: "30px",
          display: "flex",
          float: "right",
        }}
      >
        <Button type="primary" htmlType="submit">
          Xuất phiếu điều chuyển
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateTransfer;
