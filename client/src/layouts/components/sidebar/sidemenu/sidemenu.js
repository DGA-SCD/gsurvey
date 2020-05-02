// import external modules
import React, { Component } from "react";
import { Link, Redirect, NavLink } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import {
  Home,
  Mail,
  MessageSquare,
  ChevronRight,
  Aperture,
  Box,
  Edit,
  Grid,
  Layers,
  Sliders,
  Map,
  PieChart,
  BarChart2,
  Calendar,
  Copy,
  Book,
  CheckSquare,
  LifeBuoy,
  Users
} from "react-feather";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";

class SideMenuContent extends Component {
  render() {
    var menuLists = [
      //0 แบบสำรวจ
      <SideMenu.MenuSingleItem>
        <NavLink to="/pages/main" activeClassName="active">
          <i className="menu-icon">
            <CheckSquare size={18} />
          </i>
          <span className="menu-item-text">แบบสำรวจ</span>
        </NavLink>
      </SideMenu.MenuSingleItem>,
      //1
      <SideMenu.MenuSingleItem>
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
      } else if (dataList.role === "organization admin") {
        return (
          <SideMenu
            className="sidebar-content"
            toggleSidebarMenu={this.props.toggleSidebarMenu}
          >
            {menuLists[0]}
            {/*  {menuLists[1]}
            {menuLists[2]}
            {menuLists[3]}
            {menuLists[4]} */}
          </SideMenu>
        );
      } else if (dataList.role === "organization user") {
        return (
          <SideMenu
            className="sidebar-content"
            toggleSidebarMenu={this.props.toggleSidebarMenu}
          >
            {menuLists[0]}
          </SideMenu>
        );
      } else {
        return <Redirect to={"login"} />;
      }
    }
  }
}

export default SideMenuContent;
