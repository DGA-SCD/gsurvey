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
      userData: [],
      username: "",

      password: "",

      redirectToReferrer: false,
      useridError: false,
      passError: false,
      errors: {
        username: "",

        password: ""
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUseridChange = this.handleUseridChange.bind(this);
  }
  handlePassChange = event => {
    this.setState({ password: event.target.value });
  };
  handleUseridChange = event => {
    this.setState({ username: event.target.value });
  };
  handleSubmit(e) {
    e.preventDefault();

    userService.login(this.state.username, this.state.password).then(
      user => {
        //console.log(user);
        this.setState({
          passError: false
        });
        // this.props.history.push("main");
        // const { from } = this.props.location.state || {
        //   from: { pathname: "main" }
        // };
        // this.props.history.push(from);
      },
      error => this.setState({ error, loading: false })
    );
  }

  render() {
    const divStyle = {
      fontSize: "13px",
      color: "white",
      textAlign: "left"
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
                        className="form-control"
                        placeholder="Your email"
                        onChange={this.handleUseridChange}
                        required
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col md="12">
                      <Input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        placeholder="02Aug19xx"
                        onChange={this.handlePassChange}
                        // onBlur={this.handleChange}

                        required
                      />
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
                        เข้ าสู่ ระบบ
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
