import React, { Component } from "react";
import { Button } from "react-bootstrap";

class BillItem extends Component {
  ondelete = () => {
    this.props.handleDelete(this.props.bill._id);
  };

  render() {
    const bill = this.props.bill;
    const index = this.props.index;
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <th>{bill.orders}</th>
        <th>{bill.employeeId}</th>
        <th>{bill.payment}</th>
        <th>{bill.paymentMethod}</th>
        <th>{bill.date}</th>
        <th>
          <Button variant="danger" onClick={this.ondelete}>
            Xóa
          </Button>
        </th>
      </tr>
    );
  }
}

export default BillItem;
