// import external modules
import React, { Component } from "react";
import { Redirect, NavLink } from "react-router-dom";
//import IdleTimer from "react-idle-timer";
import { CheckSquare } from "react-feather";
import { toastr } from "react-redux-toastr";
// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";
const toastrOptions = {
  timeOut: 0, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};
class SideMenuContent extends Component {
  render() {
    var menuLists = [
      //0 แบบสำรวจ
      <SideMenu.MenuSingleItem key="1">
        <NavLink to="/pages/main" activeClassName="active">
          <i className="menu-icon">
            <CheckSquare size={18} />
          </i>
          <span className="menu-item-text">แบบสำรวจ</span>
        </NavLink>
      </SideMenu.MenuSingleItem>,
      //1
      <SideMenu.MenuSingleItem key="2">
        <NavLink to="/pages/UserManagement" activeClassName="active">
          <i className="menu-icon">
            <CheckSquare size={18} />
          </i>
          <span className="menu-item-text">จัดการผู้ใช้งาน</span>
        </NavLink>
      </SideMenu.MenuSingleItem>
    ];
    if (JSON.parse(localStorage.getItem("userData") === null)) {
      return <Redirect to={"login"} />;
    } else {
      let dataList = JSON.parse(localStorage.getItem("userData"));

      console.log(dataList.role);
      if (dataList.role === "system admin") {
        return (
          <SideMenu
            className="sidebar-content"
            toggleSidebarMenu={this.props.toggleSidebarMenu}
          >
            {menuLists}
          </SideMenu>
        );
      } else if (dataList.role === "super admin") {
        return (
          <SideMenu
            className="sidebar-content"
            toggleSidebarMenu={this.props.toggleSidebarMenu}
          >
            {menuLists}

            {/*  {menuLists[2]}
            {menuLists[3]}
            {menuLists[4]} */}
          </SideMenu>
        );
         } else if (dataList.role === "organization admin") {
          return (
            <SideMenu
              className="sidebar-content"
              toggleSidebarMenu={this.props.toggleSidebarMenu}
            >
              {menuLists[0]}
  
              {/*  {menuLists[2]}
              {menuLists[3]}
              {menuLists[4]} */}
            </SideMenu>
          );
        }
       else if (dataList.role === "organization user") {
        return (
          <SideMenu
            className="sidebar-content"
            toggleSidebarMenu={this.props.toggleSidebarMenu}
          >
            {menuLists[0]}
          </SideMenu>
        );
      } else {
        toastr.error("เกิดข้อผิดพลาดทางเทคนิค กรุณาติดต่อผู้ดูแลระบบ", toastrOptions);
        return <Redirect to={"login"} />;
      }
    }
  }
}

export default SideMenuContent;
