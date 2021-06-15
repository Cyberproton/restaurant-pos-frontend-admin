import React, { Component, useState } from "react";
import { Alert, Button, Card, Col, Container, Dropdown, Form, Modal, Row, Table, Tab, Nav } from "react-bootstrap";
import { FaEllipsisV } from 'react-icons/fa'
import axios from "../axios";

export default class OrderManager extends Component {
  constructor(props) {
    super(props);
    this.toggleOrderType = this.toggleOrderType.bind(this);
    this.toggleAcceptButton = this.toggleAcceptButton.bind(this);
    this.toggleDeclineButton = this.toggleDeclineButton.bind(this);
    this.closeAccept = this.closeAccept.bind(this);
    this.closeDecline = this.closeDecline.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.getOrders = this.getOrders.bind(this);
  }

  state = {
    orders: [],
    orderType: "Pending",
    selectedOrder: null,
    acceptButtonToggled: false,
    declineButtonToggled: false,
    showError: false,
    errorMessage: ""
  };

  validState = [ "Pending", "Accepted", "Done", "Rejected" ];

  componentDidMount() {
    this.getOrders();
  }

  getOrders() {
    axios
      .get("/api/order")
      .then((res) => {
        const orders = res.data.orders
        this.setState({
          orders: orders
        });
      })
      .catch((err) => {
        this.setState({
          showError: true,
          errorMessage: err.response ? err.response.data.message : ""
        });
      });
  }

  toggleOrderType(key, event) {
    this.setState(prev => ({
      orderType: key
    }));
  }

  toggleAcceptButton(event, order) {
    this.setState({ selectedOrder: order, acceptButtonToggled: true, declineButtonToggled: false })
  }

  toggleDeclineButton(event, order) {
    this.setState({ selectedOrder: order, acceptButtonToggled: false, declineButtonToggled: true })
  }

  closeAccept() {
    this.setState({ selectedOrder: null, acceptButtonToggled: false, declineButtonToggled: false })
  }

  closeDecline() {
    this.setState({ selectedOrder: null, acceptButtonToggled: false, declineButtonToggled: false })
  }

  toggleError(toggle, message = "") {
    this.setState(prev => ({
      showError: toggle,
      errorMessage: message
    }));
  }

  updateOrder(event, state, reason = undefined) {
    event.preventDefault();

    const selectedOrder = this.state.selectedOrder;

    if (selectedOrder == null) {
      return;
    }

    if (this.validState.findIndex(valid => valid === state) < 0) {
      return;
    }

    axios
      .put("/api/order/" + selectedOrder._id + "/state", { state: state, reason: reason })
      .then(res => {
        const orders = this.state.orders;
        const state = res.data.order.state;
        const reason = res.data.order.reason;
        const idx = orders.findIndex(order => order._id === selectedOrder._id);
        orders[idx].state = state;
        orders[idx].reason = reason;
        this.setState(prev => ({
          orders: orders,
          selectedOrder: null,
          acceptButtonToggled: false,
          declineButtonToggled: false
        }));
      })
      .catch(err => {
        this.setState(prev => ({
          selectedOrder: null,
          acceptButtonToggled: false,
          declineButtonToggled: false,
          showError: true,
          errorMessage: err.response ? err.response.data.message : ""
        }));

        this.getOrders();
      });
  }

  deleteOrder(event) {

  }

  render() {
    const selectedOrder = this.state.selectedOrder;
    const orderType = this.state.orderType;
    const ordersForType = this.state.orders.filter(order => order.food && order.state === orderType);

    return (
      <Container className="margin-side p-5">
        <Alert show={this.state.showError} variant="danger" dismissible onClose={() => this.toggleError(false)}>
          <h5>Có lỗi xảy ra</h5>
          <p>Chi tiết: {this.state.errorMessage}</p>
        </Alert>
        <Accept show={this.state.acceptButtonToggled} selectedOrder={selectedOrder} onHide={this.closeAccept} updateOrder={this.updateOrder} orderType={orderType}/>
        <Decline show={this.state.declineButtonToggled} selectedOrder={selectedOrder} onHide={this.closeDecline} updateOrder={this.updateOrder} orderType={orderType}/>
        <Container>
          <Nav fill variant="pills" defaultActiveKey={orderType} onSelect={this.toggleOrderType}>
            <Nav.Item>
              <Nav.Link eventKey="Pending">Đang chờ</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Accepted">Đang thực hiện</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Done">Hoàn tất</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Rejected">
                Hủy bỏ
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <hr/>
        <Container>
          <Orders 
            orders={ordersForType} 
            orderType={this.state.orderType} 
            toggleAcceptButton={this.toggleAcceptButton}
            toggleDeclineButton={this.toggleDeclineButton}
          />
        </Container>
      </Container>
    );
  }
}

