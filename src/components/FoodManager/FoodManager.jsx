import React, { Component } from "react";
import { Table, Container, Button, ListGroup } from "react-bootstrap";
import axios from "../../axios";
import ModifyFood from "./ModifyFood";
import FoodItem from "./FoodItem";

class FoodManager extends Component {
  state = {
    items: [],
    isAdd: false,
    isModify: false,
    itemCurrent: {},
  };

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = async () => {
    const { data } = await axios.get(`/api/food`);
    this.setState({
      items: data.foods,
    });
  };

  handleAdd = () => {
    this.setState({ isAdd: !this.state.isAdd });
    this.getData();
  };

  handleLock = async (item) => {
    if (item.lock === false)
      await axios.post(`/api/food/lock`, { _id: item._id });
    else await axios.post(`/api/food/unlock`, { _id: item._id });
    this.getData();
  };

  handleModify = (item) => {
    if (this.state.isModify === false) {
      this.setState({ itemCurrent: item });
    }
    this.setState({ isModify: !this.state.isModify });
    this.getData();
  };

  handleDelete = async (_id) => {
    await axios.post(`/api/food/delete`, { _id: _id });
    this.getData();
  };

  render() {
    const items = this.state.items;
    const list = items.map((item, index) => (
      <FoodItem
        item={item}
        index={index}
        onLock={this.handleLock}
        onModify={this.handleModify}
        onDelete={this.handleDelete}
      />
    ));
    return (
      <Container className="food-manager margin-side">
        {this.state.isAdd && <ModifyFood onCance={this.handleAdd} />}
        {this.state.isModify && (
          <ModifyFood
            food={this.state.itemCurrent}
            onCance={this.handleModify}
          />
        )}
        <h1>QUẢN LÝ MÓN ĂN</h1>
        <ListGroup>
          <ListGroup.Item action>
            {list.length === 0
              ? "Cửa hàng chưa có món nào để bán!"
              : "Tổng số món: " + list.length}
          </ListGroup.Item>
          <ListGroup.Item action>Món bán nhiều nhất:</ListGroup.Item>
          <ListGroup.Item action>Món bán ít nhất: </ListGroup.Item>
        </ListGroup>

        <Button
          variant="primary"
          className="mb-3 mt-3"
          onClick={this.handleAdd}
        >
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
          <tbody>{list}</tbody>
        </Table>
      </Container>
    );
  }
}

export default FoodManager;
