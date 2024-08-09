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
  AutoComplete,
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
  const [suggestions, setSuggestions] = useState([]);
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

    if (value) {
      const filteredSuggestions = data
        .filter((product) => {
          const combinedString = `${product.code} - ${product.name} - ${product.category}`;
          return normalizeString(combinedString).includes(
            normalizeString(value)
          );
        })
        .slice(0, 10) // Giới hạn tối đa 10 gợi ý
        .map((product) => ({
          value: `${product.code} - ${product.name} - ${product.category}`,
          product, // Đính kèm dữ liệu sản phẩm để sử dụng sau này
        }));

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, 300);
  const handleSelect = (value, option) => {
    const selectedProduct = option.product;

    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.code === selectedProduct.code
    );

    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { ...selectedProduct, quantity: 1 },
      ]);
    }

    message.success(`${selectedProduct.name} đã được thêm vào bảng.`);
    setSuggestions([]); // Clear suggestions after selection
    setSearchText(""); // Reset search text
  };
  const handleCategoryChange = (value) => {
    setSelectedCategories(value);
  };

  // const filteredProducts = availableProducts.filter((product) => {
  //   const matchesSearchText =
  //     normalizeString(product.name).includes(normalizeString(searchText)) ||
  //     normalizeString(product.code).includes(normalizeString(searchText));
  //   const matchesCategory =
  //     selectedCategory === "" || product.category === selectedCategory;

  //   return matchesSearchText && matchesCategory;
  // });
  const onFinish = async (values) => {
    if (selectedProducts.length === 0) {
      message.error(
        "Vui lòng chọn ít nhất một sản phẩm trước khi xuất phiếu điều chuyển!"
      );
      return;
    }

    const selectedProductDetails = selectedProducts.map((product) => ({
      code: product.code,
      name: product.name,
      category: product.category,
      unit: product.unit,
      quantity: product.quantity,
    }));

    const transferDetails = {
      time: values.time.format("HH:mm:ss"),
      date: values.date.format("YYYY-MM-DD"),
      transport_type: values.transport_type,
      receiver_name: values.receiver_name,
      notes: values.notes,
      selectedProducts: selectedProductDetails,
    };

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

      window.location.href = `/transfer-slip-detail?trcode=${response.data.transferId}`;
      message.success("Xuất phiếu điều chuyển thành công!");
    } catch (error) {
      console.error("Error creating transfer slip:", error);
      message.error("Có lỗi xảy ra khi xuất phiếu điều chuyển");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleQuantityChange(code, value) {
    const updatedProducts = selectedProducts.map((product) =>
      product.code === code ? { ...product, quantity: value } : product
    );
    setSelectedProducts(updatedProducts);
  }

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

  const removeProductFromSelected = (code) => {
    const updatedProducts = selectedProducts.filter((p) => p.code !== code);
    setSelectedProducts(updatedProducts);
  };

  const columns = [
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
      width: 500,
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
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.code, value)}
        />
      ),
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      key: "unit",
      width: 200,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => removeProductFromSelected(record.code)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // const availableColumns = [
  //   // {
  //   //   title: "Hình ảnh",
  //   //   dataIndex: "image",
  //   //   key: "image",
  //   //   render: (text) => (
  //   //     <img src={text} alt="product" style={{ width: "50px" }} />
  //   //   ),
  //   // },
  //   // {
  //   //   title: "Mã vật tư",
  //   //   dataIndex: "code",
  //   //   key: "code",
  //   // },
  //   {
  //     title: "Tên vật tư",
  //     dataIndex: "name",
  //     key: "name",
  //     render: (text) => (
  //       <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
  //         {text}
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Phân loại",
  //     dataIndex: "category",
  //     key: "category",
  //   },
  //   {
  //     title: "Hành động",
  //     key: "action",
  //     render: (_, record) => (
  //       <Space size="middle">
  //         <Button onClick={() => addProductToSelected(record)}>Thêm</Button>
  //       </Space>
  //     ),
  //   },
  // ];

  return (
    <div style={{ overflowX: "auto" }}>
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
                <Option value="lanh_vat_tu_san_xuat">
                  Lãnh vật tư sản xuất
                </Option>
                <Option value="tra_vat_tu_dang_do">Trả vật tư dang dở</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={5}>
            <Form.Item
              label="Tên người nhận hàng"
              name="receiver_name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên người nhận hàng!",
                },
              ]}
            >
              <Input placeholder="Nhập tên người nhận hàng" />
            </Form.Item>
          </Col> */}

          <Col span={6}>
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
          <Col span={24}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <AutoComplete
                options={suggestions}
                style={{ flex: 1 }}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder="Tìm kiếm sản phẩm"
                filterOption={false} // Để lọc theo logic của bạn thay vì logic mặc định
                value={searchText} // Điều khiển giá trị hiển thị của AutoComplete
                onChange={(value) => setSearchText(value)} // Cập nhật giá trị khi người dùng nhập
              />
              {/* <Select
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
                </Select> */}
            </div>
          </Col>
          <Col>
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
    </div>
  );
};

export default CreateTransfer;