function Orders(props) {
  const orderType = props.orderType;
  let orders = props.orders;
  let acceptBtnTitle = undefined;
  let declineBtnTitle = undefined;

  switch (orderType) {
    case "Pending":
      acceptBtnTitle = "Xác nhận";
      declineBtnTitle = "Từ chối";
      break;
    case "Accepted":
      acceptBtnTitle = "Hoàn tất";
      break;
    default:
      break;
  }

  orders = orders.map(order => (
    <tr key={order._id}>
      <td>{order.food.name}</td>
      <td>{order.quantity}</td>
      <td>{order.price}</td>
      <td>{order.note}</td>
      {orderType === "Rejected" ? <td>{order.reason}</td> : undefined}
      <td width="25%">
        { 
          acceptBtnTitle ? 
          <Button 
            size="sm" 
            onClick={(e) => props.toggleAcceptButton(e, order)}
          >
            {acceptBtnTitle}
          </Button> : 
          undefined
        }
        { 
          declineBtnTitle ? 
          <Button 
            size="sm" 
            variant="danger" 
            onClick={(e) => props.toggleDeclineButton(e, order)}
          >
            Từ Chối
          </Button> :
          undefined
        }
      </td>
    </tr>
  ))

  return (
    <Table striped bordered hover size="lg" className="text-center">
      <thead>
          <tr>
            <th>Tên Món</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Ghi chú</th>
            {orderType === "Rejected" ? <th>Lý do</th> : undefined}
            <th>Thao tác</th>
          </tr>
      </thead>
      <tbody>{orders}</tbody>
    </Table>
  );
}

function Accept(props) {
  const selectedOrder = props.selectedOrder;
  const orderType = props.orderType;
  let acceptBtn = undefined;

  switch (orderType) {
    case "Pending":
      acceptBtn = <Button onClick={(e) => props.updateOrder(e, "Accepted")}>Chấp nhận</Button>;
      break;
    case "Accepted": 
      acceptBtn = <Button onClick={(e) => props.updateOrder(e, "Done")}>Hoàn tất</Button>;
      break;
    default:
      break;
  }

  return (
    <Modal 
      show={props.show && selectedOrder != null} 
      centered
      onHide={props.onHide}
    >
      <Modal.Header className="bg-primary text-light" closeButton>
        <Modal.Title>Xác nhận đơn hàng</Modal.Title>
      </Modal.Header>
      { 
        selectedOrder ? 
        <Modal.Body>
          <p>Mã đơn hàng: {selectedOrder._id}</p>
          <p>Tên món ăn: {selectedOrder.food.name}</p>
          <p>Số lượng: {selectedOrder.quantity}</p>
          <p>Ghi chú: {selectedOrder.note}</p>
        </Modal.Body> : 
        null
      }
      <Modal.Footer>
        {acceptBtn}
        <Button variant="secondary" onClick={props.onHide}>
          Thoát
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Decline(props) {
  const [ reason, setReason ] = useState("");

  const selectedOrder = props.selectedOrder;
  const orderType = props.orderType;
  let declineBtn = undefined;

  return (
    <Modal 
      show={props.show && selectedOrder != null} 
      centered
      onHide={props.onHide}
    >
      <Modal.Header className="bg-danger text-light" closeButton>
        <Modal.Title>Từ chối đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { 
          selectedOrder ? 
          <Modal.Body>
            <p>Mã đơn hàng: {selectedOrder._id}</p>
            <p>Tên món ăn: {selectedOrder.food.name}</p>
            <p>Số lượng: {selectedOrder.quantity}</p>
            <p>Ghi chú: {selectedOrder.note}</p>
            <Form>
              <Form.Group className="mb-3" controlId="formOrderReason">
                <Form.Label>Lý do hủy đơn</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Vui lòng nhập lý do hủy đơn" 
                    name="reason"
                    onChange={e => { setReason(e.target.value); }}
                />
              </Form.Group>
            </Form>
          </Modal.Body> : 
          null
        }
      </Modal.Body>
      <Modal.Footer>
        <Button show={orderType === "Pending"} variant="danger" onClick={(e) => props.updateOrder(e, "Rejected", reason)}>Từ chối</Button>
        <Button variant="secondary" onClick={props.onHide}>
          Thoát
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
