import React, { Component } from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import { FaCoins, FaCommentDollar, FaDollarSign } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
import axios from "../axios";
import { Redirect } from "react-router-dom";
import { checkLogin } from "../untils/functions";

export default class RevenueManager extends Component {
  constructor(props) {
    super(props);
    this.selectDateFrom = this.selectDateFrom.bind(this);
    this.selectDateTo = this.selectDateTo.bind(this);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    this.state = {
      bills: [],
      dateFrom: now,
      dateTo: now,
      chartFormat: ChartFormat.DAY,
    };
  }

  componentDidMount() {
    axios
      .get("/api/bill/")
      .then((res) => {
        const bills = res.data.bills;
        console.log(bills);
        if (!bills) {
          return;
        }

        this.setState({
          bills: bills,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  selectDateFrom(from) {
    from.setHours(0, 0, 0, 0);
    this.setState({
      dateFrom: from,
    });
  }

  selectDateTo(to) {
    this.setState({
      dateTo: to,
    });
  }

  selectChartFormat(format) {
    this.setState({
      chartFormat: format,
    });
  }

  render() {
    if (!checkLogin()) {
      return <Redirect to="/login"/>
    }
    const chartFormat = this.state.chartFormat;
    const dateFrom = this.state.dateFrom;
    const dateTo = this.state.dateTo;
    const dateToNext = new Date(dateTo);
    dateToNext.setHours(24, 0, 0, 0);
    const filteredBills = this.state.bills.filter(
      (bill) =>
        new Date(bill.date) >= dateFrom && new Date(bill.date) < dateToNext
    );
    const revenue = filteredBills
      .map((bill) => bill.payment)
      .reduce((total, payment) => total + payment, 0);

    const revenuePerFormat = {};
    for (const r of filteredBills) {
      const date = new Date(r.date);

      if (chartFormat === ChartFormat.DAY) {
        date.setHours(0, 0, 0, 0);
      } else if (chartFormat === ChartFormat.MONTH) {
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
      } else if (chartFormat === ChartFormat.YEAR) {
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }

      let a = revenuePerFormat[date];
      if (!a) a = 0;
      revenuePerFormat[date] = a + r.payment;
    }

    const formatName = getChartFormatName(chartFormat);
    const data = {
      labels: [],
      datasets: [
        {
          label: "Doanh thu / " + formatName,
          data: [],
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    };

    const keys = Object.keys(revenuePerFormat)
      .map((k) => new Date(k))
      .sort((a, b) => a - b);
    console.log(keys);
    for (const p of keys) {
      data.labels.push(formatDate(p, chartFormat));
      data.datasets[0].data.push(revenuePerFormat[p]);
    }

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };

    return (
      <Container className="margin-side pt-1">
        <Container className="mt-5">
          <Row>
            <Col>
              <b>Từ ngày: </b>
              <DatePicker
                selected={dateFrom}
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={this.selectDateFrom}
              />
            </Col>
            <Col>
              <b>Đến ngày: </b>
              <DatePicker
                selected={dateTo > dateFrom ? dateTo : dateFrom}
                minDate={dateFrom}
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={this.selectDateTo}
              />
            </Col>
            <Col className="d-flex align-items-end">
              <DropdownButton
                id="dropdown-item-button"
                title={"Dữ liệu: " + formatName}
                variant="outline-dark"
              >
                <Dropdown.Item
                  as={Button}
                  active={chartFormat === ChartFormat.DAY}
                  onSelect={() => this.selectChartFormat(ChartFormat.DAY)}
                >
                  Ngày
                </Dropdown.Item>
                <Dropdown.Item
                  as={Button}
                  active={chartFormat === ChartFormat.MONTH}
                  onSelect={() => this.selectChartFormat(ChartFormat.MONTH)}
                >
                  Tháng
                </Dropdown.Item>
                <Dropdown.Item
                  as={Button}
                  active={chartFormat === ChartFormat.YEAR}
                  onSelect={() => this.selectChartFormat(ChartFormat.YEAR)}
                >
                  Năm
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </Container>
        <Container className="d-flex mt-5 justify-content-around">
          <Container>
            <h5>
              <FaCommentDollar /> Tổng chi: N/A
            </h5>
          </Container>
          <Container>
            <h5>
              <FaCoins /> Tổng thu: {revenue}
            </h5>
          </Container>
          <Container>
            <h5>
              <FaDollarSign /> Lợi nhuận: N/A
            </h5>
          </Container>
        </Container>
        <Container className="my-5">
          <Bar data={data} options={options} />
        </Container>
      </Container>
    );
  }
}

const ChartFormat = {
  DAY: "DAY",
  MONTH: "MONTH",
  YEAR: "YEAR",
};

function getChartFormatName(chartFormat) {
  switch (chartFormat) {
    case ChartFormat.DAY:
      return "Ngày";
    case ChartFormat.MONTH:
      return "Tháng ";
    case ChartFormat.YEAR:
      return "Năm";
    default:
      return "";
  }
}

function formatDate(date, chartFormat) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  switch (chartFormat) {
    case ChartFormat.DAY:
      return [day, month, year].join("-");
    case ChartFormat.MONTH:
      return [month, year].join("-");
    default:
      return year;
  }
}
