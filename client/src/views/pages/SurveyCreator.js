import React, { Component } from "react";
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

import "icheck/skins/square/blue.css";

import * as widgets from "surveyjs-widgets";

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


  componentDidMount() {
    let options = { showEmbededSurveyTab: true };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    );
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;


    $.ajax({
      method:'get',
      crossDomain: true,
      url: "http://164.115.17.163:8082/v1/survey/questions/seminar-01"
  }).done((res) => {
      console.log(res);
      console.log("sccess==="+res.success);
      var question = JSON.stringify(res.data);
      this.surveyCreator.text= question;;
      this.setState({json:(res.data)});
      console.log("componentDidMount 2");

  })

   
  }

  

  render() {
    
    return (
      
              <div class = "admin">
               <div id="surveyCreatorContainer" />
              </div>
             
              
    
      
    
    );
  }


  saveMySurvey = () => {

    var data = this.surveyCreator.text
   // console.log(JSON.stringify(data));
    var data1 = "{\n\"name\":\"seminar-01\","+data.substring(1);
    //console.log(data1);
    console.log(JSON.stringify(data1));

    $.ajax({
      method:'post',
      crossDomain: true,
      contentType: "application/json",
      data: data1, 
    
      url: "http://164.115.17.163:8082/v1/survey/questions"
  }).done((res) => {
      console.log(res);
      if(res.success===true){
        alert('success');
      }else{
        alert('fail');
      }
     
  })
  };
}

export default SurveyCreator;
