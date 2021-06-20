import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { FcPortraitMode } from "react-icons/fc";
import { Link, Redirect } from "react-router-dom";
import { NavbarSide } from "../untils";

class Header extends React.Component {
  handleUser() {
    if (localStorage.getItem("token") === null) return "/login";
    return "/info";
  }

  render() {
    if (this.props.isLogin === false) return <Redirect to="/login" />;
    return (
      <div>
        <NavbarSide
          role={this.props.role}
          changeStateOrder={this.props.changeStateOrder}
        />
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          className="d-flex justify-content-between header-side"
        >
          <Container>
            <Navbar.Brand>
              <Link
                style={{
                  color: "white",
                  textShadow:
                    "1px 1px 2px black, 0 0 1em rgb(229, 255, 0), 0 0 0.2em rgb(100, 109, 20)",
                  fontFamily: "Apple Chancery, cursive",
                }}
              >
                POS MANAGER
              </Link>
            </Navbar.Brand>
            <Link to={this.handleUser}>
              <FcPortraitMode style={{ fontSize: "20pt" }} />
            </Link>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Header;
