import React, { Component } from "react";
import * as config from "../../services/AppConfig";
import { userService } from "../../services/UserAuth";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Button, FormGroup, Table, Input } from "reactstrap";
import * as SurveyJSCreator from "survey-creator";
import * as SurveyKo from "survey-knockout";
import "survey-creator/survey-creator.css";
import "../../assets/scss/views/pages/survey/admin.css";
import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import { toastr } from "react-redux-toastr";
import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";
//import AuthService from '../../services/AuthService';
import "icheck/skins/square/blue.css";

import * as widgets from "surveyjs-widgets";
import AuthService from "../../services/AuthService";
import queryString from "query-string";
import userImagedga from "../../assets/img/ico/icons8-edit-24.png";
SurveyJSCreator.StylesManager.applyTheme("default");

widgets.icheck(SurveyKo, $);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
widgets.bootstrapslider(SurveyKo);
const toastrOptions = {
  timeOut: 2000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  // showCloseButton: true, // false by default
  // closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: true
};
class Formcreate extends Component {
  surveyCreator;

  constructor(props) {
    super(props);

    this.state = {
      chktoken: false,
      redirectToReferrer: "",
      surveyid: null,
      disabled: true,
      showStore: false,
      clickedit: true,
      name: "",
      rename: "",
      vesion: ""
    };
  }
  handleClick = event => {
    console.log("State ==>", this.state.rename + "..." + this.state.surveyid);

    var renamedata = {
      surveyid: this.state.surveyid,
      userid: "1",
      version: "1",
      name: this.state.rename === "" ? this.state.name : this.state.rename
    };
    console.log(renamedata);
    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/surveys/rename", {
        method: "post",

        crossDomain: true,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(renamedata)
      })
        .then(function(response) {
          if (!response.ok) {
            toastr.error("ไม่สามารถแก้ไขข้อมูลได้", toastrOptions);
            alert("fail");
          } else {
            toastr.success("แก้ไขข้อมูลเรียบร้อยแล้ว", toastrOptions);
          }
        })
        .then(responseJson => {
          this.startEdit();
        });
    } catch (ex) {
      console.log(ex);
    }
  };
  handleNameChange = event => {
    this.setState({ rename: event.target.value });

    console.log(this.state.rename);
  };

  increment() {
    console.log("increment");
    this.setState({
      version: (parseInt(this.state.version) + parseInt(1)).toString()
    });
  }
  startEdit() {
    this.setState({
      showStore: !this.state.showStore,
      disabled: !this.state.disabled,
      clickedit: !this.state.clickedit
    });
  }

  async componentDidMount() {
    console.log("didmount   " + JSON.stringify(this.props));
    if (this.props.location.state) {
      this.setState({
        surveyid: this.props.location.state.surveyid,
        name: this.props.location.state.name,
        version: this.props.location.state.version
      });
    } else {
      userService.clearStrogae();
    }

    let options = { showEmbededSurveyTab: true };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    );
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;

    try {
      console.log("surveyid" + this.props.location.state.surveyid);
      console.log("userid" + this.props.location.state.userid);
      console.log("version" + this.props.location.state.version);
      console.log("name" + this.props.location.state.name);
      const response = await fetch(
        config.BACKEND_GSURVEY +
          "/api/v2/admin/surveys/" +
          this.props.location.state.surveyid +
          "?uid=" +
          this.props.location.state.userid +
          "&v=1",
        {
          method: "get",
          crossDomain: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );
      console.log(response);
      if (!response.ok) {
        userService.clearStrogae();
        // throw Error(response.statusText);
      }
      const json = await response.json();
      var question = JSON.stringify(json.data);
      console.log(question);

      this.surveyCreator.text = question;
      this.setState({ json: question });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="admin">
        <Row>
          <Col md="6">
            <FormGroup>
              <Row className="row">
                <Col md="12">
                  <Table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td>
                          <Link to="main" className="btn btn-info">
                            กลับหน้าหลัก
                          </Link>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            onChange={this.handleNameChange}
                            defaultValue={this.state.name}
                            disabled={this.state.disabled ? "disabled" : ""}
                            required
                            //style={{ width: "300px" }}
                          />
                        </td>
                        <td className="text-left">
                          <img
                            src={userImagedga}
                            onClick={this.startEdit.bind(this)}
                            style={{
                              display: this.state.clickedit ? "block" : "none"
                            }}
                          />
                        </td>
                        <div
                          style={{
                            display: this.state.showStore ? "block" : "none"
                          }}
                        >
                          <td className="text-left">
                            <Button color="success" onClick={this.handleClick}>
                              แก้ไข
                            </Button>
                          </td>
                          <td className="text-left">
                            <Button
                              color="warning"
                              onClick={this.startEdit.bind(this)}
                            >
                              ยกเลิก
                            </Button>
                          </td>
                        </div>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </FormGroup>
          </Col>
        </Row>

        <div id="surveyCreatorContainer" />
      </div>
    );
  }

  saveMySurvey = () => {
    var user = JSON.parse(localStorage.getItem("userData"));
    var data = this.surveyCreator.text;

    var jsondata = {
      surveyid: this.state.surveyid,
      name: this.state.name,
      version: "1",
      userid: "" + user.userid
    };
    var t = JSON.stringify(jsondata);
    t = t.substring(0, t.length - 1);

    var senddata = t + "," + data.substring(1);
    console.log(senddata);
    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/surveys", {
        method: "post",
        crossDomain: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: senddata
      }).then(function(response) {
        console.log("res" + JSON.stringify(response));
        if (!response.ok) {
          toastr.error("ไม่สามารถเพิ่มข้อมูลได้", toastrOptions);
          userService.clearStrogae();
        } else {
          toastr.success("เพิ่มข้อมูลเรียบร้อยแล้ว", toastrOptions);
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  };
}

export default Formcreate;
