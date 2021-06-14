import React, { Component } from "react";
import { Table, Container, Button } from "react-bootstrap";
import axios from "../axios";

class AccountManager extends Component {
  state = {
    accounts: [],
  };

  UNSAFE_componentWillMount() {
    this.getFoods();
  }

  getFoods = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/api/admin`, {
      headers: {
        token: token,
      },
    });
    this.setState({
      accounts: data.accounts,
    });
  };

  render() {
    const accounts = this.state.accounts;
    const listAccount = accounts.map((account, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{account.fullname}</td>
        <td>{account.username}</td>
        <td>{account.phonenumber}</td>
        <td>{account.role}</td>
        <td>{account.dateofbirth}</td>
        <td>{account.mailaddress}</td>
        <td>{account.salary}</td>
        <td className="item-food-button">
          <Button variant="warning">Sửa</Button>{" "}
          <Button variant="danger">Xóa</Button>
        </td>
      </tr>
    ));

    return (
      <Container className="food-manager margin-side">
        <h1>Danh sách món ăn</h1>
        <Button variant="primary" className="mb-3">
          Thêm món mới
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ và Tên</th>
              <th>Tên đăng nhập</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Ngày sinh</th>
              <th>E-mail</th>
              <th>Lương</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{listAccount}</tbody>
        </Table>
      </Container>
    );
  }
}

export default AccountManager;
