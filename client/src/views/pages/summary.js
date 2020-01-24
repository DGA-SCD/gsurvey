import React, { Component, useState, forwardRef } from 'react';
import { BACKEND_URL } from "../../services/AppConfig";
import { Link, Redirect } from "react-router-dom";

import MaterialTable from "material-table";
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import AddBox from '@material-ui/icons/AddBox';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import SaveAlt from '@material-ui/icons/SaveAlt';
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
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />)

};


class Summary extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      redirect: true,
      allResponses: []

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
        //  console.log("response.status" + response.status)
        if (response.status === 200) {
          return response.json()
        } else {
          console.log("response.status not success" + response.status)
          this.setState({ requestFailed: true })
        }

      })
      .then(result => {
        // console.log("allbooking.....");

        // console.log(result.data.data);

        this.setState({ result: result, columns: result.data.columns, data: result.data.data, requestFailed: false })

        fetch(BACKEND_URL + '/v1/reports/rooms', options)


          .then((response) => response.json())
          .then(result_api2 => {


            console.log('=====fecth api room=======')
            var get_col = JSON.parse(JSON.stringify(this.state.columns))
            console.log(get_col)
            var new_col = result_api2.data


            var keysindex = Object.keys(get_col);

            for (var i = 0; i < keysindex.length; i++) {
              if (i === 5) {

                //var t = this.state.columns[keysbyindex[i]];
                // t.lookup = keysindex
                get_col[keysindex[i]].lookup = new_col
                // console.log(this.state.columns[keysbyindex[i]].lookup)
                console.log(get_col[keysindex[i]].lookup)
                //this.state.columns.splice(t.lookup, 1, newvalue)
              }
            }
            console.log(get_col)


            this.setState({ columns: get_col })

          })

      })
      .catch(e => {
        alert('ไม่สามารถโหลดข้อมูลได้ ติดต่อผู้ดูแลระบบ' + e)
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


            onRowUpdate: (newData, oldData) =>

              new Promise((resolve, reject) => {
                setTimeout(() => {
                  let data = this.state.data;
                  const index = data.indexOf(oldData);
                  data[index] = newData;


                  const obj = JSON.parse(JSON.stringify(newData));
                  //console.log(obj);

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
                  const options1 = {
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

                    },
                  };
                  const url1 = BACKEND_URL + "/v1/users/booking"
                  const url2 = BACKEND_URL + '/v1/reports/rooms'
                  const url3 = BACKEND_URL + '/v1/users/allbooking'
                  function handleErrors(response) {
                    if (!response.ok) {
                      alert('ไม่สามารถเปลี่ยนแปลงข้อมูลได้ ติดต่อผู้ดูแลระบบ' + response.statusText)
                      //   throw Error(response.statusText);
                    }
                    return response;
                  }
                  fetch(url1, options)
                    .then(handleErrors)
                    .then((response) => response.json())

                    .then((res) => {
                      //console.log(res);
                      if (res.code === 20000) {
                        const data = this.state.data;

                        const index = data.indexOf(oldData);
                        //  console.log(index);
                        data[index] = newData;
                        //  console.log(data[index]);
                        this.setState({ data }, () => resolve());


                        // fetch(url2, options1)

                        //   .then(handleErrors)
                        //   .then((response) => response.json())
                        //   .then(result => {


                        //     console.log('============')
                        //     var change_room = JSON.parse(JSON.stringify(this.state.columns))
                        //     console.log(change_room)
                        //     var newvalue = result.data


                        //     var keysbyindex = Object.keys(change_room);

                        //     for (var i = 0; i < keysbyindex.length; i++) {
                        //       if (i === 5) {

                        //         //var t = this.state.columns[keysbyindex[i]];
                        //         // t.lookup = newvalue
                        //         change_room[keysbyindex[i]].lookup = newvalue
                        //         // console.log(this.state.columns[keysbyindex[i]].lookup)
                        //         console.log(change_room[keysbyindex[i]].lookup)
                        //         //this.state.columns.splice(t.lookup, 1, newvalue)
                        //       }
                        //     }
                        //     console.log(change_room)


                        //     this.setState({ columns: change_room })

                        //   })


                        var apiRequest1 = fetch(url2, options1)
                          .then(handleErrors)
                          .then((response) => response.json())

                        var apiRequest2 = fetch(url3, options1)
                          .then(handleErrors)
                          .then((response) => response.json())


                        Promise.all([apiRequest1, apiRequest2])
                          .then(allResponses => {
                            const response1 = allResponses[0]
                            const response2 = allResponses[1]

                            //.then(this._checkResponse(response1))
                            console.log("response1.data");
                            console.log(response1);
                            console.log("เพื่อนร่วมห้อง");
                            console.log(response2.data.data);


                            var change_room = JSON.parse(JSON.stringify(this.state.columns))
                            console.log(change_room)
                            var newvalue = response1.data


                            var keysbyindex = Object.keys(change_room);

                            for (var i = 0; i < keysbyindex.length; i++) {
                              if (i === 5) {

                                //var t = this.state.columns[keysbyindex[i]];
                                // t.lookup = newvalue
                                change_room[keysbyindex[i]].lookup = newvalue

                                console.log(change_room[keysbyindex[i]].lookup)
                                //this.state.columns.splice(t.lookup, 1, newvalue)
                              }
                            }
                            this.setState({
                              columns: change_room,
                              data: response2.data.data
                            })
                          })
                          .catch((err) => {
                            alert('ไม่สามารถเปลี่ยนแปลงข้อมูลห้องพักได้ ติดต่อผู้ดูแลระบบ' + err)
                          });


                      } else {
                        alert('ไม่สามารถเปลี่ยนแปลงข้อมูลได้ ติดต่อผู้ดูแลระบบ')
                      }
                    })







                }, 1000);

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
