import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "../../axios";
import { checkLogin } from "../../untils/functions";
import OrderItem from "./OrderItem";

class NewOrder extends Component {
  state = {
    items: [],
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const { data } = await axios.get(`/api/order/new`);
    this.setState({
      items: data.orders,
    });
  };

  render() {
    if (!checkLogin()) {
      return <Redirect to="/login"/>
    }
    const items = this.state.items;
    const list = items.map((item, index) => (
      <OrderItem item={item} index={index} getData={this.getData} />
    ));
    return (
      <Container className="food-manager margin-side">
        <h1>ĐƠN HÀNG CHỜ XÁC NHẬN</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Đơn hàng</th>
              <th>Số bàn</th>
              <th>Thời gian</th>
              <th>Tổng tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{list}</tbody>
        </Table>
      </Container>
    );
  }
}

export default NewOrder;
