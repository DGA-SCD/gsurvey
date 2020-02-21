import React from "react";
import { ShoppingCart } from "react-feather";
import dgalogo from "../../../assets/img/DGALogo.png";
import "../../../assets/scss/views/pages/survey/survey.css";
import templateConfig from "../../../templateConfig";
import { Camera, PhoneCall } from "react-feather";

const Footer = props => (
  <div class="row">
    <div class="col-md-12">
      <footer>
        <div class="row">
          <div class="col-md-1 col-xs-2">
            <p>
              <img
                src={dgalogo}
                style={{
                  height: "54px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              />
            </p>
          </div>
          <div class="col-md-6 col-xs-7" style={{ paddingLeft: "2.0rem" }}>
            <p>สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) (สพร.)</p>
            <p>
              Digital Government Development Agency (Public Organization) (DGA)
            </p>
          </div>
          <div class="col-md-5  col-xs-3" style={{ textAlign: "right" }}>
            <p>
              <b>DGA CONTACT CENTER</b>
            </p>
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
