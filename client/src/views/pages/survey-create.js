import React, { Component } from "react";
import * as config from "../../services/AppConfig";
import { Link, Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Alert,
  Form,
  CustomInput,
  FormGroup,
  Label,
  Table,
  Input
} from "reactstrap";
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
      name:'',
      rename:''
    };
  }
  
  handleClick = event => {
    console.log("State ==>", this.state.rename+"..."+this.state.surveyid);


    var renamedata = {
      surveyid:this.state.surveyid,
      userid: '1',
      version: "1",
      name:this.state.rename === ''?this.state.name:this.state.rename
    };
    console.log(renamedata)
    try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/surveys/rename", {
        method: "post",
       
        crossDomain: true,
        headers: {
       
          "Content-Type": "application/json",
          userid: localStorage.getItem("session_userid"),
          token: localStorage.getItem("token_local")
          // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
        },
        body:  JSON.stringify(renamedata)
      })
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
          alert("fail");
        }else{
          alert("success");
         
         
        }
      })
      .then((responseJson) => {
        this.startEdit();
      })
      }catch (ex) {
        console.log(ex);
      }
     
     


  }
  handleNameChange = event => {
    this.setState({ rename: event.target.value })
   
  console.log(this.state.rename)
  };

  startEdit() {
    this.setState({
      showStore: !this.state.showStore,
      disabled: !this.state.disabled,
      clickedit: !this.state.clickedit
    });
  }

  async componentDidMount() {
     
    this.setState({
      surveyid: this.props.location.state.surveyid,
      name: this.props.location.state.name
    });
    let options = { showEmbededSurveyTab: true };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    );
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;

    try {
      console.log("surveyid"+this.props.location.state.surveyid)
      const response = await  fetch(config.BACKEND_GSURVEY + "/api/v2/admin/surveys/"+this.props.location.state.surveyid, {
        method: "get",
        crossDomain: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          userid: localStorage.getItem("session_userid"),
          token: localStorage.getItem("token_local")
            // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
        }
      })
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      var question = JSON.stringify(json.data);
      //       console.log(question)
      console.log("jsonnaja"+question);
      this.surveyCreator.text = question;
          this.setState({ json: question});
    } catch (error) {
      console.log(error);
    }
}


  

  render() {
    console.log("dd.." + this.state.surveyid);
    console.log("display.." + this.state.name);
    

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
                        <td width = "400px;">
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            onChange = {this.handleNameChange}
                            defaultValue={this.state.name}
                            disabled={this.state.disabled ? "disabled" : ""}
                            required
                            style={{ width: "400px" }}
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
                            <Button color="success"  onClick={this.handleClick}>Update</Button>
                          </td>
                          <td className="text-left">
                            <Button
                              color="warning"
                              onClick={this.startEdit.bind(this)}
                            >
                              Cancel
                            </Button>
                          </td>
                        </div>
                      </tr>
                      {/* <tr>
                        <td>
                          <input
                            type="text"
                            name="surveyid"
                            className="form-control"
                            defaultValue={this.state.surveyid}
                            disabled={this.state.disabled ? "disabled" : ""}
                            required
                            style={{ width: "200px" }}
                          />
                        </td>
                        <td className="text-right">
                          <img
                            src={userImagedga}
                            onClick={this.handleGameClik.bind(this)}
                          />
                        </td>
                        <td>
                          <div
                            className="form-actions"
                            style={{
                              display: this.state.showStore ? "block" : "none"
                            }}
                          >
                            <Button color="success">Update</Button>
                            <Button color="warning">Cancel</Button>
                          </div>
                        </td>
                      </tr> */}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              {/* <input
                type="text"
                name="surveyid"
                className="form-control"
                defaultValue={this.state.surveyid}
                disabled={this.state.disabled ? "disabled" : ""}
                required
                style={{ width: "200px" }}
              />
              <img
                src={userImagedga}
                onClick={this.handleGameClik.bind(this)}
              /> */}
            </FormGroup>
          </Col>
        </Row>

        <div id="surveyCreatorContainer" />
      </div>
    );
  }

    saveMySurvey = () => {
      console.log("======savemysurvey=======");
      var data = this.surveyCreator.text;

      // console.log(JSON.stringify(data));
     // var data1 = '{\n"name":"seminar-01",' + data.substring(1);

      var jsondata = {
        userid:"1",
        name: this.state.name,
        createdated: new Date(),
        surveyid:this.state.surveyid,
        version: "1",
      };
      var t = JSON.stringify(jsondata);
      t = t.substring(0, t.length - 1);

      var jsondata = t + "," + data.substring(1);
      console.log(jsondata);
      try {
      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/surveys", {
        method: "post",
        crossDomain: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          userid: localStorage.getItem("session_userid"),
          token: localStorage.getItem("token_local")
          // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
        },
        body: jsondata
      }).then(function(response) {
        console.log("res"+response)
        if (!response.ok) {
          throw Error(response.statusText);
          alert("fail");
        }else{
          alert("success");
        }
      })
      }catch (ex) {
        console.log(ex);
      }
     
    }
}

export default Formcreate;
