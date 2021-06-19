import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "../../axios";

class ModifyAccount extends Component {
  state = {
    username: "",
    password: "",
    fullname: "",
    phonenumber: "",
    role: "",
    dateofbirth: "",
    mailaddress: "",
    salary: "",
  };

  UNSAFE_componentWillMount() {
    const account = this.props.account;
    if (account) {
      this.setState({
        username: account.username,
        password: account.password,
        fullname: account.fullname,
        phonenumber: account.phonenumber,
        role: account.role,
        dateofbirth: account.dateofbirth,
        mailaddress: account.mailaddress,
        salary: account.salary,
      });
    }
  }

  handleInputChange = (event) => {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const account = this.props.account;
    if (account) {
      await axios.post(`/api/admin/update`, {
        _id: account._id,
        username: this.state.username,
        password: this.state.password,
        fullname: this.state.fullname,
        phonenumber: this.state.phonenumber,
        role: this.state.role,
        dateofbirth: this.state.dateofbirth,
        mailaddress: this.state.mailaddress,
        salary: this.state.salary,
      });
    } else {
      await axios.post(`/api/admin/add`, {
        username: this.state.username,
        fullname: this.state.fullname,
        password: this.state.password,
        phonenumber: this.state.phonenumber,
        role: this.state.role,
        dateofbirth: this.state.dateofbirth,
        mailaddress: this.state.mailaddress,
        salary: this.state.salary,
      });
    }
    this.props.onCance();
  };

  render() {
    return (
      <div className="opa-food">
        <Form className="add-food" onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              required
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              required
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              required
              name="fullname"
              value={this.state.fullname}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              required
              name="phonenumber"
              value={this.state.phonenumber}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Quyền</Form.Label>
            <Form.Control
              type="text"
              required
              name="role"
              value={this.state.role}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="text"
              required
              name="dateofbirth"
              value={this.state.dateofbirth}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Địa chỉ email</Form.Label>
            <Form.Control
              type="email"
              required
              name="mailaddress"
              value={this.state.mailaddress}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Lương</Form.Label>
            <Form.Control
              type="text"
              required
              name="salary"
              value={this.state.salary}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Button variant="danger" onClick={this.props.onCance}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </Form>
      </div>
    );
  }
}

export default ModifyAccount;
