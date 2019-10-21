// import external modules
import React, { Component } from "react";
import { Link, Redirect, NavLink } from "react-router-dom";

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
                <NavLink to="/pages/survey" activeClassName="active">
                    <i className="menu-icon">
                        <CheckSquare size={18} />
                    </i>
                    <span className="menu-item-text">แบบสำรวจ</span>
                </NavLink>
            </SideMenu.MenuSingleItem>,
            //1 ผลสำรวจ 
            <SideMenu.MenuSingleItem>
                <NavLink to="/pages/surveyresult" activeClassName="active">
                    <i className="menu-icon">
                        <Copy size={18} />
                    </i>
                    <span className="menu-item-text">ผลสำรวจ</span>
                </NavLink>
            </SideMenu.MenuSingleItem>,
            //2 จัดการห้องพัก
            <SideMenu.MenuSingleItem>
                <NavLink to="/pages/summary" activeClassName="active">
                    <i className="menu-icon">
                        <Calendar size={18} />
                    </i>
                    <span className="menu-item-text">จัดการห้องพัก</span>
                </NavLink>
            </SideMenu.MenuSingleItem>,
            //3 จัดการค่าใช้จ่าย
            <SideMenu.MenuSingleItem>
                <NavLink to="/pages/billing" activeClassName="active">
                    <i className="menu-icon">
                        <Calendar size={18} />
                    </i>
                    <span className="menu-item-text">จัดการค่าใช้จ่าย</span>
                </NavLink>
            </SideMenu.MenuSingleItem>,

            //4 dashbard
            <SideMenu.MenuSingleItem>
                <NavLink to="/pages/dashboard" activeClassName="active">
                    <i className="menu-icon">
                        <PieChart size={18} />
                    </i>
                    <span className="menu-item-text">dashboard</span>
                </NavLink>
            </SideMenu.MenuSingleItem>,
            //5 สร้างแบบสำรวจ
            <SideMenu.MenuSingleItem>
                <NavLink to="/pages/SurveyCreator" activeClassName="active">
                    <i className="menu-icon">
                        <Layers size={18} />
                    </i>
                    <span className="menu-item-text">สร้างแบบสำรวจ</span>
                </NavLink>
            </SideMenu.MenuSingleItem>
        ];

        if (localStorage.getItem('token_local') === null) {

            return (<Redirect to={'login'} />)
        } else {


            if (JSON.parse(localStorage.getItem("userData") === undefined)) {
                return (<Redirect to={'login'} />)
            } else {

                let dataList = JSON.parse(localStorage.getItem("userData"));

                if (dataList.role === 'sadmin') {

                    return (
                        <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
                            {menuLists}
                        </SideMenu>
                    );
                }
                else if (dataList.role === 'admin') {
                    return (
                        <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
                            {menuLists[0]}
                            {menuLists[1]}
                            {menuLists[2]}
                            {menuLists[3]}
                            {menuLists[4]}
                        </SideMenu>
                    );
                }
                else if (dataList.role === 'user') {
                    return (
                        <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
                            {menuLists[0]}
                            {menuLists[1]}
                        </SideMenu>
                    );
                }
                else {
                    return (<Redirect to={'login'} />)
                }


            }

        }


    }
}

export default SideMenuContent;
