// import external modules
import React, { Component, Fragment } from "react";
import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import { Row, Col, Card, CardBody, CardTitle, Badge } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import ReactDOM from "react-dom";
//import Async from "react-async";
import axios from "axios";
//import AuthService from "../../services/AuthService";
import * as config from "../../services/AppConfig";
import * as Survey from "survey-react";
import queryString from "query-string";
import "survey-react/survey.css";

import "../../assets/scss/views/pages/survey/survey.css";
import "bootstrap/dist/css/bootstrap.css";

import "bootstrap/dist/js/bootstrap.js";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";
import { toastr } from "react-redux-toastr";
import * as widgets from "surveyjs-widgets";

import "icheck/skins/square/blue.css";
import Footer from "../../layouts/components/footer/footer.js";

import { throws } from "assert";
window["$"] = window["jQuery"] = $;
//require("../../../node_modules_/icheck");

Survey.StylesManager.applyTheme("default");

widgets.icheck(Survey, $);
widgets.select2(Survey, $);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey, $);
widgets.jqueryuidatepicker(Survey, $);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey, $);
//widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey, $);
widgets.bootstrapslider(Survey);
const toastrOptions = {
  timeOut: 3000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};

class Display extends Component {
  constructor(props) {
    super(props);
    //console.log('load');
    this.state = {
      isDesktop: false,
      json: "",
      rotate: "90",
      answers: "",
      myfriend: "none",
      question: "",
      allResponses: [],
      allTimeInfo: "",
      surveyid: "",
      name: "",
      uid: "",
      version: ""
    };
    this.updatePredicate = this.updatePredicate.bind(this);

    // this.Auth = new AuthService();
    // this.intervalID = setInterval(() => this.Auth.IsAvailable(), 10000);
  }
  // componentWillUnmount() {
  //   clearTimeout(this.intervalID);
  // }

  async componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);

    let url = this.props.location.search;
    let params = queryString.parse(url);

    // var uid = this.props.location.state.userid;
    console.log(params);
    //   console.log("uid" + uid);
    console.log(" params.surveyid" + params.surveyid);
    localStorage.setItem("uid", params.uid);
    localStorage.setItem("surveyid", params.surveyid);
    const options = {
      async: true,
      mode: "cors",
      crossDomain: true,
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    this.setState({
      surveyid: params.surveyid,
      uid: params.uid,
      version: "1"
    });
    try {
      const response = await fetch(
        config.BACKEND_GSURVEY +
          "/api/v2/users/surveys?sid=" +
          params.surveyid +
          "&v=1&uid=" +
          params.uid,
        options
      );
      if (!response.ok) {
        toastr.error("ไม่สารมารถเปิดแบบสำรวจได้", toastrOptions);
      }
      const json = await response.json();
      var question = JSON.stringify(json.data);
      console.log(json);
      this.setState({ question: question, name: json.data.name });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }
  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 479 });
  }

  onComplete(result) {
    const cookies = new Cookies();
    cookies.remove("cookiesurvey");
    console.log("Complete! ================" + JSON.stringify(result.data));

    var data = {
      surveyid: localStorage.getItem("surveyid"),
      userid: localStorage.getItem("uid"),
      version: "1",
      result: result.data
    };
    console.log("------------------");
    console.log(data);

    $.ajax({
      type: "POST",
      url: config.BACKEND_GSURVEY + "/api/v2/users/results",
      contentType: "application/json",
      data: JSON.stringify(data), //no further stringification
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      success: function (response) {
        console.log(response);
        toastr.success("บันทึกข้อมูลเรียบร้อยแล้ว", toastrOptions);
        localStorage.clear();
      }
    });
  }

  render() {
    const isDesktop = this.state.isDesktop;
    var divStyle = {
      background: "#eee",
      padding: "30px"
    };

    var storageName = "SurveyJS_LoadState";
    var timerId = 0;
    Survey.StylesManager.applyTheme("orange");
    Survey.surveyStrings.emptySurvey =
      "ยังไม่มีการสร้างชุดคำถามสำหรับแบบสำรวจนี้";
    if (this.state.answers) var t = this.state.answers.surveyresult;

    if (this.state.question) {
      var survey = new Survey.Model(this.state.question);
      Survey.surveyLocalization.locales[
        Survey.surveyLocalization.defaultLocale
      ].requiredError = "กรุณากรอกข้อมูลให้ครบถ้วน";
      survey.locale = "th";
      survey.completedHtml = "ขอบคุณสำหรับคำตอบของท่าน";
      survey.completeText = "ส่งคำตอบ";
      survey.pagePrevText = "หน้าก่อนหน้า";
      survey.pageNextText = "หน้าถัดไป";
      survey.clearInvisibleValues = "onHidden";
      survey.showQuestionNumbers = "off";

      survey.onAfterRenderQuestion.add(function (sender, options) {});

      return (
        <div style={divStyle}>
          <div>
            {isDesktop ? (
              <div></div>
            ) : (
              <div style={{ textAlign: "center", color: "#e64a19" }}>
                โปรดหมุนโทรศัพท์ของท่านเพื่อแสดงผลในแนวนอน
              </div>
            )}
          </div>

          <Fragment>
            <Row>
              <Col xs="12">
                <div className="App">
                  <Card>
                    <CardBody>
                      <CardTitle> แบบสำรวจ {this.state.name} </CardTitle>
                      <Survey.Survey
                        model={survey}
                        onComplete={this.onComplete}
                        //onValueChanged={this.onValueChanged}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Fragment>
          <Footer />
        </div>
      );
    }
    return <div> Loading... </div>;
  }
}

export default Display;
