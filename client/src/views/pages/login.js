// import external modules
//https://www.skptricks.com/2018/06/simple-form-validation-in-reactjs-example.html
import React  from "react";
import { NavLink } from "react-router-dom";
import { userService } from "../../services/UserAuth";
import Logo from "../../assets/img/logo_gsurvey_login.png";
import { toastr } from "react-redux-toastr";
import ForgetPassword from "./forgetpassword";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardFooter
} from "reactstrap";

export default function Login() {
  // const history = useHistory();
  const { register, errors, handleSubmit } = useForm();
  
  const url =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
  const loginurl = url + "/pages/main";
  const handleerr = errcode => {
    switch (errcode) {
      case 40103:
        return "ขออภัยบัญชีผู้ใช้งานของท่านไม่ได้รับการอนุมัติ";
      case 40104:
        return "ขออภัยบัญชีผู้ใช้งานของท่านถูกระงับชั่วคราว";
      case 40105:
        return "ไม่พบบัญชีผู้ใช้งาน";
      case 40106:
        return "บัญชีผู้ใช้อยู่ระหว่างการพิจารณาอนุมัติ";
      case 40000:
        return "ท่านกรอกบัญชีหรือรหัสผ่านผิด";
      default:
        return "กรุณาติดต่อผู้ดูแลระบบ";
    }
  };
  const onSubmit = data => {
    userService.login(data.username, data.password).then(
      user => {
        if (user.success) {
          if (localStorage.getItem("userData")) {
            window.location.replace(loginurl);
            // history.push("/pages/main");
          }
        } else {
          if (!user.success) {
            const messagetext = handleerr(user.code);
            toastr.error(messagetext, window.$toastrOptions);
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  };
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
                  color: "white",
                  paddingTop: "20px"
                }}
              >
                เข้าสู่ระบบ
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <Col md="12">
                    <input
                      name="username"
                      className="form-control"
                      placeholder="อีเมลผู้ใช้งาน"
                      type="text"
                      ref={register({
                        required: "กรุณากรอกอีเมลผู้ใช้งาน",
                        pattern: {
                          value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                          message: "กรุณากรอกอีเมลให้ถูกต้อง"
                        }
                      })}
                    />

                    <div
                      style={{
                        color: "#F08080",
                        fontSize: 14,
                        textAlign: "left"
                      }}
                    >
                      {errors.username && errors.username.message}
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md="12">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="รหัสผ่าน"
                      ref={register({
                        required: "กรุณากรอกรหัสผ่านของท่าน"
                      })}
                    />
                    <div
                      style={{
                        color: "#F08080",
                        fontSize: 14,
                        textAlign: "left"
                      }}
                    >
                      {errors.password && errors.password.message}
                    </div>
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
              </form>
            </CardBody>
            <CardFooter>
              <div className="float-left">
                <ForgetPassword />
              </div>
              <div className="float-right">
                <NavLink
                  to="/pages/register"
                  className="text-white"
                  target="_blank"
                >
                  ลงทะเบียนผู้ใช้
                </NavLink>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
