import React, { Component } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import axios from "../axios";

class RevenueManager extends Component {
  state = {
    all: 0,
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    salary: 0,
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/api/admin/all`, {
      headers: {
        token: token,
      },
    });
    const employees = data.accounts;
    let salary = 0;
    employees.forEach((employee) => {
      salary += parseInt(employee.salary);
    });
    this.setState({ salary: salary });
    // const { data } = await axios.get(`/api/bill`);
  };

  render() {
    return (
      <Container className="food-manager margin-side">
        <h1>QUẢN LÝ DOANH THU</h1>
        <ListGroup style={{ fontSize: "14pt", fontWeight: "600" }}>
          <ListGroup.Item action>
            Tổng doanh thu từ trước đến nay: {this.state.all} VNĐ
          </ListGroup.Item>
          <ListGroup.Item action>
            Tổng danh thu trong năm: {this.state.year} VNĐ
          </ListGroup.Item>
          <ListGroup.Item action>
            Tổng doanh thu trong tháng: {this.state.month} VNĐ
          </ListGroup.Item>
          <ListGroup.Item action>
            Tổng doanh thu trong tuần: {this.state.week} VNĐ
          </ListGroup.Item>
          <ListGroup.Item action>
            Tổng doanh thu trong ngày: {this.state.day} VNĐ
          </ListGroup.Item>
          <ListGroup.Item action>
            Tổng lương nhân viên: {this.state.salary} VNĐ
          </ListGroup.Item>
        </ListGroup>
        <Button variant="success" className="mt-3">
          In thông tin doanh thu dưới dạng PDF
        </Button>
      </Container>
    );
  }
}

export default RevenueManager;
