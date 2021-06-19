import React, { Component } from "react";
import { Button } from "react-bootstrap";

class FoodItem extends Component {
  onLock = () => {
    this.props.onLock(this.props.item);
  };

  onModify = () => {
    this.props.onModify(this.props.item);
  };

  onDelete = () => {
    this.props.onDelete(this.props.item._id);
  };

  render() {
    const item = this.props.item;
    const index = this.props.index;
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td className="item-food-img">
          <img src={item.imageUrl} alt="" />
        </td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td className="item-food-button">
          <Button
            variant={item.lock === false ? "success" : "secondary"}
            onClick={this.onLock}
          >
            {item.lock === false ? "Khóa" : "Mở"}
          </Button>{" "}
          <Button variant="warning" onClick={this.onModify}>
            Sửa
          </Button>{" "}
          <Button variant="danger" onclick={this.onDelete}>
            Xóa
          </Button>
        </td>
      </tr>
    );
  }
}

export default FoodItem;
