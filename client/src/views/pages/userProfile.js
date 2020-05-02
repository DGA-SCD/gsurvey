// import external modules
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { userService } from "../../services/UserAuth";
import { useForm } from "react-hook-form";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardTitle,
  Button,
  FormGroup,
  Row,
  Col,
  Input,
  CardBody,
  Table,
  UncontrolledTooltip
} from "reactstrap";
import * as Icon from "react-feather";
import classnames from "classnames";
import * as config from "../../services/AppConfig";

function UserProfile() {
  const [activeTab, setactiveTab] = useState("1");
  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };
  var options = {
    method: "get",
    crossDomain: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include"
  };
  const [data, setData] = useState([]);
  const [prefixdisplay, setPrefixdisplay] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [editContactFlag, seteditContactFlag] = useState(false);

  const toggle_profile = () => seteditContactFlag(!editContactFlag);

  const [prefix, setprefix] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url1 = config.BACKEND_GSURVEY + `/api/v2/admin/profile`;
      const url2 = config.BACKEND_GSURVEY + `/api/v2/users/prefixes`;

      var apiRequest1 = await fetch(url1, options).then(response => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          window.location.replace("login");
        }
      });
      var apiRequest2 = await fetch(url2, options).then(response => {
        if (response.ok) {
          return response.json();
        }
      });

      try {
        Promise.all([apiRequest1, apiRequest2]).then(allResponses => {
          const response1 = allResponses[0];
          const response2 = allResponses[1];
          console.log(response2);
          console.log(response1);
          if (response1.status === 401 || response2.status === 401) {
            userService.clearStrogae();
            return <Redirect to={"login"} />;
          } else {
            setData(response1.data);
            setprefix(response2.data);

            //setarr(response2.data);

            let obj = response2.data.find(
              o => o.id === response1.data.prefix_id
            );
            setPrefixdisplay(obj.name);

            setisLoading(false);
          }
        });
      } catch (error) {
        setisLoading(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      typeof prefix !== "undefined" &&
      typeof data.prefix_id !== "undefined"
    ) {
      let obj = prefix.find(o => o.id === parseInt(data.prefix_id));
      if (typeof JSON.stringify(obj) !== "undefined") {
        let x = JSON.stringify(obj);

        let y = JSON.parse(x);

        setPrefixdisplay(y.name);
      }
    }
  }, [data.prefix_id]);

  const handleChange = e => {
    const { name, value } = e.target;

    setData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmituser = e => {
    e.preventDefault();

    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (data.email === "" || !re.test(data.email)) {
      toastr.error("กรุณาตรวจสอบข้อมูลให้ถูกต้อง", window.$toastrOptions);
      return false;
    } else {
      const requestOptions = {
        method: window.$httpPost,
        headers: window.$httpHeaders,
        body: JSON.stringify(data),
        credentials: "include"
      };

      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/profile", requestOptions)
        .then(result => result.json())
        .then(result => {
          console.log(result);

          if (result.success) {
            toastr.success(
              "บันทึกข้อมูลของท่านเรียบร้อยแล้ว",
              window.$toastrOptions
            );
            toggle_profile();
          } else {
            toastr.error(result.desc, window.$toastrOptions);
          }
        });
    }
  };
  //-------------forget password ==========
  const { register, errors, handleSubmit, watch } = useForm();

  const onSubmit = data => {
    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/password/change", {
        method: "post",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      })
        .then(result => result.json())
        .then(result => {
          if (result.success) {
            toastr.success(
              "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
              window.$toastrOptions
            );
          } else {
            toastr.error(
              "รหัสเดิมของท่านไม่ตรงกันที่เคยตั้งไว้",
              window.$toastrOptions
            );
          }
        });
    } catch (error) {
      toastr.error(error, window.$toastrOptions);
    }
  };
  return (
    <div>
      <div>
        <Nav tabs className="nav-border-bottom">
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "1"
              })}
              onClick={() => {
                toggle("1");
              }}
            >
              ข้อมูลของฉัน
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "2"
              })}
              onClick={() => {
                toggle("2");
              }}
            >
              เปลี่ยนรหัสผ่าน
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Card className="">
              <CardBody>
                <Row>
                  <Col
                    className="col-2"
                    style={{
                      display: "flex",
                      //justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <CardTitle>
                      <p
                        style={{
                          // fontSize: "x-large",
                          fontWeight: 600,

                          verticalAlign: "middle"
                        }}
                      >
                        ข้อมูลส่วนบุคคล
                      </p>
                    </CardTitle>
                  </Col>
                  <Col className="text-left">
                    {/* <Button
                      className="btn-outline-success mr-1 mt-1"
                      size="sm"
                      // onClick={() =>
                      //   dispatch({ type: "EDIT_PROFILE", payload: isEdit })
                      // }
                      onClick={() => {
                        toggle_profile();
                      }}
                    > */}
                    {editContactFlag ? (
                      <Icon.Check
                        size={30}
                        type="submit"
                        onClick={handleSubmituser}
                        style={{ color: "#28a745" }}
                      />
                    ) : (
                      <Icon.Edit2
                        size={30}
                        onClick={() => {
                          toggle_profile();
                        }}
                        style={{ color: "#28a745" }}
                      />
                    )}
                    {/* </Button> */}
                  </Col>
                </Row>
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                {isLoading ? (
                  "Loding.."
                ) : (
                  <form>
                    <Table responsive borderless size="sm" className="mt-4">
                      <tbody>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">คำนำหน้า</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <select
                                defaultValue={data.prefix_id}
                                onChange={handleChange}
                                name="prefix_id"
                              >
                                {prefix.map(function(data, value) {
                                  return (
                                    <option key={value} value={data.id}>
                                      {data.name}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              ": " + prefixdisplay //get_prefix(data.prefix_id)
                            )}
                          </td>
                        </tr>

                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">ชื่อ</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="firstname"
                                defaultValue={data.firstname}
                                onChange={handleChange}
                              />
                            ) : (
                              ": " + data.firstname
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">นามสกุล</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="lastname"
                                defaultValue={data.lastname}
                                onChange={handleChange}
                                // onChange={e => onChange(data.id, "name", e.target.value)}
                              />
                            ) : (
                              ": " + data.lastname
                            )}
                          </td>
                        </tr>

                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">ตำแหน่ง</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="position"
                                id="position"
                                defaultValue={data.position}
                                onChange={handleChange}
                              />
                            ) : (
                              ": " + data.position
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">อีเมล</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={data.email}
                                onChange={handleChange}
                                readOnly
                              />
                            ) : (
                              ": " + data.email
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <CardTitle>
                              <p
                                style={{
                                  //  fontSize: "x-large",
                                  fontWeight: 600,
                                  paddingTop: 40,
                                  paddingBottom: 20
                                }}
                              >
                                ข้อมูลในการติดต่อ
                              </p>
                            </CardTitle>
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">กระทรวง</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                readOnly
                                type="text"
                                name="ministry"
                                id="ministry"
                                defaultValue={data.ministry}
                              />
                            ) : (
                              ": " + data.ministry
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">กรม</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                readOnly
                                type="text"
                                name="department"
                                id="department"
                                defaultValue={data.department}
                              />
                            ) : (
                              ": " + data.department
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">หน่วยงาน</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                readOnly
                                type="text"
                                name="organization"
                                id="organization"
                                defaultValue={data.organization}
                              />
                            ) : (
                              ": " + data.organization
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">มือถือ</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="number"
                                name="mobile"
                                id="mobile"
                                defaultValue={data.mobile}
                                onChange={handleChange}
                              />
                            ) : (
                              ": " + data.mobile
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">เบอร์สำนักงาน</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="number"
                                name="office_phone"
                                id="office_phone"
                                defaultValue={data.office_phone}
                                onChange={handleChange}
                              />
                            ) : (
                              ": " + data.office_phone
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex" style={{ paddingLeft: 100 }}>
                          <td className="col-3 text-bold-600">เบอร์ต่อภายใน</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="number"
                                name="ext"
                                id="ext"
                                defaultValue={data.ext}
                                onChange={handleChange}
                              />
                            ) : (
                              ": " + data.ext
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </form>
                )}
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Card className="">
              <Row>
                <Col sm="12">
                  <CardBody>
                    <CardTitle>เปลี่ยนรหัสผ่าน</CardTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div style={{ paddingTop: 20 }}></div>
                      <FormGroup>
                        <Col md="6">
                          <div className="input-group">
                            <input
                              name="oldpass"
                              className="form-control"
                              type="password"
                              placeholder="กรุณากรอกรหัสผ่านเดิม"
                              ref={register({ required: true })}
                            />
                          </div>

                          {errors.x && (
                            <p style={{ color: "#F08080" }}>
                              กรุณากรอกรหัสผ่านเดิม
                            </p>
                          )}
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col md="6">
                          <div className="input-group">
                            <UncontrolledTooltip
                              placement="top"
                              target="passwordptooltip"
                            >
                              <ul
                                style={{
                                  fontSize: "12px",
                                  textAlign: "left"
                                }}
                              >
                                <li style={{ lineHeight: "15px" }}>
                                  ต้องมีอย่างน้อย 8 ตัวอักษร
                                </li>
                                <li style={{ lineHeight: "15px" }}>
                                  ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่ อย่างน้อย 1
                                  ตัว
                                </li>
                                <li style={{ lineHeight: "15px" }}>
                                  ต้องมีตัวเลขอย่างน้อย 1 ตัว
                                </li>
                                <li style={{ lineHeight: "15px" }}>
                                  มีแต่ภาษาอังกฤษและตัวเลขเท่านั้น
                                </li>
                              </ul>
                            </UncontrolledTooltip>
                            <input
                              name="newpass"
                              className="form-control"
                              placeholder="กรุณากรอกรหัสผ่านใหม่"
                              type="password"
                              id="passwordptooltip"
                              onChange={async e => {
                                const value = e.target.value;
                                console.log(value);
                              }}
                              ref={register({
                                required: "กรุณายืนยันรหัสผ่าน",
                                validate: value => {
                                  if (value.length < 8) {
                                    return "ต้องมีความยาวมากกว่า 8 ตัวอักษรขึ้นไป";
                                  } else if (!/[A-Z]/.test(value)) {
                                    // clearError("password");
                                    return "ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่ อย่างน้อย 1 ตัว";
                                  } else if (!/[0-9]/.test(value)) {
                                    return "ต้องมีตัวเลขอย่างน้อย 1 ตัว";
                                  } else if (
                                    // !/[!@#$%^&*(),.?":{}|<>]/.test(value)
                                    !/^[A-Za-z0-9]+$/.test(value)
                                  ) {
                                    return "ต้องเป็นตัวอักษรภาษาอังกฤษ และ ตัวเลขเท่านั้น";
                                  } else {
                                    return true;
                                  }
                                  //  hasNumbers: value => /[0-9]/.test(value),
                                  //  NotspecialChar: value =>
                                  //    !/[!@#$%^&*(),.?":{}|<>]/.test(value),
                                  //  isUpper: value => /[A-Z]/.test(value),
                                  //  isDown: value => /[a-z]/.test(value),
                                  //  Min: value => value < 8
                                }
                              })}
                            />
                          </div>
                          {errors.newpass && (
                            <p style={{ color: "#F08080" }}>
                              {errors.newpass.message}
                            </p>
                          )}
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col md="6">
                          <div className="input-group">
                            <input
                              name="password_repeat"
                              type="password"
                              className="form-control"
                              placeholder="กรุณายืนยันรหัสผ่านใหม่"
                              ref={register({
                                required: "กรุณายืนยันรหัสผ่าน",
                                validate: value =>
                                  value === watch("newpass") ||
                                  "Passwords don't match."
                              })}
                            />
                          </div>

                          {errors.password_repeat && (
                            <p style={{ color: "#F08080" }}>
                              รหัสผ่านของท่านไม่ตรงกัน
                            </p>
                          )}
                        </Col>
                      </FormGroup>

                      <FormGroup>
                        <Col md="6">
                          <Button
                            className="btn btn-info btn-lg btn-block"
                            type="submit"
                          >
                            ยืนยันรหัสผ่าน
                          </Button>
                        </Col>
                      </FormGroup>
                    </form>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
}

export default UserProfile;
