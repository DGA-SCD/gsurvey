import React, { useState } from "react";
import * as config from "../../services/AppConfig";
import DisplaySurvey from "./DisplaySurvey";
import { useForm } from "react-hook-form";
import { toastr } from "react-redux-toastr";
import {
  Button,
  Modal,
  ModalHeader,
  Col,
  FormGroup,
  UncontrolledTooltip
} from "reactstrap";
const toastrOptions = {
  timeOut: 3000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};

export default function SurveyAuthen({ userid, surveyid, question, name }) {
  const [isOpened, setIsOpened] = useState(false);
  const {
    register,
    errors,

    handleSubmit
  } = useForm();

  const [modal, setModal] = useState(true);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const toggle = () => setModal(!modal);
  const [chkauthen, setchkauthen] = useState(false);
  const onSubmit = data => {
    //alert(data);
    // const param = true;
    // AuthenPass(param);
    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/users/survey/auth", {
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
            setTimeout(function () {
              setIsOpened(false);

              setModal(false);
            }, 2000);
            //  const param = result.success;
            setchkauthen(true);
          } else {
            if (result.code === 40100) {
              toastr.error("ขออภัยท่านใส่รหัสผ่านผิด", toastrOptions);
            } else {
              toastr.error(result.desc, toastrOptions);
            }
          }
        });
    } catch (error) {
      toastr.error(error, toastrOptions);
    }
  };

  return chkauthen === false ? (
    <div className="text-center">
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
          className="gradient-indigo-purple text-white"
        >
          ระบุรหัสผ่านสำหรับแบบสอบถาม
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
                      <p
                        style={{
                          fontSize: "12px",
                          textAlign: "center"
                        }}
                      >
                        กรณีท่านไม่ทราบรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบของท่าน
                      </p>
                    </UncontrolledTooltip>
                    <input
                      name="password"
                      className="form-control"
                      placeholder="ระบุรหัสผ่านของแบบสอบถาม"
                      type="password"
                      id="passwordptooltip"
                      //  ref={register({ required: "กรุณากรอกรหัสผ่าน" })}
                      onChange={async e => {
                        const value = e.target.value;

                        await sleep(1000);
                      }}
                      // ref={register({ required: true })}
                      ref={register({
                        required: "กรุณากรอกรหัสผ่านของแบบสอบถาม"
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p style={{ color: "#F08080" }}>
                      {errors.password.message}
                    </p>
                  )}
                </Col>
              </FormGroup>
              <input
                name="surveyid"
                value={surveyid}
                type="hidden"
                ref={register}
              />
              <input
                name="userid"
                value={userid}
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
  ) : (
    <DisplaySurvey
      surveyid={surveyid}
      userid={userid}
      question={question}
      name={name}
    />
  );
}
