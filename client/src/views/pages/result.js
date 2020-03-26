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
      error: false
    };
  }

  async componentDidMount() {
    var uid = this.props.location.state.userid;
    let url = this.props.location.search;
    let params = queryString.parse(url);
    var options = {
      method: "get",
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    };

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

    var apiRequest1 = fetch(url1, options)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
      })
      .catch(error => {
        this.setState({ error: error });
      });
    var apiRequest2 = fetch(url2, options)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
      })
      .catch(error => {
        this.setState({ error: error });
      });

    Promise.all([apiRequest1, apiRequest2])
      .then(allResponses => {
        const response1 = allResponses[0];
        const response2 = allResponses[1];
        console.log(allResponses[0]);
        console.log(allResponses[1]);
        if (allResponses[0] === undefined || allResponses[1] === undefined) {
          toastr.error("ไม่สารมารถเปิดผลแบบสำรวจได้", toastrOptions);
        } else {
          //.then(this._checkResponse(response1))
          console.log("response1.data");
          console.log(response1.data);
          const arr = [];
          var newarry = response1.data.pages.map(function(item) {
            item.elements.forEach(function(key) {
              arr.push({
                title: key.name,
                field: key.name
              });
              // console.log(arr);
            });
            return arr;
          });
          console.log(newarry[0]);

          const tmp = Object.values(newarry[0]);

          this.setState({
            columns: tmp
          });

          var answer = response2.data.filter(function(x, k) {
            if (Object.entries(x.result).length !== 0) {
              return x.result;
            }
          });

          console.log("answer");
          console.log(answer);
          var data = answer.map(function(s) {
            Object.keys(s.result).forEach(function(key) {
              if (typeof s.result[key] == "object") {
                var v = JSON.stringify(s.result[key]);
                var res = v.replace(/"/g, "'");

                s.result[key] = res;
              }
            });
            return s.result;
          });

          this.setState({
            data: data
          });
        }
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
          <Link to="main" className="btn btn-info">
            กลับหน้าหลัก
          </Link>
          <MaterialTable
            title="ผลรวมแบบสอบถาม"
            columns={this.state.columns}
            data={this.state.data}
            icons={{
              Export: () => (
                <div>
                  <Button color="info">นำข้อมูลออก</Button>
                </div>
              )
            }}
            options={{
              sorting: true,
              pageSize: 10,
              exportButton: true,
              exportAllData: true,
              doubleHorizontalScroll: true,
              headerStyle: {
                backgroundColor: "#00ADFF",
                color: "#FFF",
                font: "Athiti !important"
              },
              rowStyle: {
                font: "Athiti !important"
              }
            }}
            localization={{
              toolbar: {
                searchPlaceholder: "ค้นหาแบบสำรวจ",
                exportName: "ดึงข้อมูลเป็น csv",
                exportAriaLabel: "นำข้อมูลออก",
                exportTitle: "นำข้อมุลออก"
              },
              pagination: {
                nextTooltip: "หน้าถัดไป",
                previousTooltip: "หน้าก่อนหน้า",
                lastTooltip: "หน้าสุดท้าย",
                firstTooltip: "หน้าแรก",
                labelRowsSelect: "แถว",
                labelDisplayedRows: "{from}-{to} จาก {count}"
              },
              body: {
                emptyDataSourceMessage: "ยังไม่มีคำตอบ สำหรับแบบสำรวจนี้"
              }
            }}
          />
        </div>
      );
    }
    return (
      <div>
        <Link to="main" className="btn btn-info">
          กลับหน้าหลัก
        </Link>
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
