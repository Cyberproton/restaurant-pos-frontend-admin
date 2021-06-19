import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "../../axios";

class ModifyFood extends Component {
  state = {
    name: "",
    imageUrl: "",
    description: "",
    price: "",
    type: "",
    regions: "",
    lock: false,
  };

  UNSAFE_componentWillMount() {
    const food = this.props.food;
    if (food) {
      this.setState({
        name: food.name,
        imageUrl: food.imageUrl,
        description: food.description,
        price: food.price,
        type: food.type,
        regions: food.regions,
        lock: food.lock,
      });
    }
  }

  handleInputChange = (event) => {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const food = this.props.food;
    if (food) {
      await axios.post(`/api/food/update`, {
        _id: food._id,
        name: this.state.name,
        imageUrl: this.state.imageUrl,
        description: this.state.description,
        price: this.state.price,
        type: this.state.type,
        regions: this.state.regions,
        lock: this.state.lock,
      });
    } else {
      await axios.post(`/api/food/add`, {
        name: this.state.name,
        imageUrl: this.state.imageUrl,
        description: this.state.description,
        price: this.state.price,
        type: this.state.type,
        regions: this.state.regions,
        lock: this.state.lock,
      });
    }
    this.props.onCance();
  };

  render() {
    return (
      <div className="opa-food">
        <Form className="add-food" onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Tên món</Form.Label>
            <Form.Control
              type="text"
              required
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Giá món</Form.Label>
            <Form.Control
              type="text"
              required
              name="price"
              value={this.state.price}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Loại món ăn</Form.Label>
            <Form.Control
              type="text"
              required
              name="type"
              value={this.state.type}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Xuất xứ</Form.Label>
            <Form.Control
              type="text"
              required
              name="regions"
              value={this.state.regions}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              required
              name="description"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Link ảnh</Form.Label>
            <Form.Control
              type="text"
              required
              name="imageUrl"
              value={this.state.imageUrl}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Button variant="danger" onClick={this.props.onCance}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </Form>
      </div>
    );
  }
}

export default ModifyFood;
