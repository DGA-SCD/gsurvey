// import external modules
//https://www.skptricks.com/2018/06/simple-form-validation-in-reactjs-example.html
import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { userService } from "../../services/UserAuth";
import * as config1 from "../../services/AppConfig";
import Logo from "../../assets/img/logo3.png";
import { toastr } from "react-redux-toastr";
import {
  Row,
  Alert,
  Col,
  Input,
  Form,
  FormGroup,
  Button,
  Label,
  Card,
  CardBody,
  CardFooter
} from "reactstrap";
import { relative } from "path";
import { config } from "react-transition-group";
const toastrOptions = {
  timeOut: 3000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",

      password: "",

      useridError: false,
      passError: false,
      fields: {},
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUseridChange = this.handleUseridChange.bind(this);
  }
  handlePassChange = event => {
    this.setState({ password: event.target.value });
    console.log(this.state.password);
  };
  handleUseridChange = event => {
    console.log(this.state.username);
    this.setState({ username: event.target.value });
  };

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("dfs" + JSON.stringify(this.state.fields));
    if (this.validateForm()) {
      userService
        .login(this.state.fields.username, this.state.fields.password)
        .then(
          user => {
            console.log(user);
            this.setState({
              passError: true
            });
            console.log(this.state);
            // this.props.history.push("main");
            // const { from } = this.props.location.state || {
            //   from: { pathname: "main" }
            // };
            // this.props.history.push(from);
          },
          error => {
            this.setState({ error, loading: false });
            console.log("error");
            toastr.error(
              "ไม่สามารถเข้าระบบได้ ติดต่อผู้ดูแลระบบ",
              toastrOptions
            );
          }
        );
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    console.log("validateForm");
    console.log(fields["username"]);
    if (fields["username"] === "") {
      formIsValid = false;
      console.log(fields["username"] + "por");
      errors["username"] = "*กรุณากรอกอีเมลให้ถูกต้อง";
    }

    if (typeof fields["username"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["username"])) {
        formIsValid = false;
        errors["username"] = "*กรุณากรอกอีเมลให้ถูกต้อง.";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*กรุณากรอกรหัสผ่าน.";
    }

    // if (typeof fields["password"] !== "undefined") {
    //   if (
    //     !fields["password"].match(
    //       /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
    //     )
    //   ) {
    //     formIsValid = false;
    //     errors["password"] = "*Please enter secure and strong password.";
    //   }
    // }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  render() {
    const divStyle = {
      fontSize: "13px",
      color: "white",
      textAlign: "left"
    };
    const errorstyle = {
      fontSize: "15px",
      textAlign: "left",
      color: "red"
    };

    // console.log(this.state.redirectToReferrer);
    // const { errors } = this.state;

    if (localStorage.getItem("userData")) {
      return <Redirect to={"main"} />;
    }

    return (
      <div className="container">
        <Row className="full-height-vh">
          <Col
            xs="12"
            className="d-flex align-items-center justify-content-center"
          >
            <Card className="gradient-indigo-purple text-center width-400">
              <CardBody>
                <img src={Logo} alt="logo" />
                <h2
                  className=""
                  style={{
                    color: "white"
                  }}
                >
                  เข้าสู่ระบบ
                </h2>

                <Form
                  className="pt-2"
                  id="loginForm"
                  method="post"
                  onSubmit={this.handleSubmit}
                >
                  <div> </div>
                  <FormGroup>
                    <Col md="12">
                      <input
                        type="textbox"
                        name="username"
                        value={this.state.fields.username}
                        className="form-control"
                        placeholder="อีเมลผู้ใช้งาน"
                        onChange={this.handleChange}
                      />
                      <div style={errorstyle}>{this.state.errors.username}</div>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col md="12">
                      <Input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        value={this.state.fields.password}
                        placeholder="รหัสผ่าน"
                        onChange={this.handleChange}
                        // onBlur={this.handleChange}
                      />
                      <div style={errorstyle}>{this.state.errors.password}</div>
                    </Col>
                  </FormGroup>
                  <FormGroup> </FormGroup>
                  <FormGroup>
                    <Col md="12">
                      <Button
                        type="submit"
                        color="danger"
                        block
                        className="btn-pink btn-raised"
                      >
                        เข้าสู่ระบบ
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter> </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
