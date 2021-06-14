import React, { Component } from "react";
import { Card, Container } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "../axios";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  handleInputChange = (event) => {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if (username.length === 0) alert("Bạn phải nhập tên đăng nhập!");
    else if (password.length === 0) alert("Bạn phải nhập mật khẩu!");
    else {
      axios
        .post(`/api/admin/login`, {
          username,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data);
          this.props.checkLogin();
        })
        .catch((error) => {
          alert("Tên đăng nhập hoặc mật khẩu không chính xác!");
        });
    }
  };

  render() {
    if (this.props.isLogin) return <Redirect to="/" />;
    return (
      <Container className="login-form">
        <Card className="login-card">
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>ĐĂNG NHẬP</Card.Title>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group mt-3">
                <label>Tên đăng nhập</label>
                <input
                  className="form-control"
                  name="username"
                  placeholder="Enter Username"
                  value={this.state.username}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group mt-3">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-3"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default Login;
