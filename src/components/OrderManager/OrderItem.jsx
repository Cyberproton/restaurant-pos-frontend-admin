import React, { Component } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "../../axios";

class OrderItem extends Component {
  state = {
    isCancel: false,
    isDelete: false,
  };

  cancelOrder = () => {
    this.setState({ isCancel: true });
  };

  handleCancel = async (e) => {
    e.preventDefault();
    await axios.post(`/api/ordertest/update-state`, {
      _id: this.props.item._id,
      state: "cancel",
    });
    this.setState({ isDelete: true });
  };

  handleConfirm = async () => {
    await axios.post(`/api/ordertest/update-state`, {
      _id: this.props.item._id,
      state: "confirmed",
    });
    this.props.getData();
  };

  handleFinish = async () => {
    await axios.post(`/api/ordertest/update-state`, {
      _id: this.props.item._id,
      state: "deliver",
    });
    this.props.getData();
  };

  handleDeliver = async () => {
    await axios.post(`/api/ordertest/payment`, {
      _id: this.props.item._id,
      paymentMethod: "cast",
    });
    this.props.getData();
  };

  handleDelete = async () => {
    await axios.post(`/api/ordertest/delete`, {
      _id: this.props.item._id,
    });
    this.props.getData();
  };

  render() {
    if (this.state.isDelete) return <Redirect to="new" />;

    const index = this.props.index;
    const item = this.props.item;
    const foods = item.foods;
    const listfood = foods.map((food) => {
      return (
        <tr>
          <td>{food.name}</td>
          <td>{food.price}</td>
          <td>{food.amount}</td>
        </tr>
      );
    });

    let button;
    if (item.state === "new") {
      button = (
        <td className="item-food-button">
          <Button variant="warning" onClick={this.handleConfirm}>
            Xác nhận
          </Button>{" "}
          <Button variant="danger" onClick={this.cancelOrder}>
            Từ chối
          </Button>
        </td>
      );
    } else if (item.state === "processing") {
      button = (
        <td className="item-food-button">
          <Button variant="warning" onClick={this.handleFinish}>
            Hoàn thành đơn
          </Button>
        </td>
      );
    } else if (item.state === "deliver") {
      button = (
        <td className="item-food-button">
          <Button variant="warning" onClick={this.handleDeliver}>
            Giao thành công
          </Button>
        </td>
      );
    } else {
      button = (
        <td className="item-food-button">
          <Button variant="warning" onClick={this.handleDelete}>
            Xóa hóa đơn
          </Button>
        </td>
      );
    }
    if (this.state.isCancel) {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td colSpan="5">
            <Form onSubmit={this.handleCancel}>
              <Form.Control type="textarea" placeholder="Lý do hủy đơn" />
              <Button variant="danger" type="submit" className="mt-3">
                Xác nhận hủy đơn
              </Button>
            </Form>
          </td>
        </tr>
      );
    }
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <Table striped bordered hover variant="info">
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Giá</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>{listfood}</tbody>
          </Table>
        </td>
        <td>{item.table}</td>
        <td>{item.time}</td>
        <td>{item.payment}</td>
        {button}
      </tr>
    );
  }
}

export default OrderItem;
