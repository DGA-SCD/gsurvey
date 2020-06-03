import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// import { Redirect, useHistory } from "react-router";
import useForm from "./useForm";
import {
  Row,
  Col,
  Input,
  FormGroup,
  Button,
  Label,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip
} from "reactstrap";

import * as config from "../../services/AppConfig";
import validateRegister from "../../services/validateRegister";
import { toastr } from "react-redux-toastr";

//Register = () => {
function Register() {
  const {
    handleChange,
    handleChecked,
    handleSubmit,
    clearState,
    account,
    errors
  } = useForm(submit, validateRegister);

  const toastrOptions = {
    timeOut: 0, // by setting to 0 it will prevent the auto close
    position: "top-right",
    showCloseButton: true, // false by default
    // closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    progressBar: true
  };

  function submit() {
    // clearState();
    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/users/register", {
        method: "post",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(account)
      })
        .then(result => result.json())
        .then(result => {
          if (result.success) {
            toastr.success(
              "ท่านได้ลงทะเบียนเรียบร้อยแล้ว รอการยืนยันจากผู้ดูแลระบบอีกครั้ง",
              toastrOptions
            );
            clearState();
            // window.location.replace("/pages/login");
          } else {
            if (result.code === 40300)
              toastr.error("อีเมลนี้ได้ถูกใช้ลงทะเบียนไปแล้ว", toastrOptions);
          }
        });
    } catch (error) {
      toastr.error(error, toastrOptions);
    }
  }
  const [min_id, setmin_id] = useState([]);

  const [dep_id, setdep_id] = useState([]);

  const [org_id, setorg_id] = useState([]);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  //const ischecked = () => setaccount({ ...account, check: !check });

  useEffect(() => {
    async function getMinistry() {
      const response = await fetch(
        config.BACKEND_GSURVEY + "/api/v2/users/ministries"
      );
      const body = await response.json();

      setmin_id(
        body.data.map(({ min_name, min_id }) => ({
          label: min_name,
          value: min_id
        }))
      );
    }

    getMinistry();
  }, []);
  useEffect(() => {
    async function getDepartment() {
      const response = await fetch(
        config.BACKEND_GSURVEY +
          "/api/v2/users/departments?ministryId=" +
          account.min_id
      );
      const body = await response.json();

      setdep_id(
        body.data.map(({ dep_name, dep_id }) => ({
          label: dep_name,
          value: dep_id
        }))
      );
    }
    getDepartment();

    return () => {
      console.log("unmount");
    };
  }, [account.min_id]);

  useEffect(() => {
    async function getOrganize() {
      const response = await fetch(
        config.BACKEND_GSURVEY +
          "/api/v2/users/organizations?departmentId=" +
          account.dep_id
      );
      const body = await response.json();

      setorg_id(
        body.data.map(({ org_name, org_id }) => ({
          label: org_name,
          value: org_id
        }))
      );
    }
    getOrganize();
  }, [account.dep_id]);
  const errorStyle = {
    color: "#F08080",
    fontSize: "13px",
    textAlign: "left"
  };
  return (
    <div className="container">
      <p>
        {/* Debug{JSON.stringify(account)} */}
        {/* Debug{JSON.stringify(check)} */}
      </p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Row className="full-height-vh">
          <Col
            xs="12"
            className="d-flex align-items-center justify-content-center"
          >
            <Card
              className="text-center width-500 gradient-indigo-purple"
              // style={{ backgroundColor: "#1CBCD8" }}
            >
              <CardBody>
                {/* <img src={Logo} alt="logo" /> */}
                <h2 className="white py-4">ลงทะเบียน</h2>

                <FormGroup>
                  <Row>
                    <Col md="6">
                      <Input
                        type="text"
                        className="form-control"
                        name="firstname"
                        value={account.firstname}
                        placeholder="ชื่อ"
                        onChange={handleChange}
                      />
                      {errors.firstname && (
                        <p style={errorStyle}>{errors.firstname}</p>
                      )}
                    </Col>

                    <Col md="6">
                      <Input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={account.lastname}
                        placeholder="สกุล"
                        onChange={handleChange}
                      />
                      {errors.lastname && (
                        <p style={errorStyle}>{errors.lastname}</p>
                      )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Input
                        type="textbox"
                        className="form-control"
                        name="email"
                        value={account.email}
                        placeholder="อีเมล"
                        autoComplete="off"
                        onChange={handleChange}
                      />
                      {errors.email && <p style={errorStyle}>{errors.email}</p>}
                    </Col>
                  </Row>
                </FormGroup>

                <FormGroup>
                  <Row>
                    <Col md="12">
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
                            ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่ อย่างน้อย 1 ตัว
                          </li>
                          <li style={{ lineHeight: "15px" }}>
                            ต้องมีตัวเลขอย่างน้อย 1 ตัว
                          </li>
                          <li style={{ lineHeight: "15px" }}>
                            ต้องเป็นภาษาอังกฤษและตัวเลขเท่านั้น
                          </li>
                        </ul>
                      </UncontrolledTooltip>
                      <Input
                        type="password"
                        className="form-control"
                        name="password"
                        value={account.password}
                        placeholder="รหัสผ่าน"
                        onChange={handleChange}
                        id="passwordptooltip"
                        autoComplete="new-password"
                      />
                      {errors.password && (
                        <p style={errorStyle}>{errors.password}</p>
                      )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Input
                        type="number"
                        className="form-control"
                        name="mobile"
                        value={account.mobile}
                        placeholder="เบอร์โทรศัพท์"
                        onChange={handleChange}
                      />
                      {errors.mobile && (
                        <p style={errorStyle}>{errors.mobile}</p>
                      )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Input
                        type="select"
                        id="min_id"
                        name="min_id"
                        value={account.min_id}
                        onChange={handleChange}
                        autoComplete="off"
                      >
                        <option value="">--เลือกกระทรวง--</option>
                        {min_id.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Input>
                      {errors.min_id && (
                        <p style={errorStyle}>{errors.min_id}</p>
                      )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Input
                        type="select"
                        id="dep_id"
                        name="dep_id"
                        value={account.dep_id}
                        onChange={handleChange}
                      >
                        <option value="">--เลือกกรม--</option>
                        {account.min_id &&
                          dep_id.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                      </Input>
                      {errors.dep_id && (
                        <p style={errorStyle}>{errors.dep_id}</p>
                      )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Input
                        type="select"
                        name="org_id"
                        value={account.org_id}
                        onChange={handleChange}
                      >
                        <option value="">--เลือกหน่วยงาน--</option>
                        {account.dep_id &&
                          account.min_id &&
                          org_id.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                      </Input>
                      {errors.org_id && (
                        <p style={errorStyle}>{errors.org_id}</p>
                      )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <div className="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0 ml-3">
                        <Input
                          type="checkbox"
                          className="custom-control-input"
                          defaultChecked={account.check}
                          // checked={account.ischeck}
                          // name={account.ischeck}
                          id="acception"
                          // isChecked={() =>
                          //   setaccount({
                          //     ...account,
                          //     ischeck: "true"
                          //   })
                          // }
                          onClick={handleChecked}
                          autoComplete="off"
                          // onChange={handleChange}
                        />
                        <Label
                          className="custom-control-label float-left white"
                          for="acception"
                        ></Label>
                        <a
                          onClick={toggle}
                          className="white float-left "
                          style={{ textDecoration: "underline" }}
                        >
                          ฉันยอมรับเงื่อนไขและข้อตกลง
                        </a>
                        <Modal isOpen={modal} toggle={toggle}>
                          <ModalHeader
                            toggle={toggle}
                            className="gradient-indigo-purple text-white"
                          >
                            หนังสือให้ความยินยอมให้ข้อมูลส่วนบุคคล
                          </ModalHeader>
                          <ModalBody>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;ข้าพเจ้า
                            ให้ความยินยอมให้ข้อมูลส่วนบุคคลแก่สำนักงานพัฒนารัฐบาลดิจิทัล
                            (องค์การมหาชน) (ต่อไปนี้เรียกว่า “สำนักงาน”)
                            ในการเก็บรวบรวม ใช้
                            หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
                            เพื่อการเข้าถึงและใช้บริการของสำนักงาน
                            การติดต่อสื่อสาร การประชาสัมพันธ์
                            การแจ้งข้อมูลข่าวสาร หรือการนำเสนอบริการต่างๆ
                            ที่เกี่ยวข้องกับสำนักงาน
                            รวมถึงการให้ข้อมูลส่วนบุคคลเพื่อดำเนินกิจการหรือกิจกรรมภายใต้วัตถุประสงค์ในการดำเนินงานของสำนักงาน
                            หรือตามที่กฎหมายกำหนด ตลอดจนเพื่อวัตถุประสงค์ต่างๆ
                            ตามที่สำนักงานกำหนดในนโยบายการคุ้มครองข้อมูลส่วนบุคคล
                            (Personal Data Protection Policy)<br></br> &nbsp;
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            ข้าพเจ้าขอยืนยันว่าได้อ่านและเข้าใจนโยบายการคุ้มครองข้อมูลส่วนบุคคล
                            (Personal Data Protection Policy) และข้อตกลงต่างๆ
                            ที่เกี่ยวข้อง (ถ้ามี) ของสำนักงานตามช่องทางต่างๆ
                            ที่สำนักงานได้ประกาศให้ทราบแล้ว
                            ข้าพเจ้าจึงได้ลงนามในหนังสือให้ความยินยอมในข้อมูลส่วนบุคคลนี้
                            ข้าพเจ้าตระหนักและได้รับทราบแล้วว่าข้าพเจ้าสามารถแจ้งความจำนงเพิกถอนความยินยอมนี้เมื่อใดก็ได้
                            รวมถึงทราบถึงสิทธิของเจ้าของข้อมูลส่วนบุคคลแล้วตามที่กำหนดในนโยบายการคุ้มครองข้อมูลส่วนบุคคล
                            (Personal Data Protection Policy)
                          </ModalBody>
                          <ModalFooter>
                            <Button color="primary" onClick={toggle}>
                              ปิดหน้าต่าง
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </div>
                      {errors.check && <p style={errorStyle}>{errors.check}</p>}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Col md="12">
                    <Button
                      type="submit"
                      value="Submit"
                      color="danger"
                      block
                      className="btn-pink btn-raised"
                    >
                      ยืนยันข้อมูลเพื่อลงทะเบียนผู้ใช้งาน
                    </Button>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col md="12">
                      <Label style={{ color: "#f5b115" }}>
                        เป็นสมาชิกอยู่แล้วคลิก
                        <NavLink to="/pages/login" className="white">
                          &nbsp; ที่นี่ &nbsp;
                        </NavLink>
                        เพื่อเข้าสู่ระบบ
                      </Label>
                    </Col>
                  </Row>
                </FormGroup>
              </CardBody>

              {/* <Ministry /> */}
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
}
export default Register;
