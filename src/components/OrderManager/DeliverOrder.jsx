import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import axios from "../../axios";
import OrderItem from "./OrderItem";

class DeliverOrder extends Component {
  state = {
    items: [],
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const { data } = await axios.get(`/api/ordertest/deliver`);
    this.setState({
      items: data.orders,
    });
  };

  render() {
    const items = this.state.items;
    const list = items.map((item, index) => (
      <OrderItem item={item} index={index} getData={this.getData} />
    ));
    return (
      <Container className="food-manager margin-side">
        <h1>ĐƠN HÀNG CHỜ GIAO</h1>
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

export default DeliverOrder;
