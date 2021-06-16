import React, { Component } from "react";
import {
  Home,
  FoodManager,
  QRManager,
  AccountManager,
  OrderManager,
  BillManager,
  RevenueManager,
  Header,
  Login,
  Info,
} from "./untils";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";

class App extends Component {
  state = {
    isLogin: false,
  };

  UNSAFE_componentWillMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    if (localStorage.getItem("token") !== null)
      this.setState({ isLogin: true });
    else this.setState({ isLogin: false });
  };

  render() {
    return (
      <Router>
        <Header isLogin={this.state.isLogin} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/food" component={FoodManager} />
          <Route exact path="/account" component={AccountManager} />
          <Route exact path="/qr" component={QRManager} />
          <Route exact path="/order" component={OrderManager} />
          <Route exact path="/bill" component={BillManager} />
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
