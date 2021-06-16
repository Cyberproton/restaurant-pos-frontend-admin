import React, { Component } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

class NavbarSide extends Component {
  state = {};
  render() {
    return (
      <Col className="navbar-side" xs={3}>
        <h1 className="w3-bar-item">Manager</h1>
        <ListGroup>
          <Link to="/food">
            <ListGroup.Item className="menu-item">
              Quản lý món ăn
            </ListGroup.Item>
          </Link>
          <Link to="/account">
            <ListGroup.Item className="menu-item">
              Quản lý tài khoản nhân viên
            </ListGroup.Item>
          </Link>
          <Link to="/qr">
            <ListGroup.Item className="menu-item">Quản lý mã QR</ListGroup.Item>
          </Link>
          <Link to="/order">
            <ListGroup.Item className="menu-item">
              Quản lý đơn đặt hàng
            </ListGroup.Item>
          </Link>
          <Link to="/bill">
            <ListGroup.Item className="menu-item">
              Quản lý hóa đơn
            </ListGroup.Item>
          </Link>
          <Link to="/revenue">
            <ListGroup.Item className="menu-item">
              Quản lý doanh thu
            </ListGroup.Item>
          </Link>
        </ListGroup>
      </Col>
    );
  }
}

export default NavbarSide;
