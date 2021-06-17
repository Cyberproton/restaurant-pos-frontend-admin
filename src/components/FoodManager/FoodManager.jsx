import React, { Component } from "react";
import { Table, Container, Button } from "react-bootstrap";
import axios from "../../axios";
import ModifyFood from "./ModifyFood";
import FoodItem from "./FoodItem";

class FoodManager extends Component {
  state = {
    foods: [],
    isAddFood: false,
    isModifyFood: false,
    foodInfo: {},
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const { data } = await axios.get(`/api/food`);
    this.setState({
      foods: data.foods,
    });
  };

  clickAddFood = () => {
    this.setState({ isAddFood: !this.state.isAddFood });
  };

  clickModifyFood = (food) => {
    if (this.state.isModifyFood === false) {
      this.setState({ foodInfo: food });
    }
    this.setState({ isModifyFood: !this.state.isModifyFood });
  };

  handleDelete = async (_id) => {
    await axios.post(`/api/food/delete`, { _id: _id });
    this.getData();
  };

  render() {
    const foods = this.state.foods;
    const listFood = foods.map((food, index) => (
      <FoodItem
        food={food}
        index={index}
        clickModifyFood={this.clickModifyFood}
        handleDelete={this.handleDelete}
      />
    ));
    return (
      <Container className="food-manager margin-side">
        {this.state.isAddFood && <ModifyFood onCance={this.clickAddFood} />}
        {this.state.isModifyFood && (
          <ModifyFood
            food={this.state.foodInfo}
            onCance={this.clickModifyFood}
          />
        )}
        <h1>Danh sách món ăn</h1>
        <Button variant="primary" className="mb-3" onClick={this.clickAddFood}>
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
