import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as config from "../../services/AppConfig";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  input,
  Col,
  FormGroup
} from "reactstrap";

import { toastr } from "react-redux-toastr";

export default function ForgetPassword() {
  const initalstate = {
    email: "",
    return_url: "/pages/resetPassword",
    //return_url: "http://client.open4u.io:3002/pages/resetPassword",
    ref_code: Math.random().toString(36).substring(7)
  };
  const toastrOptions = {
    timeOut: 0, // by setting to 0 it will prevent the auto close
    position: "top-right",
    showCloseButton: true, // false by default
    // closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    progressBar: true
  };
  const { register, handleSubmit, errors } = useForm();
  const [modal, setModal] = useState(false);
  const [detail, setdetail] = useState(initalstate);
  const [isOpened, setIsOpened] = useState(false);
  const setshow = () => setIsOpened(!isOpened);
  const toggle = () => setModal(!modal);
  const onSubmit = detail => {
    //  e.preventDefault();

    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/users/otp", {
        method: "post",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(detail)
      })
        .then(result => result.json())
        .then(result => {
          console.log(result);
          if (result.success) {
            setshow();
            setdetail(initalstate);

            setTimeout(function () {
              setIsOpened(false);

              setModal(false);
            }, 4000);
          } else {
            if (result.code === 40400) {
              toastr.error("ไม่พบอีเมลนี้ในระบบ", toastrOptions);
            } else toastr.error(result.desc, toastrOptions);
          }
        });
    } catch (error) {
      toastr.error(error, toastrOptions);
    }
  };
  return (
    <div className="text-center text-white">
      <a onClick={toggle}> ลืมรหัสผ่าน</a>

      <Modal isOpen={modal} toggle={toggle}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            toggle={toggle}
            className="gradient-indigo-purple text-white"
          >
            ลืมรหัสผ่าน
          </ModalHeader>
          <ModalBody>
            {!isOpened && (
              <div>
                <FormGroup>
                  <Col md="12">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon">
                          {/* <i className="fa fa-user prefix"></i> */}
                          <i className="fa fa-at prefix"></i>
                        </span>
                      </div>
                      <input
                        type="ะำ"
                        className="form-control"
                        name="email"
                        placeholder="กรอกอีเมล์ของท่าน"
                        onChange={e => {
                          setdetail({
                            ...detail,
                            email: e.target.value
                          });
                        }}
                        ref={register({
                          required: "กรุณากรอกอีเมล",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "กรุณากรอกอีเมลให้ถูกต้อง"
                          }
                        })}
                      />
                      <input
                        name="return_url"
                        value="/pages/resetPassword"
                        type="hidden"
                        ref={register}
                      />
                      <input
                        name="ref_code"
                        value={Math.random().toString(36).substring(7)}
                        type="hidden"
                        ref={register}
                      />
                    </div>
                    <span style={{ color: "red" }}>
                      {errors.email && errors.email.message}
                    </span>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <div className="float-right white">
                    <Button color="primary" type="submit">
                      ตั้งค่ารหัสผ่านใหม่
                    </Button>
                  </div>
                </FormGroup>
              </div>
            )}
            {isOpened && (
              <div
                className="teal"
                style={{ textAlign: "center", fontWeight: 400 }}
              >
                กรุณาตรวจสอบอีเมลของท่าน
              </div>
            )}
          </ModalBody>
          {/* <ModalFooter>
            <div className="float-left white">
              <Button color="secondary" onClick={toggle}>
                ยกเลิก
              </Button>
            </div>
            <div className="float-right white">
              <Button color="primary" type="submit">
                รีเซ็ตรหัสผ่าน
              </Button>
            </div>
          </ModalFooter> */}
        </form>
      </Modal>
    </div>
  );
}
