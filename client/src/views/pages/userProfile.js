// import external modules
import React, { Fragment, Component, useState, useEffect } from "react";

import { userService } from "../../services/UserAuth";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  Input,
  CardBody,
  Table
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
  const [arr, setarr] = useState([]);
  const [prefixdisplay, setPrefixdisplay] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [editContactFlag, seteditContactFlag] = useState(false);

  const toggle_profile = () => seteditContactFlag(!editContactFlag);

  const [prefix, setprefix] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const url1 = config.BACKEND_GSURVEY + `/api/v2/admin/profile`;
      const url2 = config.BACKEND_GSURVEY + `/api/v2/users/prefixes`;

      var apiRequest1 = await fetch(url1, options).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          userService.clearStrogae();
        }
      });
      var apiRequest2 = await fetch(url2, options).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          userService.clearStrogae();
        }
      });
      try {
        Promise.all([apiRequest1, apiRequest2]).then(allResponses => {
          const response1 = allResponses[0];
          const response2 = allResponses[1];
          //  if (!response1.ok) {
          //    //  userService.clearStrogae();
          //  } else {
          setData(response1.data);
          setprefix(response2.data);
          //setarr(response2.data);

          let obj = response2.data.find(o => o.id === response1.data.prefix_id);
          setPrefixdisplay(obj.name);

          setisLoading(false);
          // }
        });
      } catch (error) {
        setisLoading(true);
      }
    };

    fetchData();
  }, []);

  
  const handleChange = e => {
    const { name, value } = e.target;

    setData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert("success");
  };

  //   const get_prefix = prefix_id => {
  //     console.log(prefix_id);
  //     console.log(arr);
  //     if (prefix_id !== undefined && arr.length !== 0) {
  //       let obj = arr.find(o => o.id === prefix_id);
  //       setPrefixdisplay(obj.name);
  //       // console.log(obj);
  //       // return obj.name;
  //     }
  //   };

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
                <Col className="text-right">
                  <Button
                    className="btn-outline-success mr-1 mt-1"
                    size="sm"
                    // onClick={() =>
                    //   dispatch({ type: "EDIT_PROFILE", payload: isEdit })
                    // }
                    onClick={() => {
                      toggle_profile();
                    }}
                  >
                    {editContactFlag ? (
                      <Icon.Check
                        size={20}
                        type="submit"
                        onClick={handleSubmit}
                      />
                    ) : (
                      <Icon.Edit2 size={20} />
                    )}
                  </Button>
                </Col>
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                <form>
                  <CardTitle>
                    <p
                      style={{
                        textDecoration: "underline black",
                        fontSize: "unset",
                        fontWeight: 600
                      }}
                    >
                      ข้อมูลส่วนบุคคล
                    </p>
                  </CardTitle>
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
                                  <option value={value} value={data.id}>
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
                        <td className="col-3 text-bold-400">ชื่อ</td>
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
                              name="postion"
                              id="postion"
                              defaultValue={data.position}
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
                              type="text"
                              name="email"
                              id="email"
                              defaultValue={data.email}
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
                                textDecoration: "underline black",
                                fontSize: "unset",
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
                              type="text"
                              name="mobile"
                              id="mobile"
                              defaultValue={data.mobile}
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
                              type="text"
                              name="office_phone"
                              id="office_phone"
                              defaultValue={data.office_phone}
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
                              type="text"
                              name="ext"
                              id="ext"
                              defaultValue={data.ext}
                            />
                          ) : (
                            ": " + data.ext
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </form>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Card body>
                  <CardTitle></CardTitle>
                  <CardText>Comeing Soon..</CardText>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
}

export default UserProfile;
