import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useReducer
} from "react";
import axios from "axios";
import {
  Row,
  Col,
  Media,
  Table,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText
} from "reactstrap";
import * as Icon from "react-feather";
//import { DataFetching, reducer } from "../../services/DataFetching";
import * as config from "../../services/AppConfig";
import { CardHeader } from "@material-ui/core";

const initialState = {
  name: "",
  username: ""
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
function ProFile() {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [editContactFlag, seteditContactFlag] = useState(false);

  const toggle = () => seteditContactFlag(!editContactFlag);

  const intail_prefix = [
    {
      value: 1,
      label: "cerulean"
    },
    {
      value: 2,
      label: "fuchsia rose"
    },
    {
      value: 3,
      label: "true red"
    },
    {
      value: 4,
      label: "aqua sky"
    },
    {
      value: 5,
      label: "tigerlily"
    },
    {
      value: 6,
      label: "blue turquoise"
    }
  ];
  const [prefix, setprefix] = useState(intail_prefix);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          config.BACKEND_GSURVEY + `/api/v2/admin/profile`,
          options
        );

        console.log(result);
        if (result.ok) {
          const json = await result.json();
          setData(json.data);
          setisLoading(false);
          console.log(data);
        } else {
          setisLoading(true);
          //   userService.clearStrogae();
        }
      } catch (error) {
        setisLoading(false);
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
    alert("dddd");
    e.preventDefault();
    alert(data.name);
    alert(data.id);
  };

  return (
    <div>
      <Fragment>
        <Row className="row-eq-height">
          <Col sm="12" md="12" xl="12">
            <Card className="">
              <CardBody></CardBody>
              <CardBody className="pt-2 pb-0">
                <Row>
                  <Col>
                    <CardTitle>ข้อมูลส่วนตัว</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button
                      className="btn-outline-success mr-1 mt-1"
                      size="sm"
                      // onClick={() =>
                      //   dispatch({ type: "EDIT_PROFILE", payload: isEdit })
                      // }
                      onClick={() => {
                        toggle();
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
                </Row>

                {isLoading ? (
                  "Loding.."
                ) : (
                  <form>
                    <Table responsive borderless size="sm" className="mt-4">
                      <pre>{JSON.stringify(data, null, 2)}</pre>
                      <tbody>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-400">ชื่อ</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="firstname"
                                defaultValue={data.firstname}
                                onChange={handleChange}
                                // onChange={handleInputChange}
                                // onClick={() =>
                                //     dispatch({ type: "UPDATE_FIELD_VALUE", payload: isEdit })
                                //   }

                                //onChange={handleInputChange}
                                //   onClick={() =>
                                //     dispatch({
                                //       type: UPDATE_FIELD_VALUE,
                                //       payload: {
                                //         field,
                                //         value
                                //       }
                                //     })
                                //   }
                                //   onChange={e =>
                                //     onChange(data.id, "name", e.target.value)
                                //   }
                              />
                            ) : (
                              ": " + data.firstname
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
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
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">Last Name</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <select
                                defaultValue={data.id}
                                onChange={handleChange}
                                name="id"
                              >
                                {prefix.map(function(data, value) {
                                  return (
                                    <option value={value} value={data.value}>
                                      {data.label}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              ": " + data.id
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">ตำแหน่ง</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="postion"
                                id="postion"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">อีเมล</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="email"
                                id="email"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">กระทรวง</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="company"
                                id="company"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">กรม</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="company"
                                id="company"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">หน่วยงาน</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="company"
                                id="company"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">มือถือ</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="mobile"
                                id="mobile"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">เบอร์สำนักงาน</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="tel"
                                id="tel"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-3 text-bold-600">เบอร์ต่อภายใน</td>
                          <td className="col-9">
                            {editContactFlag ? (
                              <Input
                                type="text"
                                name="ext"
                                id="ext"
                                defaultValue={data.name}
                              />
                            ) : (
                              ": " + data.name
                            )}
                          </td>
                        </tr>
                        {/*    <tr className="d-flex">
                      <td className="col-3 text-bold-400">Note</td>
              <td className="col-9">
                {editContactFlag ? (
                  <Input
                    type="text"
                    name="notes"
                    id="notes"
                    defaultValue={selectedContacts.notes}
                    onChange={e =>
                      onChange(selectedContacts.id, "notes", e.target.value)
                    }
                  />
                ) : (
                  ": " + selectedContacts.notes
                )}
              </td>
            </tr> */}
                      </tbody>
                    </Table>
                  </form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fragment>
    </div>
  );
}
export default ProFile;
