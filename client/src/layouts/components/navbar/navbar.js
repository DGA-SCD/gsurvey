// import external modules
import React, { Component } from "react";
import { Link , Redirect} from "react-router-dom";
import AuthService from '../../../services/AuthService';
import {
   Form,
   Media,
   Collapse,
   Navbar,
   Nav,
   NavItem,
   UncontrolledDropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
   // Moon,
   Mail,
   Menu,
   MoreVertical,
   Check,
   Bell,
   User,
   AlertTriangle,
   Inbox,
   Phone,
   Calendar,
   Lock,
   X,
   LogOut
} from "react-feather";
import NavbarSearch from "../../../components/search/Search";
import ReactCountryFlag from "react-country-flag";

import userImage from "../../../assets/img/portrait/small/avatar-s-1.png";
import userImage2 from "../../../assets/img/portrait/small/avatar-s-2.png";
import userImage3 from "../../../assets/img/portrait/small/avatar-s-3.png";
import userImage4 from "../../../assets/img/portrait/small/avatar-s-4.png";

class ThemeNavbar extends Component {
   handleClick = e => {
      this.props.toggleSidebarMenu("open");
   };
   constructor(props) {
      super(props);
      this.logout = this.logout.bind(this);
      this.toggle = this.toggle.bind(this);
      this.state = {
         isOpen: false,
         redirectToReferrer: false,
         datauser:''
      };
      this.Auth = new AuthService();
   }
   componentDidMount(){
      if (this.Auth.loggedIn()) {
         this.setState({redirectToReferrer: true});
        
       //  let datauser = this.Auth.getUserFeed();
        
        
     }else{
      return (<Redirect to={'login'}/>)
     }
   }
   toggle() {
      this.setState({
         isOpen: !this.state.isOpen
      });
   }
   logout(){
      
      
      localStorage.clear();
      this.setState({redirectToReferrer: false});
    }

   render() {
      
     
      return (
         <Navbar className="navbar navbar-expand-lg navbar-light bg-faded">
            <div className="container-fluid px-0">
               <div className="navbar-header">
                  <Menu
                     size={14}
                     className="navbar-toggle d-lg-none float-left"
                     onClick={this.handleClick.bind(this)}
                     data-toggle="collapse"
                  />
                  <Form className="navbar-form mt-1 float-left" role="search">
                     <NavbarSearch />
                  </Form>
                  {/* <Moon size={20} color="#333" className="m-2 cursor-pointer"/> */}
                  <MoreVertical
                     className="mt-1 navbar-toggler black no-border float-right"
                     size={50}
                     onClick={this.toggle}
                  />
               </div>

               <div className="navbar-container">
                  <Collapse isOpen={this.state.isOpen} navbar>
                     <Nav className="ml-auto float-right" navbar>
                       
                       

                        <UncontrolledDropdown nav inNavbar className="pr-1">
                           <DropdownToggle nav>
                              <img src={userImage} alt="logged-in-user" className="rounded-circle width-35" />
                           </DropdownToggle>
                           <DropdownMenu right>
                              <DropdownItem>
                                 <span className="font-small-3">
                                 
                                 {localStorage.getItem("userlogin")}<span className="text-muted">(Guest)</span>
                                 </span>
                              </DropdownItem>
                              <DropdownItem divider />

                              <Link to="/pages/user-profile" className="p-0">
                                 <DropdownItem>
                                    <User size={16} className="mr-1" /> My Profile
                                 </DropdownItem>
                              </Link>
                              
                              <DropdownItem divider />
                              
                              <Link to="/pages/login" onClick={this.logout}  className="p-0">
                                 <DropdownItem>
                                    <LogOut size={16} className="mr-1"  /> Logout
                                 </DropdownItem>
                              </Link>
                           </DropdownMenu>
                        </UncontrolledDropdown>
                     </Nav>
                  </Collapse>
               </div>
            </div>
         </Navbar>
      );
   }
}

export default ThemeNavbar;
