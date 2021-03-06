import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import * as SurveyJSCreator from "survey-creator";
import * as SurveyKo from "survey-knockout";
import "survey-creator/survey-creator.css";
import "../../assets/scss/views/pages/survey/admin.css";
import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";
//import AuthService from '../../services/AuthService';
import "icheck/skins/square/blue.css";
import { BACKEND_URL } from "../../services/AppConfig";
import * as widgets from "surveyjs-widgets";
import AuthService from '../../services/AuthService';
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

class SurveyCreator extends Component {
  surveyCreator;

  constructor(props) {
    super(props);


    this.state = {

      chktoken: false,
      redirectToReferrer: ''
    };

    this.Auth = new AuthService();
    this.intervalID = setInterval(() => this.Auth.IsAvailable(), 10000);
  }
  componentWillUnmount() {

    clearTimeout(this.intervalID);
  }
  componentDidMount() {
    let options = { showEmbededSurveyTab: true };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    );
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;


    //   $.ajax({
    //     method:'get',
    //     crossDomain: true,
    //     url: "https://seminar-backend.dga.or.th/v1/survey/questions/seminar-01",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "userid": localStorage.getItem("session_userid"),
    //       "token": localStorage.getItem("token_local")
    //     }
    // }).done((res) => {
    //     console.log(res);
    //     console.log("sccess==="+res.success);
    //     var question = JSON.stringify(res.data);
    //     this.surveyCreator.text= question;;
    //     this.setState({json:(res.data)});
    //     console.log("componentDidMount 2");

    // })


    fetch(BACKEND_URL + "/v1/survey/questions/seminar-01", {
      method: 'get',
      crossDomain: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "userid": localStorage.getItem("session_userid"),
        "token": localStorage.getItem("token_local")
        // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
      },

    })

      .then((response) => {
        console.log(response.status);
        if (response.status !== 200) {
          this.setState({ redirectToReferrer: false });
          console.log('chkredirect==>' + this.state.redirectToReferrer);

        }
        return response.json();
      })


      .then(res => {

        if (res.data) {
          this.setState({ redirectToReferrer: true });
          var question = JSON.stringify(res.data);
          this.surveyCreator.text = question;;
          this.setState({ json: (res.data) });
          console.log("componentDidMount 2");
        }
      })



  }

  render() {
    if (!this.Auth.loggedIn()) {
      return (<Redirect to={'login'} />)
    }
    return (

      <div className="admin">
        <div id="surveyCreatorContainer" />
      </div>





    );
  }


  saveMySurvey = () => {

    var data = this.surveyCreator.text

    // console.log(JSON.stringify(data));
    var data1 = "{\n\"name\":\"seminar-01\"," + data.substring(1);

    var jsondata = {
      name: 'seminar-01',
      createdated: new Date(),


    };
    var t = JSON.stringify(jsondata);
    t = t.substring(0, t.length - 1);

    var jsondata = t + "," + data.substring(1);
    console.log(jsondata);
    console.log(JSON.stringify(data1));

    $.ajax({
      method: 'post',
      crossDomain: true,
      contentType: "application/json",
      data: jsondata,

      url: BACKEND_URL + "/v1/survey/questions",
      headers: {
        "Content-Type": "application/json",
        "userid": localStorage.getItem("session_userid"),
        "token": localStorage.getItem("token_local")
      }
    }).done((res) => {
      console.log(res);
      if (res.success === true) {
        alert('success');
      } else {
        alert('fail');
      }

    })
  };
}

export default SurveyCreator;
