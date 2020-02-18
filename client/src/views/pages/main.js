import React, { Component, useState, forwardRef } from "react";
import * as config from "../../services/AppConfig";
import { BrowserRouter, Route, Link } from "react-router-dom";
//import async from "react-async";
import axios from "axios";
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
//import AuthService from '../../services/AuthService';
//import withRequest from "../../services/withRequest";
import { array } from "prop-types";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />)
};
async function getDataFromAPI() {
  let response = await fetch(
    config.BACKEND_GSURVEY + "api/v2/admin/survey/owner/1"
  );
  let data = await response.json();
  console.log(JSON.stringify(data, null, "\t"));
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      surveyid: "",
      columns: [],
      datetime: "",
      error: ""
    };
  }

  handleClickOpen = row => {
    return this.props.history.push({
      pathname: "survey-create",

      state: {
        surveyid: row.surveyid,
        name: row.name
      }
    });
  };

  async componentDidMount() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    this.setState({
      //Setting the value of the date time
      datetime: date + "" + month + "" + year + "" + hours + "" + min + "" + sec
    });

    try {
      const response = await fetch(
        config.BACKEND_GSURVEY + "/api/v2/admin/surveys/owner/1"
      );

      const json = await response.json();
      console.log(this.state.data.data);
      this.setState({
        data: json.data,
        columns: [{ title: "Title", field: "name" }]
      });
    } catch (error) {
      this.setState({
        error: error
      });
      console.log(error);
    }
  }
  render() {
    console.log(this.state.data);

    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="แบบสำรวจ G-Survey"
          columns={this.state.columns}
          data={this.state.data}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit Your Survey",
              onClick: (event, rowData) => {
                // this.handleClickOpen(rowData);
                this.props.history.push({
                  pathname: "survey-create",

                  state: {
                    surveyid: rowData.surveyid,
                    name: rowData.name
                  }
                });
              }
            },
            {
              icon: "pageview",
              tooltip: "View Your Survey",
              onClick: (event, rowData) => {
                console.log({ rowData });
                this.props.history.push({
                  pathname: "display",

                  state: {
                    surveyid: rowData.surveyid,
                    name: rowData.name
                  }
                });
              }
            },
            {
              icon: "description",
              tooltip: "Result",
              onClick: (event, rowData) => {
                console.log({ rowData });
                this.props.history.push({
                  pathname: "display",

                  state: {
                    surveyid: rowData.surveyid,
                    name: rowData.name
                  }
                });
              }
            }
          ]}
          icons={{
            Add: () => <Button color="success">Add New Survey</Button>
          }}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    data.push(newData);

                    const obj = JSON.parse(JSON.stringify(newData));

                    var jsondata = {
                      userid: "1",
                      name: obj.name,
                      id: "NewSurvey" + this.state.datetime,
                      version: "1"
                    };

                    jsondata = JSON.stringify(jsondata);

                    console.log("data" + jsondata);

                    //   console.log("datetime" + this.state.datetime);

                    fetch(
                      config.BACKEND_GSURVEY + "/api/v2/admin/surveys/create",
                      {
                        method: "POST",

                        cache: "no-cache",
                        headers: new Headers({
                          "Content-Type": "application/json",
                          Accept: "application/json"
                        }),
                        body: JSON.stringify(jsondata)
                      }
                    )
                      .then(response => {
                        if (!response.ok) {
                          throw new Error("Network response was not ok.");
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                  resolve();
                }, 1000);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    /* let data = this.state.data;
                          const index = data.indexOf(oldData);
                          data.splice(index, 1);
                          this.setState({ data }, () => resolve()); */
                  }
                  resolve();
                }, 1000);
              })
          }}
          components={{}}
          options={{
            grouping: true,
            actionsColumnIndex: -1,
            sorting: true,
            grouping: true,
            exportButton: true,
            exportAllData: true
          }}
        />
      </div>
    );
  }
}
export default Main;
//export default withRequest(BACKEND_URL + '/v1/users/allbooking')(Summary)
