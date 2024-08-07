import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Input,
  Row,
  Col,
  Modal,
  Card,
  Checkbox,
} from "antd";
import "./Home.css";
// import data from "./tmpData";

import { SearchOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
const { Option } = Select;
const { Search } = Input;

// Hàm chuyển đổi ký tự có dấu thành không dấu
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const Home = () => {
  return <div>Home</div>;
};

export default Home;
