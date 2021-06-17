import React, { Component } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { FaHammer, FaPlus } from "react-icons/fa";
import QRCode from "qrcode.react";

import axios from "../axios";

export default class QRManager extends Component {
  constructor(props) {
    super(props);
    this.onQrCodeClick = this.onQrCodeClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddQrCode = this.handleAddQrCode.bind(this);
    this.handleUpdateQrCode = this.handleUpdateQrCode.bind(this);
    this.handleDeleteQrCode = this.handleDeleteQrCode.bind(this);
    this.toggleAddQrCodeForm = this.toggleAddQrCodeForm.bind(this);
    this.toggleUpdateQrCodeForm = this.toggleUpdateQrCodeForm.bind(this);
    this.toggleDeleteQrCodeConfirmation =
      this.toggleDeleteQrCodeConfirmation.bind(this);
  }

  state = {
    qrCodes: [],
    selectedQrCode: null,
    qrCodeForm: {},
    isShowingAddQrCodeForm: false,
    isShowingUpdateQrCodeForm: false,
    isShowingDeleteQrCodeConfirmation: false,
  };

  componentDidMount() {
    axios
      .get("/api/qrcode")
      .then((res) => {
        const qrcodes = res.data.qrcodes;
        this.setState({
          qrCodes: qrcodes,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const qrcode = this.state.selectedQrCode;
    const view = qrcode ? <QrCodeView qrcode={qrcode} /> : null;
    const addForm = this.state.isShowingAddQrCodeForm ? (
      <AddQrCodeForm
        handleInputChange={this.handleInputChange}
        handleAddQrCode={this.handleAddQrCode}
        toggleAddQrCodeForm={this.toggleAddQrCodeForm}
      />
    ) : null;
    const updateForm =
      this.state.isShowingUpdateQrCodeForm && qrcode ? (
        <UpdateQrCodeForm
          qrcode={qrcode}
          handleInputChange={this.handleInputChange}
          handleSubmit={this.handleUpdateQrCode}
          handleToggle={this.toggleUpdateQrCodeForm}
        />
      ) : null;
    const deleteConfirmation =
      this.state.isShowingDeleteQrCodeConfirmation && qrcode ? (
        <DeleteQrCodeConfirmation
          qrcode={qrcode}
          show={true}
          handleSubmit={this.handleDeleteQrCode}
          handleToggle={this.toggleDeleteQrCodeConfirmation}
        />
      ) : null;
    return (
      <Container className="qr-manager margin-side">
        {view}
        <hr />
        <h4>🍽 Danh sách mã QR</h4>
        <QrCodeList
          qrcodes={this.state.qrCodes}
          handleClick={this.onQrCodeClick}
          selectedQrCode={qrcode}
        />
        <Container>
          <Row>
            <Col>
              <Button onClick={this.toggleAddQrCodeForm}>Thêm mã</Button>
            </Col>
            <Col>
              <Button onClick={this.toggleUpdateQrCodeForm} disabled={!qrcode}>
                Sửa mã
              </Button>
            </Col>
            <Col>
              <Button
                onClick={this.toggleDeleteQrCodeConfirmation}
                variant="danger"
                disabled={!qrcode}
              >
                Xóa mã
              </Button>
            </Col>
          </Row>
        </Container>
        <hr />
        {addForm}
        {updateForm}
        {deleteConfirmation}
      </Container>
    );
  }

  onQrCodeClick(qrcodeId) {
    const selected = this.state.selectedQrCode;
    if (selected && selected._id === qrcodeId) {
      this.setState({
        selectedQrCode: null,
      });
      return;
    }
    const qrcode = this.state.qrCodes.find((qr) => qr._id === qrcodeId);
    this.setState({
      selectedQrCode: qrcode ? qrcode : null,
    });
  }

  handleInputChange(name, event) {
    const target = event.target;
    const value = target.value;
    const qrCodeForm = this.state.qrCodeForm;
    qrCodeForm[name] = value;

    this.setState({
      qrCodeForm: qrCodeForm,
    });
  }

  handleAddQrCode(event) {
    event.preventDefault();

    const qrcode = this.state.qrCodeForm;

    if (this.state.qrCodeForm === {}) {
      return;
    }

    axios
      .post("/api/qrcode/", qrcode)
      .then((res) => {
        const qrCodes = this.state.qrCodes;
        qrCodes.push(res.data.qrcode);
        this.setState({
          qrCodes: qrCodes,
          qrCodeForm: {},
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleUpdateQrCode(event) {
    event.preventDefault();

    const qrcode = this.state.qrCodeForm;
    const id = this.state.selectedQrCode
      ? this.state.selectedQrCode._id
      : undefined;

    if (!id || this.state.qrCodeForm === {}) {
      return;
    }

    axios
      .put("/api/qrcode/" + id, qrcode)
      .then((res) => {
        const qrCodes = this.state.qrCodes;
        const i = qrCodes.findIndex((x) => x._id === id);
        qrCodes[i] = res.data.qrcode;
        this.setState({
          qrCodes: qrCodes,
          qrCodeForm: {},
          selectedQrCode: res.data.qrcode,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDeleteQrCode(event) {
    event.preventDefault();
    const id = this.state.selectedQrCode
      ? this.state.selectedQrCode._id
      : undefined;
    if (!id) {
      return;
    }

    axios
      .delete("/api/qrcode/" + id)
      .then((res) => {
        const qrCodes = this.state.qrCodes;
        const i = qrCodes.findIndex((x) => x._id === id);
        if (i < 0) return;
        qrCodes.splice(i, 1);
        this.setState({
          qrCodes: qrCodes,
          qrCodeForm: {},
          selectedQrCode: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleAddQrCodeForm() {
    this.setState((prev) => ({
      isShowingAddQrCodeForm: !prev.isShowingAddQrCodeForm,
      isShowingUpdateQrCodeForm: false,
      isShowingDeleteQrCodeConfirmation: false,
    }));
  }

  toggleUpdateQrCodeForm() {
    this.setState((prev) => ({
      isShowingAddQrCodeForm: false,
      isShowingUpdateQrCodeForm: !prev.isShowingUpdateQrCodeForm,
      isShowingDeleteQrCodeConfirmation: false,
    }));
  }

  toggleDeleteQrCodeConfirmation() {
    this.setState((prev) => ({
      isShowingAddQrCodeForm: false,
      isShowingUpdateQrCodeForm: false,
      isShowingDeleteQrCodeConfirmation:
        !prev.isShowingDeleteQrCodeConfirmation,
    }));
  }
}

function QrCodeList(props) {
  const qrcodes = props.qrcodes;

  if (qrcodes && qrcodes.length > 0) {
    const selectedId = props.selectedQrCode
      ? props.selectedQrCode._id
      : undefined;
    const list = qrcodes.map((value) => (
      <QrCodeRow
        key={value._id}
        qrcode={value}
        handleClick={props.handleClick}
        selected={value._id === selectedId}
      />
    ));
    return (
      <Table striped bordered hover size="sm" className="text-center shadow-lg">
        <thead>
          <tr>
            <th>Chọn</th>
            <th>ID</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </Table>
    );
  } else {
    return (
      <React.Fragment>
        <p>Có vẻ không có mã QR nào cả!</p>
        <br />
      </React.Fragment>
    );
  }
}

function QrCodeRow(props) {
  const isSelected = props.selected;
  const qrcode = props.qrcode;
  const id = qrcode._id.substring(0, 4) + "...";
  const checkedColumn = isSelected ? "✓" : "";
  const checkedRow = isSelected ? "bg-dark text-light" : "bg-light text-dark";

  return (
    <tr className={checkedRow} onClick={() => props.handleClick(qrcode._id)}>
      <td width="10%">{checkedColumn}</td>
      <td>{id}</td>
      <td>{qrcode.link}</td>
    </tr>
  );
}

function AddQrCodeForm(props) {
  return (
    <div className="container border border-primary">
      <Container className="my-4">
        <h5>
          <FaPlus /> Thêm mã QR
        </h5>
        <Form
          onSubmit={(e) => {
            props.handleAddQrCode(e);
            props.toggleAddQrCodeForm();
          }}
        >
          <Form.Group className="mb-3" controlId="formAddQrLink">
            <Form.Label>Link</Form.Label>
            <Form.Control
              required
              type="url"
              placeholder="https://example.com"
              name="link"
              onChange={(e) => props.handleInputChange("link", e)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Thêm mã QR
          </Button>
        </Form>
      </Container>
    </div>
  );
}

function UpdateQrCodeForm(props) {
  const qrcode = props.qrcode;
  return (
    <div className="container border border-primary">
      <Container className="my-4">
        <h5>
          <FaHammer /> Cập nhật mã QR
        </h5>
        <Form>
          <Form.Group className="mb-3" controlId="formUpdateQrLink">
            <Form.Label>Link</Form.Label>
            <Form.Control
              required
              type="url"
              placeholder="https://example.com"
              name="link"
              onChange={(e) => props.handleInputChange("link", e)}
              defaultValue={qrcode.link}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={(e) => {
              props.handleSubmit(e);
              props.handleToggle();
            }}
          >
            Cập nhật mã QR
          </Button>
        </Form>
      </Container>
    </div>
  );
}

function DeleteQrCodeConfirmation(props) {
  const qrcode = props.qrcode;
  const show = props.show;

  return (
    <Modal
      show={show}
      onHide={props.handleToggle}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="bg-danger text-white">
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>Bạn chuẩn bị mã QR sau:</b>
        <hr />
        <p>ID: {qrcode._id}</p>
        <p>Link: {qrcode.link}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleToggle}>
          Đóng
        </Button>
        <Button
          variant="danger"
          onClick={(e) => {
            props.handleSubmit(e);
            props.handleToggle();
          }}
        >
          Xóa mã QR
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function QrCodeView(props) {
  const qrcode = props.qrcode;

  return (
    <Container>
      <Card
        className="text-center"
        style={{ height: "100%" }}
        bg="light"
        text="dark"
        border="dark"
      >
        <Card.Header as="h5" className="text-center">
          QR Code
        </Card.Header>
        <Card.Body>
          <QRCode className="mb-3" value={qrcode.link} />
          <Card.Text className="text-center">
            Link: <b>{qrcode.link}</b>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
