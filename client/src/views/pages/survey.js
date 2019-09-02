// import external modules
import React, { Component, Fragment } from "react";
import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import { Row, Col, Card, CardBody, CardTitle, Badge } from "reactstrap";
import { Link,Redirect } from "react-router-dom";
import Cookies from 'universal-cookie';
import ReactDOM from 'react-dom';
import AuthService from '../../services/AuthService';

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
import {toastr} from 'react-redux-toastr';
import * as widgets from "surveyjs-widgets";

import "icheck/skins/square/blue.css";
window["$"] = window["jQuery"] = $;
require("icheck");

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
  position: 'top-right',
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false,
}

const toastrConfirmOptions = {
  onOk: () => 
      $.ajax({
        method:'delete',
        crossDomain: true,
        url: "http://164.115.17.101:8082/v1/users/roommates/"+localStorage.getItem("session_userid"),
        }).done((res) => {
            console.log(res);
      
        
        

    }),
  
  
  onCancel: () => console.log('CANCEL: clicked')
};

function PhoneValidator(params) {
  var value = params[0];

  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
 
  if(value.match(phoneno)) {
    return true;
  }else{
    return false;
  }

}
function CheckIDCard(idNumber){
  console.log(idNumber);
  var i,sum;
  var idNumber = idNumber[0];
  idNumber= idNumber.toString();
  // console.log(idNumber.charAt(1));
  if(String(idNumber).length !== 13) return false;
  for(i=0, sum=0; i < 12; i++)
  sum += parseFloat(idNumber.charAt(i))*(13-i);
  
   if((11-sum%11)%10!=parseFloat(idNumber.charAt(12)))
 
 return false; return true;
}

function shirtprice(params) {
  if (params.length < 2) 
  return;

  switch(params[0]) { 
    case "female-xxs": { 
      value = 300;
       break; 
    } 
    case "female-xs": { 
      value = 330;
       break; 
    } 
    case "female-s": { 
      value = 330;
       break; 
    } 
    case "female-m": { 
      value = 330;
       break; 
    } 
    case "female-l": { 
      value = 330;
       break; 
    } 
    case "female-xl": { 
      value = 300;
       break; 
    } 
    case "female-xxl": { 
      value = 300;
       break; 
    } 
    case "male-xs": { 
      value = 300;
       break; 
    } 
    case "male-s": { 
      value = 300;
       break; 
    } 
    case "male-m": { 
      value = 300;
       break; 
    } 
    case "male-l": { 
      value = 330;
       break; 
    } 
    case "male-xl": { 
      value = 400;
       break; 
    } 
    case "male-xxl": { 
      value = 400;
       break; 
    } 
    case "male-3xl": { 
      value = 450;
       break; 
    } 
    case "male-4xl": { 
      value = 450;
       break; 
    } 
    default: { 
      value = 0;
       break; 
    } 
 } 
 var value = parseInt(value);
 var value1 = parseInt(params[1]);
 return value1*value;
 
}

Survey
    .FunctionFactory
    .Instance
    .register("shirtprice", shirtprice);
// Register the function for use in SurveyJS expressions
Survey
  .FunctionFactory
  .Instance
  .register("PhoneValidator", PhoneValidator);

  Survey
  .FunctionFactory
  .Instance
  .register("CheckIDCard",CheckIDCard);

