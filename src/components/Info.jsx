import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "../axios";

class UserInfo extends Component {
  state = {
    islogout: false,
    user: {},
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      islogout: true,
    });
    this.props.checkLogin();
  };

  UNSAFE_componentWillMount() {
    this.getInfo();
  }

  getInfo = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/admin`, {
      headers: { token: token },
    });
    this.setState({
      user: {
        username: res.data.username,
        password: res.data.password,
        fullname: res.data.fullname,
        phonenumber: res.data.phonenumber,
        role: res.data.role,
        dateofbirth: res.data.dateofbirth,
        mailaddress: res.data.mailaddress,
        salary: res.data.salary,
      },
    });
  };

  deleteAccount = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .delete(`/api/admin`, {
        headers: { token: token },
      })
      .then((res) => {
        localStorage.clear();
        this.setState({
          islogout: true,
        });
      });
  };

  render() {
    if (this.state.islogout) {
      return <Redirect to="/login" />;
    }
    return (
      <Container className="user-info-container margin-side">
        <h1>{this.state.user.fullname ? this.state.user.fullname : this.state.user.username}</h1>
        <Row className="user-item-info">
          <Col>Tên đăng nhập :</Col>
          <Col>
            <input disabled placeholder={this.state.user.username} />
          </Col>
        </Row>
        <Row className="user-item-info">
          <Col>Họ và Tên :</Col>
          <Col>
            <input disabled placeholder={this.state.user.fullname} />
          </Col>
        </Row>
        <Row className="user-item-info">
          <Col>Số điện thoại :</Col>
          <Col>
            <input disabled placeholder={this.state.user.phonenumber} />
          </Col>
        </Row>
        <Row className="user-item-info">
          <Col>Ngày sinh :</Col>
          <Col>
            <input disabled placeholder={this.state.user.dateofbirth} />
          </Col>
        </Row>
        <Row className="user-item-info">
          <Col>Địa chỉ email :</Col>
          <Col>
            <input disabled placeholder={this.state.user.mailaddress} />
          </Col>
        </Row>
        <Row className="user-item-info">
          <Col>Quyền :</Col>
          <Col>
            <input disabled placeholder={this.state.user.role} />
          </Col>
        </Row>
        <Row className="user-item-info">
          <Col>Mức lương :</Col>
          <Col>
            <input disabled placeholder={this.state.user.salary} />
          </Col>
        </Row>

        <Button className="btn btn-danger" onClick={this.handleLogout}>
          Đăng xuất
        </Button>
      </Container>
    );
  }
}

export default UserInfo;
