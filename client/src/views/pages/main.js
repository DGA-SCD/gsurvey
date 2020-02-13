import React, { Component, useState, forwardRef } from "react";
import * as config from "../../services/AppConfig";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Async from "react-async";
import Formcreate from "survey-creator";

import MaterialTable from "material-table";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import SaveAlt from "@material-ui/icons/SaveAlt";
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

      error: ""
    };
  }
  async componentDidMount() {
    try {
      const response = await fetch(
        config.BACKEND_GSURVEY + "/api/v2/admin/surveys/owner/1"
      );

      const json = await response.json();
      console.log(this.state.data.data);
      this.setState({
        data: json.data,
        columns: [
          { title: "Title", field: "name" },
          {
            title: "albumId",
            field: "surveyid",
            render: rowData => (
              <Link
                to={{
                  pathname: "survey-create",
                  state: {
                    surveyid: rowData.surveyid,
                    name: rowData.name
                  }
                }}
              >
                edit
              </Link>
            )
          },
          {
            title: "vvvvv",
            field: "surveyid",
            render: rowData => (
              <Link
                to={{
                  pathname: "display",
                  state: { surveyid: rowData.surveyid }
                }}
              >
                My route
              </Link>
              // <Link
              // target="_blank"
              //   to={{
              //     pathname: "display",
              //     state: {
              //       por: "chanika"

              //     }
              //   }}
              // >
              //   view
              // </Link>
            )
          },
          { title: "url", field: "code" }
        ]
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
      <MaterialTable
        title="แบบสำรวจ G-Survey"
        columns={this.state.columns}
        data={this.state.data}
      />
    );
  }
}
export default Main;
//export default withRequest(BACKEND_URL + '/v1/users/allbooking')(Summary)
