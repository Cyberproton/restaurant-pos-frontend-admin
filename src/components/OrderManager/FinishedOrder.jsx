import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import axios from "../../axios";
import OrderItem from "./OrderItem";

class FinishedOrder extends Component {
  state = {
    items: [],
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const { data } = await axios.get(`/api/ordertest/finished`);
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
        <h1>DANH SÁCH HÓA ĐƠN</h1>
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

export default FinishedOrder;
