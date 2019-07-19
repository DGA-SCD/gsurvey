// import external modules
import React, { Component } from "react";

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
   BarChart2,
   Calendar,
   Copy,
   Book,
   CheckSquare,
   LifeBuoy,
   Users
} from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";

class SideMenuContent extends Component {
   render() {
      return (
         <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
            <SideMenu.MenuMultiItems
               name="Dashboard"
               Icon={<Home size={18} />}
               ArrowRight={<ChevronRight size={16} />}
               collapsedSidebar={this.props.collapsedSidebar}
            >
               <NavLink to="/" exact className="item" activeclassname="active">
                  <span className="menu-item-text">eCommerce</span>
               </NavLink>
               <NavLink to="/analytics-dashboard" exact className="item" activeclassname="active">
                  <span className="menu-item-text">Analytics</span>
               </NavLink>
               <NavLink to="/sales-dashboard" exact className="item" activeclassname="active">
                  <span className="menu-item-text">Sales</span>
               </NavLink>
            </SideMenu.MenuMultiItems>
            
            <SideMenu.MenuSingleItem>
               <NavLink to="/pages/survey" activeClassName="active">
                  <i className="menu-icon">
                     <MessageSquare size={18} />
                  </i>
                  <span className="menu-item-text">แบบสำรวจ</span>
               </NavLink>
            </SideMenu.MenuSingleItem>
            
            <SideMenu.MenuSingleItem>
               <NavLink to="/pages/SurveyCreator" activeClassName="active">
                  <i className="menu-icon">
                     <MessageSquare size={18} />
                  </i>
                  <span className="menu-item-text">Admin</span>
               </NavLink>
            </SideMenu.MenuSingleItem>
           
            

            
           
         </SideMenu>
      );
   }
}

export default SideMenuContent;
