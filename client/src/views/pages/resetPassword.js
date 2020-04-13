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
  InputGroup
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
  const { register, errors, getValues, handleSubmit } = useForm();

  const [modal, setModal] = useState(true);

  const toggle = () => setModal(!modal);

  const onSubmit = data => {
    //  alert(JSON.stringify(data));

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
          if (result.userId) {
            setshow();

            setTimeout(function() {
              setIsOpened(false);

              setModal(false);
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
                    <input
                      name="password"
                      className="form-control"
                      placeholder="กรุณากรอกรหัสผ่าน"
                      type="password"
                      ref={register({ required: "กรุณากรอกรหัสผ่าน" })}
                    />
                  </div>
                  {errors.password && (
                    <p style={{ color: "red" }}>{errors.password.message}</p>
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
                    <p style={{ color: "red" }}>
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
              <input
                name="return_url"
                value={config.BACKEND_GSURVEY + "/pages/login"}
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
