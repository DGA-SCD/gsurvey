import React from "react";
import dgalogo from "../../../assets/img/DGALogo.png";
import "../../../assets/scss/views/pages/survey/survey.css";

import { PhoneCall } from "react-feather";

const Footer = props => (
  <div className="row">
    <div className="col-md-12">
      <footer>
        <div className="row">
          <div className="col-md-1.5 col-xs-2" style={{ paddingLeft: "15px" }}>
            <p>
              <img
                src={dgalogo}
                alt="dga"
                style={{
                  height: "54px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              />
            </p>
          </div>
          <div className="col-md-8 col-xs-8">
            <p>สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) (สพร.)</p>
            <p>
              Digital Government Development Agency (Public Organization) (DGA)
            </p>
          </div>
          <div
            className="col-md-2.5  col-xs-2"
            style={{
              paddingTop: "10px",
              paddingLeft: "15px",
              textAlign: "right"
            }}
          >
            DGA CONTACT CENTER
            <p>
              <PhoneCall size={16} color={"red"} />
              &nbsp;&nbsp; โทรศัพท์ : 026126060
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
);

export default Footer;
