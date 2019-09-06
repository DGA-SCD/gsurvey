// import external modules
import React, { Component } from "react";
import { Link,Redirect } from "react-router-dom";

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
      if (localStorage.getItem('token_local') === null ) {
       
         return (<Redirect to={'login'}/>)
      }
      let dataList = JSON.parse(localStorage.getItem("userData"));
      if(dataList.role === 'admin'){
      return (
         <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
           
            
            <SideMenu.MenuSingleItem>
               <NavLink to="/pages/survey" activeClassName="active">
                  <i className="menu-icon">
                     <CheckSquare size={18} />
                  </i>
                  <span className="menu-item-text">แบบสำรวจ</span>
               </NavLink>
            </SideMenu.MenuSingleItem>
            
            <SideMenu.MenuSingleItem>
               <NavLink to="/pages/SurveyCreator" activeClassName="active">
                  <i className="menu-icon">
                     <Layers size={18} />
                  </i>
                  <span className="menu-item-text">Create SurveyForm</span>
               </NavLink>
            </SideMenu.MenuSingleItem>
            }
            <SideMenu.MenuSingleItem>
               <NavLink to="/pages/summary" activeClassName="active">
                  <i className="menu-icon">
                     <MessageSquare size={18} />
                  </i>
                  <span className="menu-item-text">Datatable</span>
               </NavLink>
            </SideMenu.MenuSingleItem>
            <SideMenu.MenuSingleItem>
               <NavLink to="/pages/surveyresult" activeClassName="active">
                  <i className="menu-icon">
                     <Copy size={18} />
                  </i>
                  <span className="menu-item-text">ผลสำรวจ</span>
               </NavLink>
            </SideMenu.MenuSingleItem>
            

            
           
         </SideMenu>
      );
      }
      if(dataList.role === 'user'){
         return (
            <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
              
               
               <SideMenu.MenuSingleItem>
                  <NavLink to="/pages/survey" activeClassName="active">
                     <i className="menu-icon">
                        <CheckSquare size={18} />
                     </i>
                     <span className="menu-item-text">แบบสำรวจ</span>
                  </NavLink>
               </SideMenu.MenuSingleItem>
               
              
               
               <SideMenu.MenuSingleItem>
                  <NavLink to="/pages/surveyresult" activeClassName="active">
                     <i className="menu-icon">
                        <Copy size={18} />
                     </i>
                     <span className="menu-item-text">ผลสำรวจ</span>
                  </NavLink>
               </SideMenu.MenuSingleItem>
               
   
               
              
            </SideMenu>
         );
         }
   }
}

export default SideMenuContent;
