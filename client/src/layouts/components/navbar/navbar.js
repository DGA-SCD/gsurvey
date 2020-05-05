// import external modules
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
//import { Route , withRouter} from 'react-router-dom';
//import AuthService from "../../../services/AuthService";

//import { IdleTimeOutModal } from "./IdleModal";
import IdleTimer from "react-idle-timer";

import {
  Collapse,
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import {
  // Moon,

  Menu,
  MoreVertical,
  User,
  LogOut
} from "react-feather";

import userImagedga from "../../../assets/img/portrait/avatars/avatar-01.png";
class ThemeNavbar extends Component {
  handleClick = e => {
    this.props.toggleSidebarMenu("open");
  };
  constructor(props) {
    super(props);

    this.state = {
      timeout: 1000 * 60 * 60,
      isOpen: false,

      showModal: false,
      userLoggedIn: false,
      isTimedOut: false

      // redirectToReferrer: false,
      // datauser: ""
    };

    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    // this.Auth = new AuthService();
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  _onAction(e) {
    // console.log("user did something", e);
    this.setState({ isTimedOut: false });
  }

  _onActive(e) {
    // console.log("user is active", e);
    this.setState({ isTimedOut: false });
    console.log("time remaining", this.idleTimer.getRemainingTime());
  }

  _onIdle(e) {
    // console.log("user is idle", e);
    //  console.log("last active", this.idleTimer.getLastActiveTime());
    const isTimedOut = this.state.isTimedOut;
    console.log(this.state.isTimedOut);
    if (isTimedOut) {
      console.log("isTimedOut");
      localStorage.removeItem("userData");
    } else {
      console.log("por");
      this.setState({ showModal: true });
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }
  handleClose() {
    this.setState({ showModal: false });
  }

  handleLogout() {
    this.setState({ showModal: false });
    localStorage.removeItem("userData");
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    if (!localStorage.getItem("userData")) {
      return <Redirect to={"login"} />;
    }
    //const { match } = this.props;

    return (
      <div>
        <IdleTimer
          ref={ref => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={this.state.timeout}
        />
        {/* <Modal isOpen={this.state.showModal}>
          <ModalHeader toggle={this.toggle}>session ของท่านหมดอายุ</ModalHeader>
          <ModalBody>
            session ของท่านหมดอายุ ท่านยังต้องการอยู่ในระบบต่อหรือไม่
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleLogout}>
              ออกจากระบบ
            </Button>
            <Button color="success" onClick={this.handleClose}>
              อยู่ในระบบต่อ
            </Button>
          </ModalFooter>
        </Modal> */}
        <Navbar className="navbar navbar-expand-lg navbar-light bg-faded">
          <div className="container-fluid px-0">
            <div className="navbar-header">
              <Menu
                size={14}
                className="navbar-toggle d-lg-none float-left"
                onClick={this.handleClick.bind(this)}
                data-toggle="collapse"
              />

              {/* <Moon size={20} color="#333" className="m-2 cursor-pointer"/> */}
              <MoreVertical
                className="mt-1 navbar-toggler black no-border float-right"
                size={50}
                onClick={this.toggle}
              />
            </div>

            <div className="navbar-container">
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto float-right" navbar>
                  <UncontrolledDropdown nav inNavbar className="pr-1">
                    <DropdownToggle nav>
                      <img
                        src={userImagedga}
                        alt="logged-in-user"
                        className="rounded-circle width-50"
                      />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <span className="font-small-3">
                          {localStorage.getItem("userlogin")}
                          <span className="text-muted">
                            {JSON.parse(localStorage.getItem("userData")).role}
                          </span>
                        </span>
                      </DropdownItem>
                      <DropdownItem divider />

                      <Link to="user-profile" className="p-0">
                        <DropdownItem>
                          <User size={16} className="mr-1" />
                          ประวัติของฉัน
                        </DropdownItem>
                      </Link>

                      <DropdownItem divider />

                      <Link
                        to="/pages/login"
                        onClick={this.handleLogout}
                        className="p-0"
                      >
                        <DropdownItem>
                          <LogOut size={16} className="mr-1" /> ออกจากระบบ
                        </DropdownItem>
                      </Link>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            </div>
          </div>
        </Navbar>
      </div>
    );
  }
}

export default ThemeNavbar;
