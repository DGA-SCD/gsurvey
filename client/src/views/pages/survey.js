// import external modules
import React, { Component, Fragment } from "react";
import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import { Row, Col, Card, CardBody, CardTitle, Badge } from "reactstrap";
import Cookies from 'universal-cookie';
import ReactDOM from 'react-dom';

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
Survey.JsonObject.metaData.addProperty("question", "popupdescription:text");

   function showDescription(element) {
       document.getElementById("questionDescriptionText").innerHTML = element.popupdescription;
       $("#questionDescriptionPopup").modal();
   }
   

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

function getPreviousName(currentName) {
  var value = currentName[0];
  console.log(value);
  }
function MyTextValidator(paramsd) {
    var value = paramsd[0];
    console.log(value);
    return value.indexOf("survey");
}

Survey
    .FunctionFactory
    .Instance
    .register("MyTextValidator", MyTextValidator);
Survey
  .FunctionFactory
  .Instance
  .register("getPreviousName", getPreviousName);



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
    json = {
    
        "completedHtml": "mmmm",
        showProgressBar: "top",
        "cookieName": "cookiesurvey",
       
        "pagePrevText": "ย้อนกลับ",
        "pageNextText": "ถัดไป",
        pages: [
          {
            questions: [
              
           
              {
                "type": "radiogroup",
                "name": "readytogo",
                "title": "ไปงานสัมมนากันมั้ยจ๊ะ",
                "isRequired": true,
                "colCount": 0,
                "choices": ["Yes|ไป", "No|ไม่ไป"],
               
              },
            
    
              {
                type: "radiogroup",
                name: "howtogo",
                "isRequired": false,
                title: "ไปกันยังไง",
                visibleIf: "{readytogo}='Yes'",
                "choices": ["1|รถบัส", "2|ขับรถไปเอง"]
              },
              {
                "name": "datetogo",
                "type": "dropdown",
                visibleIf: "{readytogo}='Yes'",
                "title": "ไปวันไหน",
               
                "isRequired": false,
                choices: [
                  {
                      value: '0111019',
                      text: "01 พฤศจิกายน 2019"
                  }, {
                    value: '0211019',
                    text: "02 พฤศจิกายน 2019"
                  }, {
                    value: '0311019',
                    text: "03 พฤศจิกายน 2019"
                  }
              ]
    
             
            },
            {
              "name": "datetoback",
              "type": "dropdown",
             
              "title": "กลับวันไหน",
              visibleIf: "{readytogo}='Yes'",
              "isRequired": false,
              "startWithNewLine": false,
              choices: [
                {
                  value: '0111019',
                  text: "01 พฤศจิกายน 2019"
              }, {
                value: '0211019',
                text: "02 พฤศจิกายน 2019"
              }, {
                value: '0311019',
                text: "03 พฤศจิกายน 2019"
              }
            ]
          },
              {
                type: "dropdown",
                name:"roommate",
                visibleIf: "{readytogo}='Yes'",
                renderAs: "select2",
                choicesByUrl: {
                  url: "https://restcountries.eu/rest/v1/all"
                },
                name: "partner",
                title: "อยากนอนกับใครเอ่ย"
              },
              {
                type: "radiogroup",
                visibleIf: "{readytogo}='Yes'",
                name: "food",
                "isRequired": false,
                title: "ทานอะไรกันได้มั่ง",
                // visibleIf: "{readytogo}='Yes'",
                "choices": ["1|ได้ทุกอย่าง", "2|ฮาลาล","3|มังสวิรัติ"]
              },
             
              {
                "type": "panel",
                "name": "panel_food",
                visibleIf: "{readytogo}='Yes'",
                "elements": [
                    {
                        "type": "radiogroup",
                        "name": "foodallergy",
                        "isRequired": false,
                         "title": "แพ้อาหารอะไรบ้างรึเปล่า",
                      
                        "colCount": 0,
                        "choices": ["1|ไม่แพ้อะไรเลยชนะทุกอย่าง", "2|แพ้เป็นบางอย่าง"]
                    }, {
                        "type": "text",
                        "name": "foodallergy_detail",
                        "title": "แพ้อะไรบ้าง บอกเราหน่อย",
                        visibleIf: "{foodallergy}='2'",
                        "startWithNewLine": false,
                       
                    }
                ]
            } ,{
              type: "text",
              visibleIf: "{readytogo}='Yes'",
              name: "follower_disease",
              title: "มีโรคประจำตัวอะไรมั้ยจ๊ะ",
             
            },
            {
              type: "text",
              visibleIf: "{readytogo}='Yes'",
              name: "employee_contact",
              "isRequired": false,
              title: "เบอร์โทรติดต่อฉุกเฉิน",
              "validators": [
                {
                  type:"regex",
                  regex:"^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$",
                 text: "อย่าลืมใส่เบอร์ให้ถูกด้วยน๊าาา"
                }
            ]
            },
            
    
            {
              name: "insurance_benefit",
              visibleIf: "{readytogo}='Yes'",
              "title": "ใครเป็นผู้รับผลประโยชน์กรมธรรม์",
              "type": "text",
             
              "isRequired": false,
              "startWithNewLine": true
              
           },
            {
              "type": "dropdown",
              visibleIf: "{readytogo}='Yes'",
              "name": "insurance_benefit_relation",
              "isRequired": false,
               "title": "มีความสัมพันธ์เป็น",
               "isRequired": true,
               "startWithNewLine": false,
               "choices": ["พ่อ|พ่อ", "แม่|แม่", "พี่สาว/น้องสาว|พี่สาว/น้องสาว","พี่ชาย/น้องชาย|พี่ชาย/น้องชาย","ลูกชาย/ลูกสาว|ลูกชาย/ลูกสาว","คู่สมรส|คู่สมรส","เพื่อน|เพื่อน","ปู่/ตา/ลุง|ปู่/ตา/ลุง","ย่า/ยาย/ป้า|ย่า/ยาย/ป้า","น้า/อา|น้า/อา"]
          },
            
            ]
          },
          {
            questions: [
              {
                type: "radiogroup",
                name: "follower",
                "isRequired": false,
                title: "มีคนติดตามไปด้วยมั้ย",
                visibleIf: "{readytogo}='Yes'",
                "choices": ["Yes|มีจ้า", "No|ไม่มีจ้า"]
              },
              {
                type: "paneldynamic",
               name: "detailfollower", 
               title: "รายละเอียดผู้ติดตาม", 
           
              showQuestionNumbers: "none", 
              visibleIf: "{follower}='Yes'",
              templateTitle: "ผู้ติดตามคนที่ #{panelIndex}", 
              templateElements: [
                  { 
                    "type": "text",
                    "name": "follwerid",
                    "isRequired": false,
                    "title": "เลขบัตรประชาชน",
                    "validators": [
                        {
                            "type": "expression",
                            "name": "follwer_id",
                            "text": "กรอกเลขบัตรประชาชนให้ถูกด้วยจ้า",
                            "expression": "CheckIDCard({panel.follwerid}) > 0"
                        }
                    ]
                
                  
                }, 
                  { type: "text",  name: "follwer_name", inputType: "text", title: "ชื่อ สกุล", isRequired: true, startWithNewLine: false},
                  { type: "text",  name: "follwer_age", inputType: "text", title: "อายุ", isRequired: true, startWithNewLine: false},
                  
                  {
                    name: "follwer_jointoeat",
                    title: "กินข้าวด้วยกันมั้ย",
                    "type": "radiogroup",
                    "colCount": 0,
                    "startWithNewLine": true,
                    "isRequired": true,
                    "choices": ["1|กินจ้า", "2|ไม่จ๊ะ หากินเองดีกว่า​ โตแล้ว"],
                    cellType: "radiogroup"
                },
                  {
                    name: "follwer_food",
                    title: "ทานอะไรกันได้มั่ง",
                    "type": "radiogroup",
                    "colCount": 0,
                    "startWithNewLine": true,
                    "isRequired": true,
                    visibleIf: "{panel.follwer_jointoeat}=1",
                    "choices": ["1|ได้ทุกอย่าง", "2|ฮาลาล","3|มังสวิรัติแหละ"],
                    cellType: "radiogroup"
                },
                  {
                    "type": "radiogroup",
                    "name": "follwer_foodallergy",
                    "isRequired": false,
                     "title": "แพ้อาหารอะไรบ้างรึเปล่า",
                     visibleIf: "{panel.follwer_jointoeat}=1",
                    "colCount": 0,
                    "choices": ["1|ไม่แพ้อะไรเลยชนะทุกอย่าง", "2|มีแพ้แหละ"]
                },
                
                {
                  name: "follwer_foodallergy_detail",
                  "title": "แพ้อะไรบ้าง บอกเราหน่อย",
                  "type": "text",
                  "visibleIf": "{panel.follwer-foodallergy} = '2'",
                  "isRequired": true,
                  "startWithNewLine": false
                  
              },
              {
                "type": "radiogroup",
                "name": "follwermakeinsurance",
                "isRequired": false,
                 "title": "สนใจทำประกันกลุ่มกับเราด้วยมั้ย (มีค่าใช้าจ่ายเพิ่มเติม)",
               
                "colCount": 0,
                "choices": ["1|ทำสิจ๊ะ รอไร", "2|ไม่ทำจ้า ดูแลตัวเองได้"]
            },
              {
                name: "follwer_insurance",
                "title": "ใครเป็นผู้รับผลประโยชน์กรมธรรม์",
                "type": "text",
                visibleIf: "{panel.follwermakeinsurance}=1",
                "isRequired": true,
                "startWithNewLine": true
                
             },
              {
                "type": "dropdown",
                "name": "follwer_insurance_relation",
                visibleIf: "{panel.follwermakeinsurance}=1",
                "isRequired": false,
                 "title": "มีความสัมพันธ์เปน",
                 "isRequired": true,
                 "startWithNewLine": false,
                 "choices": ["พ่อ|พ่อ", "แม่|แม่", "พี่สาว/น้องสาว|พี่สาว/น้องสาว","พี่ชาย/น้องชาย|พี่ชาย/น้องชาย","ลูกชาย/ลูกสาว|ลูกชาย/ลูกสาว","คู่สมรส|คู่สมรส","เพื่อน|เพื่อน","ปู่/ตา/ลุง|ปู่/ตา/ลุง","ย่า/ยาย/ป้า|ย่า/ยาย/ป้า","น้า/อา|น้า/อา"]
              
            },
            {
              type: "text",
              visibleIf: "{readytogo}='Yes'",
              name: "follower_disease",
              title: "มีโรคประจำตัวอะไรมั้ยจ๊ะ",
             
            },
    
              ], minPanelCount: 1, panelAddText: "เพิ่มผู้ติดตาม", panelRemoveText: "ไม่เพิ่มละ..เปลี่ยนใจ"
              }
    
            
            ],
            "panelCount": 2,
            "panelAddText": "Add a blood relative",
            "panelRemoveText": "Remove the relative"
          },
          {
           
            questions: [
                {
                    "type": "matrixdynamic",
                    "name": "shirt",
                    "columns": [
                     {
                      "name": "shirtsize",
                      "title": "เลือกไซส์เลยจ้า"
                     }
                    ],
                    "choices": [
                        {
                         "value": "femalexs",
                         "text": "ญ ไซส์ XS (อก 34)"
                        },
                        {
                         "value": "females",
                         "text": "ญ ไซส์ S (อก 36)"
                        },
                        {
                         "value": "femalem",
                         "text": "ญ ไซส์ M (อก 38)"
                        },
                        {
                         "value": "femalel",
                         "text": "ญ ไซส์ L (อก 40)"
                        },
                        {
                         "value": "femalexl",
                         "text": "ญ ไซส์ XL (อก 42)"
                        },
                        {
                            "value": "males",
                            "text": "ช ไซส์ S (อก 36)"
                           },
                           {
                            "value": "malem",
                            "text": "ช ไซส์ M (อก 38)"
                           },
                           {
                            "value": "malel",
                            "text": "ช ไซส์ L (อก 40)"
                           },
                           {
                            "value": "malexl",
                            "text": "ช ไซส์ XL (อก 42)"
                           },
                           {
                            "value": "male2xl",
                            "text": "ช ไซส์ 2XL (อก 44)"
                           },
                           {
                            "value": "male3xl",
                            "text": "ช ไซส์ 3XL (อก 46)"
                           }
                           
                       ],
                    "rowCount": 1
                },
            
        
                
              {
                type: "comment",
                name: "suggestions",
                title: "มีอะไรจะบอกเพิ่มมั้ย"
              },
              {
                type: "checkbox",
                name: "condition",
                "isRequired": true,
                title: "เงื่อนไขและข้อตกลง",
             
                "choices": ["1|Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."]
              },
           
           
             
            
            ]
          }
         
        ],
        "completeText": "ส่งคำตอบ"
       
      };
      onValueChanged(result) {
        console.log("value changed!");
      }
    
      onComplete(result) {
        console.log("Complete! " + result);
      }
      
       
   render() {
    
    var storageName = "SurveyJS_LoadState";
    var timerId = 0;
    Survey
    .StylesManager
    .applyTheme("orange");



    
    var survey = new Survey.Model(this.json);
    

    survey
    .onComplete
    .add(function (result) {
        // document
        //     .querySelector('#surveyResult')
        //     .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);

            clearInterval(timerId);
          //save the data on survey complete. You may call another function to store the final results
          //saveState(survey);
          var data = { postId: 'someID', surveyResult: JSON.stringify(survey.data) }; 
          console.log(data);
          // $.ajax({
          //   type: "POST",
          //   url: "http://demo4393909.mockable.io/survey",
          //   data: data,  //no further stringification
          //   success: function(data){
           
          //     console.log(data);
            

          //   }
          // });
    });

    function loadState(survey) {
    
        const cookies = new Cookies();

     //   cookies.remove('cookiesurvey');
   // $.removeCookie('cookiesurvey', { path: '/pages' });
        localStorage.clear();
      

        // $.ajax({
        //     type:"GET",
        //     url: "http://demo4393909.mockable.io/getsurvey",
        //     crossDomain: true,
        //     success: function (data) {
             
        //       console.log("received: " + JSON.stringify(data));
              
        //        var loaddata = (JSON.stringify(data));
        //        console.log(survey);
        //        survey.data = loaddata;
        //       survey
        //           .onComplete
        //           .add(function (result) {
        //               document
        //                   .querySelector('#surveyResult')
        //                   .innerHTML = "result: " + JSON.stringify(result.data);
        //           });
      
        //      $("#surveyElement").Survey({model: loaddata});
            
        //     }
        //   });
          
        //   survey.data =    
        //     {"readytogo":"No","readytogoกกด":"No","shirtsize":[{"shirtsize_detail":"femalel"},{"shirtsize_detail":"femalexl"}],"suggestions":"dfsfsfsfsfsfsfdfdfafdsdssfffsa3","condition":"ok"}
            
          
          
      }

    //var q = model.getQuestionByName('detailfollower');

    survey.onUpdateQuestionCssClasses.add(function(survey, options) {
   
      var classes = options.cssClasses;
      
      classes.root = "por_root";
      classes.item = "por_item";
      classes.label = "por_label";
      if (options.question.getType() === "button") {
        classes.item = "sq-root sq-root-button";
    }
  
    });
    loadState(survey);
    timerId = window.setInterval(function () {
       // saveState(survey);
      }, 10000);

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
                                onValueChanged={this.onValueChanged}
                                />
                       
                        </CardBody>
               </Card>
            </div>
       </Col>
       </Row>
       
       </Fragment>
      );
   }
}

export default survey;
