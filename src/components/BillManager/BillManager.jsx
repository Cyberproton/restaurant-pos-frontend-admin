import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import axios from "../../axios";
import BillItem from "./BillItem";
import { Redirect } from "react-router-dom";
import { checkLogin } from "../../untils/functions";

class BillManager extends Component {
  state = {
    bills: [],
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const { data } = await axios.get(`/api/bill`);
    this.setState({
      bills: data.bills,
    });
  };

  handleDelete = async (id) => {
    await axios.delete(`/api/bill`, { params: { billId: id } });
    this.getData();
  };

  render() {
    if (!checkLogin()) {
      return <Redirect to="/login"/>
    }
    const bills = this.state.bills;
    const listbill = bills.map((bill, index) => (
      <BillItem bill={bill} index={index} handleDelete={this.handleDelete} />
    ));
    return (
      <Container className="food-manager margin-side">
        <h1>Danh sách hóa đơn</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Mã nhân viên</th>
              <th>Tổng tiền</th>
              <th>Hình thức</th>
              <th>Ngày giao dịch</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{listbill}</tbody>
        </Table>
      </Container>
    );
  }
}

export default BillManager;
