import React, { useState, useEffect, useRef } from "react";
import * as config from "../../services/AppConfig";

import { useForm } from "react-hook-form";
import { toastr } from "react-redux-toastr";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  Col,
  FormGroup,
  InputGroup,
  UncontrolledTooltip
} from "reactstrap";

export default function ResetPassword() {
  var params = window.location.search;
  const toastrOptions = {
    timeOut: 0, // by setting to 0 it will prevent the auto close
    position: "top-right",
    showCloseButton: true, // false by default
    // closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    progressBar: true
  };
  params =
    '{"' +
    params
      .replace(/\?/gi, "")
      .replace(/\&/gi, '","')
      .replace(/\=/gi, '":"') +
    '"}';

  params = JSON.parse(params);
  const [isOpened, setIsOpened] = useState(false);
  const setshow = () => setIsOpened(!isOpened);
  const {
    register,
    errors,
    getValues,
    handleSubmit,
    setError,
    clearError
  } = useForm();

  const [modal, setModal] = useState(true);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const toggle = () => setModal(!modal);
  const url =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
  const loginurl = url + "/pages/login";
  const onSubmit = data => {
    try {
      // fetch("https://jsonplaceholder.typicode.com/todos/1")
      fetch(config.BACKEND_GSURVEY + "/api/v2/users/password/reset", {
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
          console.log(result);
          if (result.success) {
            setshow();

            setTimeout(function() {
              setIsOpened(false);

              setModal(false);
              window.location.replace(loginurl);
            }, 4000);
          } else {
            toastr.error(result.desc, toastrOptions);
          }
        });
    } catch (error) {
      toastr.error(error, toastrOptions);
    }
  };

  return (
    <div className="text-center">
      {/* <a onClick={toggle}> ลืมรหัสผ่าน</a> */}

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
          className="gradient-indigo-purple text-white"
        >
          ลืมรหัสผ่าน
        </ModalHeader>
        <div>
          {!isOpened && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ paddingTop: 20 }}></div>
              <FormGroup>
                <Col md="12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon">
                        <i className="fa fa-key"></i>
                      </span>
                    </div>
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
                          ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ๋ อย่างน้อย 1 ตัว
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
                      name="password"
                      className="form-control"
                      placeholder="กรุณากรอกรหัสผ่านใหม่"
                      type="password"
                      id="passwordptooltip"
                      //  ref={register({ required: "กรุณากรอกรหัสผ่าน" })}
                      onChange={async e => {
                        const value = e.target.value;
                        console.log(value);
                        await sleep(1000);
                        if (value.length < 8) {
                          // clearError("password");
                          setError(
                            "password",
                            "notMatch",
                            "ต้องมีความยาวมากกว่า 8 ตัวอักษรขึ้นไป"
                          );
                        } else if (!/[A-Z]/.test(value)) {
                          // clearError("password");
                          setError(
                            "password",
                            "notMatch",
                            "ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่ อย่างน้อย 1 ตัว"
                          );
                        } else if (!/[0-9]/.test(value)) {
                          // clearError("password");
                          setError(
                            "password",
                            "notMatch",
                            "ต้องมีตัวเลขอย่างน้อย 1 ตัว"
                          );
                        } else if (
                          //!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])$/.test(value)
                          !/^[A-Za-z0-9]+$/.test(value)
                        ) {
                          // clearError("password");
                          setError(
                            "password",
                            "notMatch",
                            "ต้องเป็นตัวอักษรภาษาอังกฤษ และ ตัวเลขเท่านั้น"
                          );
                        } else {
                          clearError("password");
                        }
                      }}
                      ref={register({ required: "กรุณากรอกรหัสผ่าน" })}
                    />
                  </div>
                  {errors.password && (
                    <p style={{ color: "#F08080" }}>
                      {errors.password.message}
                    </p>
                  )}
                </Col>
              </FormGroup>
              <FormGroup>
                <Col md="12">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon">
                        <i className="fa fa-key"></i>
                      </span>
                    </div>
                    <input
                      name="passwordConfirmation"
                      className="form-control"
                      type="password"
                      placeholder="กรุณายืนยันรหัสผ่านใหม่"
                      ref={register({
                        required: "กรุณายืนยันรหัสผ่าน",
                        validate: {
                          matchesPreviousPassword: value => {
                            const { password } = getValues();
                            return (
                              password === value || "รหัสผ่านของท่านไม่ตรงกัน"
                            );
                          }
                        }
                      })}
                    />
                  </div>
                  {errors.passwordConfirmation && (
                    <p style={{ color: "#F08080" }}>
                      {errors.passwordConfirmation.message}
                    </p>
                  )}
                </Col>
              </FormGroup>
              <input
                name="email"
                placeholder="bluebill1049@hotmail.com"
                value={decodeURIComponent(params.email)}
                type="hidden"
                ref={register}
              />
              <input
                name="ref_code"
                value={decodeURIComponent(params.ref_code)}
                type="hidden"
                ref={register}
              />
              <input
                name="otp"
                value={decodeURIComponent(params.otp)}
                type="hidden"
                ref={register}
              />

              <FormGroup>
                <Col md="12">
                  <Button
                    className="btn btn-info btn-lg btn-block"
                    type="submit"
                  >
                    ยืนยันรหัสผ่าน
                  </Button>
                </Col>
              </FormGroup>
            </form>
          )}
        </div>
        {isOpened && (
          <div
            className="teal"
            style={{
              textAlign: "center",
              fontWeight: 400,
              height: 200,
              paddingTop: 20
            }}
          >
            ท่านได้ดำเนินการเปลี่ยนรหัสผ่านเรียบร้อยแล้ว<p></p>
            กรุณาทำการเข้าสู่ระบบอีกครั้ง
          </div>
        )}
      </Modal>
    </div>
  );
}
