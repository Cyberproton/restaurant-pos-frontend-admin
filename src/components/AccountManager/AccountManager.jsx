import React, { Component } from "react";
import { Table, Container, Button, ListGroup } from "react-bootstrap";
import axios from "../../axios";
import AccountItem from "./AccountItem";
import ModifyAccount from "./ModifyAccount";
import { Redirect } from "react-router-dom";
import { checkLogin } from "../../untils/functions";

class AccountManager extends Component {
  state = {
    accounts: [],
    isAdd: false,
    isModify: false,
    currentItem: {},
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
    this.setState({
      accounts: data.accounts,
    });
  };

  clickAddAccount = () => {
    this.setState({ isAdd: !this.state.isAdd });
    this.getData();
  };

  clickModifyAccount = (account) => {
    if (this.state.isModify === false) {
      this.setState({ currentItem: account });
    }
    this.setState({ isModify: !this.state.isModify });
    this.getData();
  };

  handleDelete = async (_id) => {
    await axios.post(`/api/admin/delete`, { _id: _id });
    this.getData();
  };

  render() {
    if (!checkLogin()) {
      return <Redirect to="/login"/>
    }
    const accounts = this.state.accounts;
    const listAccount = accounts.map((account, index) => (
      <AccountItem
        account={account}
        index={index}
        clickModifyAccount={this.clickModifyAccount}
        handleDelete={this.handleDelete}
      />
    ));

    return (
      <Container className="food-manager margin-side">
        {this.state.isAdd && <ModifyAccount onCance={this.clickAddAccount} />}
        {this.state.isModify && (
          <ModifyAccount
            account={this.state.currentItem}
            onCance={this.clickModifyAccount}
          />
        )}
        <h1>Danh sách nhân viên cửa hàng</h1>
        <ListGroup.Item action>
          {listAccount.length === 0
            ? "Cửa hàng chưa có nhân viên nào!"
            : "Tổng số nhân viên: " + listAccount.length}
        </ListGroup.Item>
        <Button
          variant="primary"
          className="mb-3 mt-3"
          onClick={this.clickAddAccount}
        >
          Thêm nhân viên mới
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
