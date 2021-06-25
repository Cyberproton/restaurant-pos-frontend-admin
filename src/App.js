import React, { Component } from "react";
import {
  FoodManager,
  QRManager,
  AccountManager,
  NewOrder,
  Header,
  Login,
  Info,
  RevenueManager,
  DeliverOrder,
  ProcessingOrder,
  FinishedOrder,
} from "./untils";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";
import axios from "./axios";

class App extends Component {
  state = {
    isLogin: false,
    role: "",
    orderState: "new",
  };

  UNSAFE_componentWillMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/admin/role`, {
        headers: { token: token },
      });
      this.setState({ isLogin: true, role: res.data });
    } else this.setState({ isLogin: false, role: "" });
  };

  render() {
    return (
      <Router>
        <Header
          isLogin={this.state.isLogin}
          role={this.state.role}
          changeStateOrder={this.changeStateOrder}
        />
        <Switch>
          <Route exact path="/" component={Info} />
          <Route exact path="/food" component={FoodManager} />
          <Route exact path="/account" component={AccountManager} />
          <Route exact path="/qr" component={QRManager} />
          <Route exact path="/order/new" component={NewOrder} />
          <Route exact path="/order/deliver" component={DeliverOrder} />
          <Route
            exact
            path="/order/processing"
            component={ProcessingOrder}
          />
          <Route exact path="/order/finished" component={FinishedOrder} />
          <Route exact path="/revenue" component={RevenueManager} />
          <Route
            exact
            path="/login"
            render={() => (
              <Login
                checkLogin={this.checkLogin}
                isLogin={this.state.isLogin}
              />
            )}
          />
          <Route
            exact
            path="/info"
            render={() => <Info checkLogin={this.checkLogin} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
