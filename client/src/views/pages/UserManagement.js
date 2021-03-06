import React, { Component, forwardRef } from "react";

//import MaterialTable from "material-table";
import MaterialTable from "material-table";
import { userService } from "../../services/UserAuth";
import * as config from "../../services/AppConfig";

import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import { toastr } from "react-redux-toastr";
import SaveAlt from "@material-ui/icons/SaveAlt";

import Button from "@material-ui/core/Button";
import "../../assets/scss/views/pages/survey/survey.css";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />)
};
const toastrOptions = {
  timeOut: 5000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};

export default class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      surveyid: "",
      columns: [],
      user_id: "",
      email: "",
      dialogOpen: false,
      supspenModalOpen: false,
      error: false,
      desc: "",
      suspension_status: ""
    };
    this.fecthdata = this.fecthdata.bind(this);
    this.replaceModalItem = this.replaceModalItem.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.upDateapproval = this.upDateapproval.bind(this);
  }

  async fecthdata() {
    try {
      //var user = JSON.parse(localStorage.getItem("userData"));

      const requestOptions = {
        method: "GET",
        credentials: "include"
      };

      const response = await fetch(
        config.BACKEND_GSURVEY + "/api/v2/admin/members",
        requestOptions
      );
      if (response.ok) {
        const json = await response.json();

        this.setState({
          data: json.data,
          columns: [
            {
              title: "ชื่อ",
              field: "firstname",
              editable: "never"
            },
            {
              title: "นามสกุล",
              field: "lastname",
              editable: "never"
            },
            {
              title: "อีเมล",
              field: "email",
              editable: "never"
            },
            {
              title: "เบอร์โทรติดต่อ",
              field: "mobile",
              editable: "never"
            },
            {
              title: "สถานะ",
              field: "approval_status",
              lookup: {
                approve: "อนุมัติ",
                waiting: "รออนุมัติ",
                reject: "ปฏิเสธ"
              },
              render: rowData => {
                return rowData.approval_status === "waiting" ? (
                  <p style={{ color: "#E87722", fontWeight: "400" }}>
                    รออนุมัติ
                  </p>
                ) : rowData.approval_status === "approve" ? (
                  <p style={{ color: "#008240", fontWeight: "400" }}>อนุมัติ</p>
                ) : (
                  <p style={{ color: "#FF0000", fontWeight: "400" }}>ปฏิเสธ</p>
                );
              }
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
    }
  }
  componentDidMount() {
    this.fecthdata();
  }

  submitHandler(e) {
    e.preventDefault();

    if (this.state.event === "reject") {
      var url_fetch = config.BACKEND_GSURVEY + "/api/v2/admin/members/approval";
      var message = "ระงับการใช้งานเรียบร้อยแล้ว";
    }
    if (this.state.event === "disable") {
      //disable
      url_fetch = config.BACKEND_GSURVEY + "/api/v2/admin/members/suspension";
      message = "ยกเลิกการใช้งานเรียบร้อยแล้ว";
    }

    fetch(url_fetch, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",

      body: JSON.stringify({
        userid: this.state.user_id,
        email: this.state.email,
        action: this.state.status,
        desc: this.state.desc
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          toastr.success(message, toastrOptions);
          this.setState({ supspenModalOpen: false, desc: "" });
          this.fecthdata();
          // setTimeout(function() {
          //   this.fecthdata();
          // }, 3000);
        } else {
          toastr.error(result.desc, toastrOptions);
        }
      });
  }
  onClose() {
    this.setState({ dialogOpen: false });
  }
  toggleModal = () => {
    this.setState({
      supspenModalOpen: !this.state.supspenModalOpen
    });
  };

  handleChange(event) {
    this.setState({ desc: event.target.value });
  }
  replaceModalItem(rowData) {
    // const requiredItem = JSON.stringify(rowData.rowData.user_id);

    //  console.log(requiredItem);

    this.setState({
      supspenModalOpen: true,
      user_id: rowData.rowData.user_id,
      email: rowData.rowData.email,
      name: rowData.rowData.firstname + " " + rowData.rowData.lastname,
      event: "reject",
      status: rowData.rowData.approval_status
    });
  }

  upDateapproval(rowData) {
    var message;
    if (rowData.approval_status === "approve") {
      message = "อนุมัติการใช้งานเรียบร้อยแล้ว";
    }
    if (rowData.approval_status === "waiting") {
      message = "รอการตรวจสอบจากผู้ดูแลระบบ";
    }

    fetch(config.BACKEND_GSURVEY + "/api/v2/admin/members/approval", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",

      body: JSON.stringify({
        userid: rowData.user_id,
        email: rowData.email,
        action: rowData.approval_status,
        desc: ""
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          toastr.success(message, toastrOptions);

          this.fecthdata();
          // setTimeout(function() {
          //   this.fecthdata();
          // }, 3000);
        } else {
          toastr.error(result.desc, toastrOptions);
        }
      });
  }
  supspenModal(rowData) {
    if (rowData.rowData.suspension_status === "enable") {
      var suspension_status = "disable";
      this.setState({
        supspenModalOpen: true,
        user_id: rowData.rowData.user_id,
        email: rowData.rowData.email,
        name: rowData.rowData.firstname + " " + rowData.rowData.lastname,
        event: "disable",
        status: suspension_status
      });
    } else {
      suspension_status = "enable";

      fetch(config.BACKEND_GSURVEY + "/api/v2/admin/members/suspension", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",

        body: JSON.stringify({
          userid: rowData.rowData.user_id,
          email: rowData.rowData.email,
          action: suspension_status,
          desc: ""
        })
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            toastr.success("อนุมัติการใช้งานเรียบร้อยแล้ว", toastrOptions);
            //  this.setState({ supspenModalOpen: false, desc: "" });
            this.fecthdata();
          } else {
            toastr.error(result.desc, toastrOptions);
          }
        });
    }
    // console.log(suspension_status);

    // console.log(this.state.supspenModalOpen);
  }
  render() {
    return (
      <>
        <div>
          <MaterialTable
            icons={tableIcons}
            title="จัดการผู้ใช้งาน"
            columns={this.state.columns}
            data={this.state.data}
            detailPanel={[
              {
                tooltip: "แสดงรายละเอียด",
                render: rowData => {
                  return (
                    <div
                      style={{
                        fontSize: 16,
                        alignItems: "center",
                        textAlign: "left",

                        backgroundColor: "aliceblue",
                        height: 200,
                        paddingTop: 30,
                        paddingBottom: 10,
                        paddingLeft: 50
                      }}
                    >
                      <p style={{}}>
                        <b>สังกัดกระทรวง :</b> {rowData.min_name}
                      </p>
                      <p style={{}}>
                        <b>สังกัดกรม : </b> {rowData.dep_name}
                      </p>
                      <p style={{}}>
                        <b>สังกัดหน่วยงาน : </b>
                        {rowData.org_name}
                      </p>
                    </div>
                  );
                }
              }
            ]}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      const data = this.state.data;
                      const index = data.indexOf(oldData);
                      data[index] = newData;
                      const rowData = data[index];

                      if (data[index].approval_status === "reject") {
                        this.replaceModalItem({ rowData });
                      } else {
                        this.upDateapproval(rowData);
                      }
                    }
                    resolve();
                  }, 1000);
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...this.state.data];
                    const index = oldData.tableData.id;
                    const deldata = dataDelete.splice(index, 1);

                    //  setTimeout(() => {
                    fetch(
                      config.BACKEND_GSURVEY +
                        "/api/v2/admin/members/" +
                        deldata[0].user_id,
                      {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        credentials: "include"
                      }
                    )
                      .then(res => res.json())
                      .then(result => {
                        if (result.success) {
                          toastr.success(
                            "ลบข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
                            toastrOptions
                          );
                          this.fecthdata();
                        } else {
                          toastr.error(result.desc, toastrOptions);
                        }
                      });
                    //  resolve();
                    // });

                    resolve();
                  }, 1000);
                })
            }}
            actions={[
              rowData => ({
                //icon: rowData => if(rowData.suspension_status === "enable"){ <AddBox />,
                //  icon: props => <p>Manage</p>,
                icon:
                  rowData.suspension_status === "enable" //0enable,1disable
                    ? "toggle_on"
                    : "toggle_off",
                iconProps:
                  rowData.suspension_status === "enable"
                    ? { style: { color: "green" } }
                    : { style: { color: "#cccccc" } },
                tooltip:
                  rowData.suspension_status === "enable" //disable ยกเลิกการใช้งาน , reject ระงับการใช้งาน
                    ? "กดเพื่อยกเลิกการใช้งาน"
                    : "กดเพื่ออนุมัติการใช้งาน",
                onClick: (event, rowData) => {
                  // console.log(rowData);

                  this.supspenModal({ rowData });
                }
              })
            ]}
            options={{
              actionsColumnIndex: -1,
              pageSize: 10,
              exportButton: true,
              exportAllData: true,
              headerStyle: {
                backgroundColor: "#ff4758",
                color: "#FFF",
                zIndex: 0,
                font: "Athiti"
              }
            }}
            localization={{
              body: {
                editRow: {
                  deleteText: "คุณต้องการลบผู้ใช้งานนี้ ?",
                  cancelTooltip: "ยกเลิก",
                  saveTooltip: "ยืนยัน"
                },
                deleteTooltip: "ลบผู้ใช้งาน",
                editTooltip: "แก้ไขผู้ใช้งาน",
                emptyDataSourceMessage: "ยังไม่มีข้อมูล ณ ขณะนี้"
              },
              header: {
                actions: ""
              },
              toolbar: {
                searchPlaceholder: "ค้นหาผู้ใช้งาน",
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
            components={{}}
          />
        </div>
        <Dialog
          open={this.state.supspenModalOpen}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">
            {this.state.event === "reject"
              ? "ระงับการใช้งาน"
              : "ยกเลิกการใช้งาน"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={this.submitHandler}>
              <DialogContentText style={{ fontFamily: "Athiti" }}>
                กรุณาระบุเหตุผลที่
                {this.state.event === "reject" //disable ยกเลิกการใช้งาน , reject ระงับการใช้งาน
                  ? "ระงับการใช้งาน"
                  : "ยกเลิกการใช้งาน"}
                ของ <br /> คุณ
                {this.state.name}
              </DialogContentText>
              <TextField
                autoFocus
                name="desc"
                type="text"
                value={this.state.desc}
                fullWidth
                onChange={this.handleChange.bind(this)}
                //onChange={this.onChange}
                required
              />
              <div
                style={{
                  textAlign: "right",
                  paddingBottom: 20,
                  paddingTop: 20
                }}
              >
                <Container>
                  <Button
                    variant="contained"
                    onClick={this.toggleModal}
                    style={{ fontFamily: "Athiti" }}
                  >
                    ปิดหน้าต่าง
                  </Button>

                  <Button
                    type="submit"
                    color="primary"
                    style={{ fontFamily: "Athiti" }}
                    variant="contained"
                  >
                    {this.state.event === "reject" //disable ยกเลิกการใช้งาน , reject ระงับการใช้งาน
                      ? "ระงับการใช้งาน"
                      : "ยกเลิกการใช้งาน"}
                  </Button>
                </Container>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