class survey extends Component {
  constructor(props) {
    super(props);
    //console.log('load');
    this.state = {
      session_userid:"",
      json: "",
       answers:"",
       myfriend:"none",
       question:"",
       allResponses: [],
       allTimeInfo: ""
      
    };
    this.Auth = new AuthService();


    }

      
    componentDidMount(){
      var data1 = { 
       userid :  localStorage.getItem("session_userid"), 
       token :  localStorage.getItem("token_local")
       
      }; 
      const options = {
        async: true,
        mode: 'cors',
        crossDomain: true,
        cache: 'no-cache',
        method: 'GET',
        headers: {
            "userid": localStorage.getItem("session_userid"),
           "token": localStorage.getItem("token_local"),
          // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           
        }
      };
    var url1 = "http://164.115.17.101:8082/v1/survey/questions/seminar-01";
    var url2 = "http://164.115.17.101:8082/v1/users/roommates/" + localStorage.getItem("session_userid");
    var url3 = "http://164.115.17.101:8082/v1/survey/answers/" + localStorage.getItem("session_userid") + "/seminar-01/1";







      var apiRequest1 = fetch(url1,options).then((response) => {
            console.log(response.status); 
                if (response.status !== 200) {
                this.setState({redirectToReferrer:false});
                console.log('chkredirect==>'+this.state.redirectToReferrer);
                localStorage.clear();
             
                this.props.history.push('/pages/login');
              }
                  return response.json();
            })
    
      var apiRequest2 = fetch(url2,options).then(function(response){
        if (response.status !== 200) {
          this.setState({redirectToReferrer:false});
          console.log('chkredirect==>'+this.state.redirectToReferrer);
          localStorage.clear();
       
          this.props.history.push('/pages/login');
        }
            return response.json();
      });
      var apiRequest3 = fetch(url3,options).then(function(response){
        if (response.status !== 200) {
          this.setState({redirectToReferrer:false});
          console.log('chkredirect==>'+this.state.redirectToReferrer);
          localStorage.clear();
       
          this.props.history.push('/pages/login');
        }
            return response.json();
     });
      //var combinedData = {"apiRequest1":{},"apiRequest2":{},"apiRequest3":{}};
      Promise.all([apiRequest1,apiRequest2,apiRequest3])
            .then(allResponses => {
              const response1 = allResponses[0]
              const response2 = allResponses[1]
              const response3 = allResponses[2]
          //.then(this._checkResponse(response1))
              console.log("response1.data");
              console.log(response1.data);
              console.log(response2);
              console.log(response3.data);
              
              

              this.setState({
                question:response1.data,
              
                myfriend : response2.data.frientLists[0],
                answers:response3.data
              })
            })
            .catch((err) => {
              console.log(err);
            });


    }
   
    
      onComplete(result) {
        const cookies = new Cookies();
        cookies.remove('cookiesurvey');
        console.log("Complete! " + JSON.stringify(result));
        
        var data = { name: 'seminar-01', 
                    employeeId :  localStorage.getItem("session_userid"), 
                      version : "1",
                      surveyresult: result.data
                    }; 
      

          $.ajax({
          type: "POST",
           url: "http://164.115.17.101:8082/v1/survey/answers",
           contentType: "application/json",
            data: JSON.stringify(data),  //no further stringification
            headers:{
              'userId':localStorage.getItem("session_userid"), 
              'token':localStorage.getItem("token_local"),
              'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            success: function(response){
          
              console.log(response);
             
            
             document.location = "surveyresult";
            }
          });
      }
      
       
   render() {
    if (!this.Auth.loggedIn()) {
      return (<Redirect to={'login'}/>)
   }
    var storageName = "SurveyJS_LoadState";
    var timerId = 0;
    Survey
    .StylesManager
    .applyTheme("orange");

    var t = this.state.answers;
    
    if(this.state.answers) 
    var t = this.state.answers.surveyresult;
    

    console.log("answer------>"+JSON.stringify(this.state.answers));
    console.log("myfriend------>"+JSON.stringify(this.state.myfriend));
    console.log("t------>"+JSON.stringify(t));
    console.log('this.state.myfriend.displayName--->'+this.state.myfriend);

    if (this.state.question) {
     $.ajax({
            method:'get',
              crossDomain: true,
              url: "http://164.115.17.101:8082/v1/users/roommates",
              headers: {
                "Content-Type": "application/json",
                "userid":  localStorage.getItem("session_userid"),
                "token": localStorage.getItem("token_local")
              }
            }).done((res) => {
         
              console.log(res);
    
              var q = survey.getQuestionByName('partner');
              var choices = [];
              res.data.frientLists.forEach(e => {
                // choices.push()
               // console.log("Display name:  " + e.displayName);
                choices.push(e.displayName);
              });
    
              q.choices = choices;
          
            
            });



      var survey = new Survey.Model(this.state.question);
      var oldfriend = (this.state.myfriend === undefined || this.state.myfriend === 'none') ? '':this.state.myfriend.displayName;
      if( t ){
        survey.data = t;
        
        if(this.state.myfriend && this.state.myfriend.length > 0){
            survey.setValue("partner", this.state.myfriend.displayName);
            survey.myfriend = this.state.myfriend.displayName;
            console.log("==== Set Answer =====" +survey.myfriend );
        }
            
       
     
      }


      survey.onUpdateQuestionCssClasses.add(function(survey, options) {
    
        var classes = options.cssClasses;
        
        classes.root = "por_root";
        classes.item = "por_item";
        classes.label = "por_label";
      
    
      });
      //loadState(survey);
 
      survey.clearInvisibleValues = "onHidden"; 
      survey.showQuestionNumbers = 'off';
      survey.onAfterRenderQuestion.add(function (sender, options) {
       
        if (options.question.name === "follwer_budget_room") {
           
               options.question.value = parseInt(1000);
        }
            if (options.question.name === "follwer_budget_room") {
           
            options.question.value = parseInt(1000);
          }
          if (options.question.name === "follwer_budget_jointoeat") {
           
            options.question.value = parseInt(500);
          }
          if (options.question.name === "follwer_budget_insurance") {
           
            options.question.value = parseInt(300);
          }
       
          let dataList = JSON.parse(localStorage.getItem("userData"));
        
          survey.setValue("level", dataList.level);

        
          $.ajax({
            method:'get',
              crossDomain: true,
              url: "http://164.115.17.101:8082/v1/users/roommates/"+localStorage.getItem("session_userid"),
              headers: {
                "Content-Type": "application/json",
                "userid": localStorage.getItem("session_userid"),
                "token": localStorage.getItem("token_local")
              }
            }).done((res) => {
              if(res.data.frientLists[0] != undefined){
              
                survey.setValue("partner", res.data.frientLists[0].displayName);
              }
            });
           
    });

    
   // console.log("sender------>"+ sender);
    survey.onValueChanged.add(function(sender, options) {
      var opt = {
        async: true,
        mode: 'cors',
        crossDomain: true,
        cache: 'no-cache',
        method: 'GET',
        headers: {
            "userid": localStorage.getItem("session_userid"),
           "token": localStorage.getItem("token_local"),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           
        }
      };
      console.log("เพื่อนนอนใหม่"+options.value);
      console.log("เพื่อนนอนเก่า"+oldfriend);
      console.log("เพื่อนนอนเก่า"+sender.myfriend);
      console.log("ะt"+t);
      if(sender.myfriend !== "none" && options.name === "partner" && options.value !== oldfriend && (options.value) && t !== null){
   //   if(sender.myfriend !== "none" && options.name === "partner" && options.value !== sender.myfriend && (options.value) && t !== null){
        console.log("Option: " + options.value + " value: "+ sender.myfriend);
        fetch("http://164.115.17.101:8082/v1/users/roommates/"+localStorage.getItem("session_userid"),opt)
        .then(res => res.json())
        .then((result)=>{
          if( result.success === true && result.data.frientLists){
           
            const [name, uid, section] = options.value.split('/');
            console.log(uid);
            toastr.confirm('มีคู่นอนอยู่แล้วนะจ๊ะ จะเปลี่ยนคู่นอนเป็น.'+ name + 'หรอจ๊ะ', 
            {onOk: () => { 
              $.ajax({
                method:'delete',
                crossDomain: true,
                url: "http://164.115.17.101:8082/v1/users/roommates/"+localStorage.getItem("session_userid"),
                headers: {
                  "Content-Type": "application/json",
                  "userid": localStorage.getItem("session_userid"),
                  "token": localStorage.getItem("token_local")
                }
                }).done((res) => {
                    console.log(res);
                    let opts = {
                        friendId :uid.trim()
                      };
                    fetch('http://164.115.17.101:8082/v1/users/roommates/'+localStorage.getItem("session_userid"), {
                      method: 'post',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "userid": localStorage.getItem("session_userid"),
                        "token": localStorage.getItem("token_local")
                      },
                      body: JSON.stringify(opts)
                    }).then(function(response) {
                      return response.json();
                    }).then(function(data) {
                      if(data.success){
                        toastr.success('เปลี่ยนให้แล้วจ้า',toastrOptions);
                      }
                    });
                    

                    
                    
                })
            }, 
            onCancel: () => { 
              console.log('cancel')
            }})
         
           
          }
        },(err)=>{});
        
      }
        if(t === null &&  options.name === "partner" && options.value !== oldfriend && oldfriend !== ''){
          fetch("http://164.115.17.101:8082/v1/users/roommates/"+localStorage.getItem("session_userid"),opt)
          .then(res => res.json())
          .then((result)=>{
            if( result.success = true && result.data.frientLists){
            
              const [name, uid, section] = options.value.split('/');
              console.log(uid);
              toastr.confirm('มีคู่นอนอยู่แล้วนะจ๊ะ จะเปลี่ยนคู่นอนเป็น '+ name + 'หรอจ๊ะ', 
              {onOk: () => { 
                $.ajax({
                  method:'delete',
                  crossDomain: true,
                  url: "http://164.115.17.101:8082/v1/users/roommates/"+localStorage.getItem("session_userid"),
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "userid": localStorage.getItem("session_userid"),
                    "token": localStorage.getItem("token_local")
                  }
                  }).done((res) => {
                      console.log(res);
                      let opts = {
                          friendId :uid.trim()
                        };
                      fetch('http://164.115.17.101:8082/v1/users/roommates/'+localStorage.getItem("session_userid"), {
                        method: 'post',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          "userid": localStorage.getItem("session_userid"),
                          "token": localStorage.getItem("token_local")
                        },
                        body: JSON.stringify(opts)
                      }).then(function(response) {
                        return response.json();
                      }).then(function(data) {
                        if(data.success){
                          toastr.success('เปลี่ยนให้แล้วจ้า',toastrOptions);
                        }
                      });
                      

                      
                      
                  })
              }, 
              onCancel: () => { 
                console.log('cancel')
              }})
          
            
            }
          },(err)=>{});
          
        }

        if(sender.myfriend === 'undefined'  && (t)){ // ตอบมาแล้วแต่ยังไม่เลือกคู่นอน
          const [name, uid, section] = options.value.split('/');
          
          let opts = {
            friendId :uid.trim()
          };
          fetch('http://164.115.17.101:8082/v1/users/roommates/'+localStorage.getItem("session_userid"), {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "userid": localStorage.getItem("session_userid"),
              "token": localStorage.getItem("token_local")
            },
            body: JSON.stringify(opts)
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            if(data.success){
              toastr.success('เพิ่มคู่นอนให้แล้วจ้า',toastrOptions);
            }
          });
          
        }
      });       
 
        return (
          <Fragment>
        <Row>
        <Col xs="12">
              <div className = "App">
                  
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
        );
      }
      return <div>Loading...</div>;
   }
}

export default survey;
