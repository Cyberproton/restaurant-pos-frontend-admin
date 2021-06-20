import React, { Component } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

class NavbarSide extends Component {
  render() {
    const role = this.props.role;
    let show;
    if (role === "boss")
      show = (
        <div>
          <Link to="/food">
            <ListGroup.Item className="menu-item">
              Quản lý món ăn
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/new">
            <ListGroup.Item className="menu-item">
              Đơn hàng chờ xác nhận
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/processing">
            <ListGroup.Item className="menu-item">
              Đơn hàng đang thực hiện
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/deliver">
            <ListGroup.Item className="menu-item">
              Đơn hàng chờ giao
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/finished">
            <ListGroup.Item className="menu-item">
              Quản lý hóa đơn
            </ListGroup.Item>
          </Link>
          <Link to="/account">
            <ListGroup.Item className="menu-item">
              Quản lý nhân viên
            </ListGroup.Item>
          </Link>
          <Link to="/qr">
            <ListGroup.Item className="menu-item">Quản lý mã QR</ListGroup.Item>
          </Link>
          <Link to="/revenue">
            <ListGroup.Item className="menu-item">
              Quản lý doanh thu
            </ListGroup.Item>
          </Link>
        </div>
      );
    else if (role === "chef")
      show = (
        <div>
          <Link to="/food">
            <ListGroup.Item className="menu-item">
              Quản lý món ăn
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/new">
            <ListGroup.Item className="menu-item">
              Đơn hàng chờ xác nhận
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/processing">
            <ListGroup.Item className="menu-item">
              Đơn hàng đang thực hiện
            </ListGroup.Item>
          </Link>
        </div>
      );
    else {
      show = (
        <div>
          <Link to="/ordertest/deliver">
            <ListGroup.Item className="menu-item">
              Đơn hàng chờ giao
            </ListGroup.Item>
          </Link>
          <Link to="/ordertest/finished">
            <ListGroup.Item className="menu-item">
              Quản lý hóa đơn
            </ListGroup.Item>
          </Link>
        </div>
      );
    }

    return (
      <Col className="navbar-side" xs={3}>
        <h1 className="w3-bar-item" style={{ textTransform: "uppercase" }}>
          {role}
        </h1>
        <ListGroup>{show}</ListGroup>
      </Col>
    );
  }
}

export default NavbarSide;
