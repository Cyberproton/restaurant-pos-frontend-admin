import React, { Component } from "react";
import { Button } from "react-bootstrap";

class FoodItem extends Component {
  state = {};

  handleModify = () => {
    this.props.clickModifyFood(this.props.food);
  };

  ondelete = () => {
    this.props.handleDelete(this.props.food._id);
  };

  render() {
    const food = this.props.food;
    const index = this.props.index;
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td className="item-food-img">
          <img src={food.imageUrl} alt="" />
        </td>
        <td>{food.name}</td>
        <td>{food.price}</td>
        <td className="item-food-button ">
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

export default FoodItem;
