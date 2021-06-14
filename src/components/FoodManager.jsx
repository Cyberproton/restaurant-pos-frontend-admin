import React, { Component } from "react";
import { Table, Container, Button } from "react-bootstrap";
import axios from "../axios";

class FoodManager extends Component {
  state = {
    foods: [],
  };

  UNSAFE_componentWillMount() {
    this.getFoods();
  }

  getFoods = async () => {
    const { data } = await axios.get(`/api/food`);
    this.setState({
      foods: data.foods,
    });
  };

  render() {
    const foods = this.state.foods;
    const listFood = foods.map((food, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td className="item-food-img">
          <img src={food.imageUrl} alt="" />
        </td>
        <td>{food.name}</td>
        <td>{food.price}</td>
        <td className="item-food-button">
          <Button variant="warning">Sửa</Button>{" "}
          <Button variant="danger">Xóa</Button>
        </td>
      </tr>
    ));

    return (
      <Container className="food-manager margin-side">
        <h1>Danh sách món ăn</h1>
        <Button variant="primary" className="mb-3">
          Thêm món mới
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên món</th>
              <th>Giá món</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{listFood}</tbody>
        </Table>
      </Container>
    );
  }
}

export default FoodManager;
