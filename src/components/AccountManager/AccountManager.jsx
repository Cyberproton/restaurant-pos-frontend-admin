import React, { Component } from "react";
import { Table, Container, Button } from "react-bootstrap";
import axios from "../../axios";
import AccountItem from "./AccountItem";
import ModifyAccount from "./ModifyAccount";

class AccountManager extends Component {
  state = {
    accounts: [],
    isAddAccount: false,
    isModifyAccount: false,
    accountInfo: {},
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
    this.setState({ isAddAccount: !this.state.isAddAccount });
  };

  clickModifyAccount = (account) => {
    if (this.state.isModifyAccount === false) {
      this.setState({ accountInfo: account });
    }
    this.setState({ isModifyAccount: !this.state.isModifyAccount });
  };

  handleDelete = async (_id) => {
    await axios.post(`/api/admin/delete`, { _id: _id });
    this.getData();
  };

  render() {
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
        {this.state.isAddAccount && (
          <ModifyAccount onCance={this.clickAddAccount} />
        )}
        {this.state.isModifyAccount && (
          <ModifyAccount
            account={this.state.accountInfo}
            onCance={this.clickModifyAccount}
          />
        )}
        <h1>Danh sách nhân viên cửa hàng</h1>
        <Button
          variant="primary"
          className="mb-3"
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
