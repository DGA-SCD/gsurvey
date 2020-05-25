import React, { Fragment } from "react";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import Cookies from "universal-cookie";
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
import Footer from "../../layouts/components/footer/footer.js";
import useWindowSize from "./useWindowSize";
import { throws } from "assert";
window["$"] = window["jQuery"] = $;

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

export default function DisplaySurvey({ surveyid, userid, question, name }) {
  const windowSize = useWindowSize();

  const toastrOptions = {
    timeOut: 3000, // by setting to 0 it will prevent the auto close
    position: "top-right",
    showCloseButton: true, // false by default
    closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    progressBar: false
  };
  const storageName = "SurveyJS_LoadState";
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

  const onComplete = result => {
    const cookies = new Cookies();
    cookies.remove("cookiesurvey");
    console.log("Complete! ================" + JSON.stringify(result.data));

    var data = {
      surveyid: surveyid,
      userid: userid,
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
  };
  const divStyle = {
    background: "#eee",
    padding: "30px"
  };

  Survey.StylesManager.applyTheme("orange");
  Survey.surveyStrings.emptySurvey =
    "ยังไม่มีการสร้างชุดคำถามสำหรับแบบสำรวจนี้";
  const survey = new Survey.Model(question);
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
  return (
    <div style={divStyle}>
      {question ? (
        <Fragment>
          {windowSize > 500 ? (
            <div></div>
          ) : (
            <div style={{ textAlign: "center", color: "#e64a19" }}>
              โปรดหมุนโทรศัพท์ของท่านเพื่อแสดงผลในแนวนอน
            </div>
          )}
          <Row>
            <Col xs="12">
              <div className="App">
                <Card>
                  <CardBody>
                    <CardTitle> แบบสำรวจ {name}</CardTitle>
                    <Survey.Survey
                      model={survey}
                      onComplete={onComplete}
                      //onValueChanged={this.onValueChanged}
                    />
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Fragment>
      ) : (
        <div>Loading...</div>
      )}
      <Footer />
    </div>
  );
}
