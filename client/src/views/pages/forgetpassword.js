import React, { useState } from "react";
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

export default function ForgetPassword() {
  const [modal, setModal] = useState(false);
  const [detail, setdetail] = React.useState({
    email: "",
    url: ""
  });
  const toggle = () => setModal(!modal);
  const handleSubmit = e => {
    e.preventDefault();
    alert(JSON.stringify(detail));
    // fetch(`https://hooks.zapier.com/hooks/catch/abc/123/`, {
    //   method: "POST",
    //   body: JSON.stringify({ email, comment })
    // });
  };
  return (
    <div className="text-center text-white">
      <a onClick={toggle}> ลืมรหัสผ่าน</a>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
          className="gradient-indigo-purple text-white"
        >
          ลืมรหัสผ่าน
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Col md="12">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon">
                      {/* <i className="fa fa-user prefix"></i> */}
                      <i className="fa fa-at prefix"></i>
                    </span>
                  </div>
                  <Input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="กรอกอีเมล์ของท่าน"
                    onChange={e => {
                      setdetail({
                        ...detail,
                        email: e.target.value
                      });
                    }}
                    required
                  />
                </div>
              </Col>
            </FormGroup>
          </form>
        </ModalBody>
        <ModalFooter>
          <div className="float-left white">
            <Button color="secondary" onClick={toggle}>
              ยกเลิก
            </Button>
          </div>
          <div className="float-right white">
            <Button color="primary" onClick={toggle}>
              รีเซ็ตรหัสผ่าน
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
