import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Main from "./components/layout/Main";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import { checkToken } from "./importAxios";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "antd/dist/antd.css";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Profile from "./pages/Profile";
import CreateTransfer from "./pages/CreateTransfer";
import TransferSlipDetail from "./pages/TransferSlipDetail";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenicated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    axios
      .get("http://localhost:3003/api/user/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsAuthenicated(true);
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profiles" element={<Profile />} />
          <Route path="create-transfer" element={<CreateTransfer />}></Route>
          <Route path="transfer-slip-detail" element={<TransferSlipDetail />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
