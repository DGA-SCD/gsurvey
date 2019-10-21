import React, { Component, useState, forwardRef } from 'react';
import ReactDOM from "react-dom";
import { BACKEND_URL } from "../../services/AppConfig";
import { Link, Redirect } from "react-router-dom";
import Box from '@material-ui/core/Box';
import MaterialTable from "material-table";
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';

import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { fontSize } from '@material-ui/system';
import "../../assets/scss/views/pages/survey/survey.css";
import AuthService from '../../services/AuthService';
//import withRequest from "../../services/withRequest";
import { array } from 'prop-types';
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


class Summary extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      redirect: true


    };


    console.log("state" + this.state)
    console.log(this.props)
    this.Auth = new AuthService();
    this.intervalID = setInterval(() => this.Auth.IsAvailable(), 10000);
  }
  componentWillUnmount() {

    clearTimeout(this.intervalID);

  }



  componentDidMount() {
    console.log("=======summanry===");
    const options = {
      async: true,
      mode: 'cors',
      crossDomain: true,
      cache: 'no-cache',
      redirect: 'follow',

      method: 'GET',
      headers: {
        "userid": localStorage.getItem("session_userid"),
        "token": localStorage.getItem("token_local"),
        'Content-Type': 'application/json',
        'Accept': 'application/json'

      }
    };

    fetch(BACKEND_URL + '/v1/users/allbooking', options)
      .then(response => {
        console.log("response.status" + response.status)
        if (response.status === 200) {
          return response.json()
        } else {
          console.log("response.status not success" + response.status)
          this.setState({ requestFailed: true })
        }

      })
      .then(result => {
        console.log(result);

        this.setState({ result: result, columns: result.data.columns, data: result.data.data, requestFailed: false })
      })
      .catch(e => {
        console.log(e);
        this.setState({ requestFailed: true });
      });
  }

  render() {

    console.log('result:::' + this.Auth.loggedIn())
    console.log("requestFailed:::" + this.state.requestFailed)
    console.log(this.state.columns)
    if (this.state.requestFailed) {
      return (<Redirect to={'login'} />)
    }
    if (this.state.result) {
      return (

        <MaterialTable
          title="จัดการเพื่อนร่วมห้อง/จัดการห้องพัก"
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    data.push(newData);
                    this.setState({ data }, () => resolve());
                  }
                  resolve()
                }, 1000)
              }),

            onRowUpdate: (newData, oldData) =>

              new Promise((resolve, reject) => {
                let data = this.state.data;
                const index = data.indexOf(oldData);
                data[index] = newData;


                const obj = JSON.parse(JSON.stringify(newData));
                console.log(obj);

                delete obj['fullname'];
                delete obj['department'];
                delete obj['segment'];
                delete obj['friend'];
                delete obj['segment'];
                console.log(obj);

                const options = {
                  async: true,
                  mode: 'cors',
                  crossDomain: true,
                  cache: 'no-cache',
                  method: 'POST',
                  headers: {
                    "userid": localStorage.getItem("session_userid"),
                    "token": localStorage.getItem("token_local"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'

                  },
                  body: JSON.stringify(obj)
                };
                const url = BACKEND_URL + "/v1/users/booking"
                fetch(url, options)
                  .then((response) => response.json())

                  .then((res) => {
                    console.log(res);
                    if (res.code === 20000) {


                      const data = this.state.data;

                      const index = data.indexOf(oldData);
                      //  console.log(index);
                      data[index] = newData;
                      console.log(data[index]);
                      this.setState({ data }, () => resolve());
                    } else {
                      alert('ไม่สามารถเปลี่ยนแปลงข้อมูลได้ ติดต่อผู้ดูแลระบบ')
                    }
                  })








              }),
            onRowDelete: oldData =>

              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.data;
                    const index = data.indexOf(oldData);
                    data.splice(index, 1);
                    this.setState({ data }, () => resolve());
                  }
                  resolve()
                }, 1000)
              }),
          }}
          options={{
            sorting: true,
            grouping: true,
            exportButton: true,
            exportAllData: true,
            // paginationType: "stepped",
            pageSize: 10,
            pageSizeOptions: [25, 50, 100],
            headerStyle: {
              backgroundColor: '#00ADFF',
              color: '#FFF',
              font: "Athiti !important"
            },
            rowStyle: {
              font: "Athiti !important"
            }
          }}
        />

      )
    }
    return <div>Loading...</div>;
  }


}
export default Summary;
//export default withRequest(BACKEND_URL + '/v1/users/allbooking')(Summary)
