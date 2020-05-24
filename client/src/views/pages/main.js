import React, { Component, forwardRef } from "react";
import * as config from "../../services/AppConfig";

import { userService } from "../../services/UserAuth";

import MaterialTable from "material-table";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import SaveAlt from "@material-ui/icons/SaveAlt";
import PageviewIcon from "@material-ui/icons/Pageview";

import "../../assets/scss/views/pages/survey/survey.css";
import { toastr } from "react-redux-toastr";
//import AuthService from '../../services/AuthService';
//import withRequest from "../../services/withRequest";

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
      datetime: "",
      error: false
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

  async callallSurvey() {
    try {
      var user = JSON.parse(localStorage.getItem("userData"));
      //  if (user) {
      const requestOptions = {
        method: "GET",
        credentials: "include"
      };

      const response = await fetch(
        config.BACKEND_GSURVEY + "/api/v2/admin/surveys/owner/" + user.userid,
        requestOptions
      );
      if (response.ok) {
        const json = await response.json();

        this.setState({
          data: json.data,
          columns: [
            {
              title: "ชื่อแบบสำรวจ",
              field: "name"
            },
            {
              title: "วันที่แก้ไข",
              field: "modified_at",
              type: "datetime",
              editable: "never"
            }
          ]
        });
      } else {
        userService.clearStrogae();
      }
    } catch (error) {
      this.setState({
        error: error
      });
      console.log(error);
    }
  }
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
    this.callallSurvey();
  }
  render() {
    return (
      <div>
        <MaterialTable
          icons={tableIcons}
          title="แบบสำรวจ G-Survey"
          columns={this.state.columns}
          data={this.state.data}
          actions={[
            {
              icon: () => <Edit />,
              tooltip: "แก้ไขแบบสำรวจ",
              //  rowData: () => ({ disabled: rowData.version === 2 }),
              onClick: (event, rowData) => {
                //disabled: rowData.version === 2;
                // this.handleClickOpen(rowData);
                this.props.history.push({
                  pathname: "survey-create",

                  state: {
                    surveyid: rowData.surveyid,
                    name: rowData.name,
                    version: rowData.version,
                    userid: rowData.userid
                  }
                });
              }
            },
            {
              icon: () => <PageviewIcon />,
              tooltip: "ดูแบบสำรวจที่สร้าง",

              onClick: (event, rowData) => {
                // this.props.history.push({
                //   pathname: "displayhandle",
                //   search:
                //     "?surveyid=" + rowData.surveyid + "&uid=" + rowData.userid,
                //   state: {
                //     surveyid: rowData.surveyid,
                //     name: rowData.name,
                //     version: rowData.version,
                //     userid: rowData.userid
                //   }
                // });
                window.open(
                  "displayhandle?surveyid=" +
                    rowData.surveyid +
                    "&uid=" +
                    rowData.userid,
                  "_blank"
                );
              }
            },
            {
              icon: "description",
              tooltip: "ดูผลสำรวจ",
              onClick: (event, rowData) => {
                // this.handleClickOpen(rowData);
                this.props.history.push({
                  pathname: "result",
                  search: "?surveyid=" + rowData.surveyid,
                  state: {
                    surveyid: rowData.surveyid,
                    name: rowData.name,
                    version: rowData.version,
                    userid: rowData.userid
                  }
                });
              }
            }
          ]}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          icons={{
            //Add: () => <Button color="success">เพิ่มแบบสำรวจ</Button>,
            Add: props => {
              return (
                <div
                  style={{
                    backgroundColor: "#44c767",

                    radius: "7px",
                    border: "1px solid",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "#ffffff",
                    padding: "13px 20px",
                    fontSize: "16px"
                    //width: "100px"
                  }}
                >
                  เพิ่มแบบสำรวจ
                </div>
              );
            },
            Export: props => {
              return (
                <div
                  style={{
                    backgroundColor: "#1CBCD8",

                    radius: "7px",
                    border: "1px solid",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "#ffffff",
                    padding: "13px 20px",
                    fontSize: "16px"
                    //width: "100px"
                  }}
                >
                  นำข้อมูลออก
                </div>
              );
            }
            // Export: () => <Button color="info">นำข้อมูลออก</Button>
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
                      userid:
                        "" +
                        JSON.parse(localStorage.getItem("userData")).userid,
                      name: obj.name,
                      surveyid: "NewSurvey" + this.state.datetime,
                      version: "1"
                    };

                    jsondata = JSON.stringify(jsondata);

                    fetch(
                      config.BACKEND_GSURVEY + "/api/v2/admin/surveys/create",
                      //"https://jsonplaceholder.typicode.com/users",
                      {
                        method: "POST",
                        crossDomain: true,
                        cache: "no-cache",
                        headers: {
                          "Content-type": "application/json; charset=UTF-8"
                        },
                        credentials: "include",
                        body: jsondata
                      }
                    )
                      .then(response => {
                        if (!response.ok) {
                          toastr.error(
                            "ไม่สารมารถสร้างฟอร์มได้",
                            toastrOptions
                          );
                        } else {
                          this.callallSurvey();
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
                  // eslint-disable-next-line no-lone-blocks
                  {
                    //let data = this.state.data;

                    var jsondel = {
                      userid: oldData.userid,
                      surveyid: oldData.surveyid,

                      version: "1"
                    };

                    jsondel = JSON.stringify(jsondel);

                    fetch(
                      config.BACKEND_GSURVEY + "/api/v2/admin/surveys",

                      {
                        method: "delete",
                        crossDomain: true,
                        cache: "no-cache",
                        credentials: "include",
                        headers: {
                          "Content-type": "application/json; charset=UTF-8"
                        },
                        body: jsondel
                      }
                    )
                      .then(response => {
                        if (!response.ok) {
                          toastr.error("ไม่สามารถลบข้อมูลได้", toastrOptions);
                        } else {
                          toastr.success(
                            "ลบข้อมูลเรียบร้อยแล้ว",
                            toastrOptions
                          );
                          this.callallSurvey();
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                  resolve();
                }, 1000);
              })
          }}
          components={{}}
          options={{
            actionsColumnIndex: -1,
            sorting: true,
            pageSize: 10,
            exportButton: true,
            exportAllData: true,
            headerStyle: {
              backgroundColor: "#1fa2ff",
              color: "#FFF",
              zIndex: 0,
              font: "Athiti"
            },
            addRowPosition: "first"
          }}
          localization={{
            body: {
              editRow: {
                deleteText: "คุณต้องการลบแบบสอบถามนี้ ?",
                cancelTooltip: "ยกเลิก",
                saveTooltip: "ยืนยัน"
              },
              deleteTooltip: "ลบแบบสำรวจ",
              addTooltip: "เพิ่มแบบสำรวจ",
              emptyDataSourceMessage: "ยังไม่มีข้อมูล ณ ขณะนี้"
            },
            header: {
              actions: ""
            },
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
            }
          }}
        />
      </div>
    );
  }
}
export default Main;
//export default withRequest(BACKEND_URL + '/v1/users/allbooking')(Summary)
