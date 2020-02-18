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
import AuthService from "../../services/AuthService";
import * as config from "../../services/AppConfig";
import * as Survey from "survey-react";
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
widgets.signaturepad(Survey);
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

const toastrConfirmOptions = {
  onOk: () =>
    $.ajax({
      method: "delete",
      crossDomain: true,
      url:
        config.BACKEND_URL +
        "/v1/users/roommates/" +
        localStorage.getItem("session_userid")
    }).done(res => {
      console.log(res);
    }),

  onCancel: () => console.log("CANCEL: clicked")
};

class Display extends Component {
  constructor(props) {
    super(props);
    //console.log('load');
    this.state = {
      session_userid: "",
      json: "",
      answers: "",
      myfriend: "none",
      question: "",
      allResponses: [],
      allTimeInfo: "",
      surveyid: "",
      name: ""
    };

    this.Auth = new AuthService();
    this.intervalID = setInterval(() => this.Auth.IsAvailable(), 10000);
  }
  // componentWillUnmount() {
  //   clearTimeout(this.intervalID);
  // }

  async componentDidMount() {
    console.log("props" + this.props);
    console.log("surveyid" + this.props.location.state.surveyid);
    this.setState({
      surveyid: this.props.location.state.surveyid,
      name: this.props.location.state.name
    });

    const options = {
      async: true,
      mode: "cors",
      crossDomain: true,
      cache: "no-cache",
      method: "GET",
      headers: {
        userid: localStorage.getItem("session_userid"),
        token: localStorage.getItem("token_local"),
        // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };

    try {
      console.log("surveyid" + this.props.location.state.surveyid);
      const response = await fetch(
        config.BACKEND_GSURVEY +
          "/api/v2/admin/surveys/" +
          this.props.location.state.surveyid,
        options
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      var question = JSON.stringify(json.data);

      console.log("jsonnaja" + question);

      this.setState({ question: question });
    } catch (error) {
      console.log(error);
    }
  }

  onComplete(result) {
    const cookies = new Cookies();
    cookies.remove("cookiesurvey");
    console.log("Complete! ================" + JSON.stringify(result));

    var data = {
      name: "seminar-01",
      employeeId: localStorage.getItem("session_userid"),
      version: "1",
      surveyresult: result.data
    };
    console.log("------------------");
    console.log(data);

    $.ajax({
      type: "POST",
      url: config.BACKEND_URL + "/v1/survey/answers",
      contentType: "application/json",
      data: JSON.stringify(data), //no further stringification
      headers: {
        userId: localStorage.getItem("session_userid"),
        token: localStorage.getItem("token_local"),
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      success: function(response) {
        console.log(response);

        document.location = "surveyresult";
      }
    });
  }

  render() {
    // if (this.props.location.state.surveyid) {
    //   return <Redirect to="/login" />;
    // }
    console.log("dd.." + this.state.surveyid);
    console.log("display.." + this.state.name);
    var divStyle = {
      background: "#eee",
      padding: "100px"
    };

    var storageName = "SurveyJS_LoadState";
    var timerId = 0;
    Survey.StylesManager.applyTheme("orange");

    if (this.state.answers) var t = this.state.answers.surveyresult;

    if (this.state.question) {
      var survey = new Survey.Model(this.state.question);

      // survey.onUpdateQuestionCssClasses.add(function(survey, options) {
      //   var classes = options.cssClasses;

      //   classes.root = "por_root";
      //   classes.item = "por_item";
      //   classes.label = "por_label";
      // });
      //loadState(survey);

      survey.clearInvisibleValues = "onHidden";
      survey.showQuestionNumbers = "off";
      survey.onAfterRenderQuestion.add(function(sender, options) {});

      return (
        <div style={divStyle}>
          <Fragment>
            <Row>
              <Col xs="12">
                <div className="App">
                  <Card>
                    <CardBody>
                      <CardTitle>แบบสำรวจงานสัมมนา</CardTitle>

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
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default Display;
