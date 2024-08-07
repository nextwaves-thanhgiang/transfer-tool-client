import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
} from "antd";
import signinbg from "../assets/images/btf_sign_in.png";
import defaultHost from "../importAxios";
import toast from "react-hot-toast";
import axios from "axios";

const { Title } = Typography;
const { Header, Content } = Layout;

const onFinish = async (values) => {
  try {
    console.log(values);

    const response = await axios.post(`http://localhost:3003/api/user/login`, {
      email: values.email,
      password: values.password,
    });

    console.log(response.data);

    localStorage.setItem("token", response.data.token);
    toast.success("Đăng nhập thành công!");
    window.location.href = "/dashboard";
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error("Email hoặc mật khẩu không đúng!");
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  }
};

export default class SignIn extends Component {
  render() {
    return (
      <>
        <Layout className="layout-default layout-signin">
          <Header>
            <div className="header-col header-brand">
              <h5>Nextwaves Industries</h5>
            </div>
            <div className="header-col header-nav"></div>
          </Header>
          <Content className="signin">
            <Row gutter={[24, 0]} justify="space-around">
              <Col
                xs={{ span: 24, offset: 0 }}
                lg={{ span: 6, offset: 2 }}
                md={{ span: 12 }}
              >
                <Title className="mb-15">Đăng nhập</Title>
                <Title className="font-regular text-muted" level={5}>
                  Nhập email và mật khẩu để đăng nhập
                </Title>
                <Form onFinish={onFinish} layout="vertical" className="row-col">
                  <Form.Item
                    className="username"
                    label="Địa chỉ Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    className="username"
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input placeholder="Mật khẩu" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      ĐĂNG NHẬP
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col
                className="sign-img"
                style={{ padding: 12 }}
                xs={{ span: 24 }}
                lg={{ span: 12 }}
                md={{ span: 12 }}
              >
                <img src={signinbg} alt="" />
              </Col>
            </Row>
          </Content>
        </Layout>
      </>
    );
  }
}
