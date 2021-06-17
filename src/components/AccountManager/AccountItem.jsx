import React, { Component } from "react";
import { Button } from "react-bootstrap";

class AccountItem extends Component {
  state = {};

  handleModify = () => {
    this.props.clickModifyAccount(this.props.account);
  };

  ondelete = () => {
    this.props.handleDelete(this.props.account._id);
  };

  render() {
    const account = this.props.account;
    const index = this.props.index;
    return (
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
          <Button variant="warning" onClick={this.handleModify}>
            Sửa
          </Button>{" "}
          <Button variant="danger" onClick={this.ondelete}>
            Xóa
          </Button>
        </td>
      </tr>
    );
  }
}

export default AccountItem;
