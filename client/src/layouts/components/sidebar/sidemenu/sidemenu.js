// import external modules
import React, { Component } from "react";
import { Link,Redirect,withRouter } from "react-router-dom";
import login from '../../../../views/pages/login';
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
   constructor(props) {
      super(props);
  
     
      this.state = {
       
        redirectToReferrer: false
     };
      
      //this.Auth = new AuthService();
   }

   componentDidMount(){
      fetch("http://164.115.17.101:8082/v1/survey/questions/seminar-01", {
         method: 'get',
         crossDomain: true,
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           "userid": localStorage.getItem("session_userid"),
           "token": localStorage.getItem("token_local")
         // "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
         },
       
       })

       .then((response) => {
         console.log(response.status); 
             if (response.status !== 200) {
               //this.setState({redirectToReferrer:false});
             console.log('chkredirect==>'+this.state.redirectToReferrer);
          //   this.props.history.push('/login');
           }
               return response.json();
         })
     
   
       .then(res => {
      
         if(res.data){
           this.setState({redirectToReferrer:true});
          
           this.setState({json:(res.data)});
           console.log("componentDidMount 2");
           }
       })
   }
   render() {
      if (localStorage.getItem('token_local') === null || this.state.redirectToReferrer === false) {
         console.log('cannto login')
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
