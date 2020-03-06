import React, { Component, useState, forwardRef } from "react";
import * as config from "../../services/AppConfig";
import { BrowserRouter, Route, Link } from "react-router-dom";
//import async from "react-async";
import axios from "axios";
import queryString from "query-string";
import Formcreate from "survey-creator";
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
import MaterialTable from "material-table";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import SaveAlt from "@material-ui/icons/SaveAlt";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { fontSize } from "@material-ui/system";
import "../../assets/scss/views/pages/survey/survey.css";
import { toastr } from "react-redux-toastr";
//import AuthService from '../../services/AuthService';
//import withRequest from "../../services/withRequest";
import { array } from "prop-types";
const toastrOptions = {
  timeOut: 2000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />)
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      surveyid: "",
      columns: [],
      _columns: [],
      datetime: "",
      error: ""
    };
  }

  async componentDidMount() {
    var uid = this.props.location.state.userid;
    let url = this.props.location.search;
    let params = queryString.parse(url);

    var url1 =
      config.BACKEND_GSURVEY +
      "/api/v2/admin/surveys/" +
      params.surveyid +
      "?uid=" +
      uid +
      "&v=1";
    var url2 =
      config.BACKEND_GSURVEY +
      "/api/v2/admin/results/surveyid/" +
      params.surveyid +
      "?uid=" +
      uid +
      "&v=1";

    var apiRequest1 = fetch(url1).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(function(object) {
          console.log(object.type, object.message);
        });
      }
    });
    var apiRequest2 = fetch(url2).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(function(object) {
          console.log(object.type, object.message);
        });
      }
    });

    Promise.all([apiRequest1, apiRequest2])
      .then(allResponses => {
        const response1 = allResponses[0];
        const response2 = allResponses[1];

        //.then(this._checkResponse(response1))
        console.log("response1.data");
        var myArray = JSON.parse(JSON.stringify(response1.data.pages))[0]
          .elements;

        const result = myArray.map(({ name, title }) => ({ name, title }));

        var t = JSON.parse(
          JSON.stringify(result)
            .split('"name":')
            .join('"field":')
        );

        const tmp = Object.values(t);

        this.setState({
          columns: tmp
        });
        //  console.log(response2);
        var answer = response2.data;

        var data = answer.map(function(s) {
          Object.keys(s.result).forEach(function(key) {
            if (typeof s.result[key] == "object") {
              console.log("ypeof s[key]====");
              console.log(typeof s[key]);
              var v = JSON.stringify(s.result[key]);
              var res = v.replace(/"/g, "'");

              console.log(v);
              s.result[key] = res;
            }
          });
          return s.result;
        });
        this.setState({
          data: data
        });
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  }
  render() {
    if (this.state.columns && this.state.columns.length) {
      return (
        <div>
          <MaterialTable
            title="ผลรวมแบบสอบถาม"
            columns={this.state.columns}
            data={this.state.data}
            options={{
              actionsColumnIndex: -1,
              sorting: true,
              pageSize: 10,
              exportButton: true,
              exportAllData: true
            }}
          />
        </div>
      );
    }
    return (
      <div>
        <Row>
          <Col xs="12">
            <div className="App">
              <Card>
                <CardBody>
                  <CardTitle> แบบสำรวจ </CardTitle>
                  <div>ยังไม่มีการสร้างแบบสำรวจ</div>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Main;
//export default withRequest(BACKEND_URL + '/v1/users/allbooking')(Summary)
