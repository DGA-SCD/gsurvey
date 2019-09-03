// import external modules
import React, { Fragment, Component } from "react";
import { Link,Redirect } from "react-router-dom";

import AuthService from '../../services/AuthService';
import {
   TabContent,
   TabPane,
   NavLink,
   Row,
   Col,
   Button,
   Form,
   Input,
   FormGroup,
   Card,
   CardHeader,
   CardBody,
   CardFooter
} from "reactstrap";
import classnames from "classnames";


import avatar_dga from "../../assets/img/portrait/medium/avatar_dga1.png";
import avatarm8 from "../../assets/img/portrait/medium/avatar-m-8.png";

import survey_bg from "../../assets/img/photos/intro2.jpg";
class UserProfile extends Component {

   constructor(props) {
      super(props);

      
      this.state = {
         dataList:[],
         name:"",
         
       
         user_id:"",
         activeTab: "2",
         redirectToReferrer: ''
      };
      const { history } = this.props;

      this.Auth = new AuthService();
   }

   
   

   toggle = tab => {
      if (this.state.activeTab !== tab) {
         this.setState({
            activeTab: tab
         });
      }
   };

   
    
   render() {

      console.log("render");
      let dataList = JSON.parse(localStorage.getItem("userData"));
      if (!this.Auth.loggedIn()) {
         return (<Redirect to={'login'}/>)
      }

    //  console.log('dfsfdfsfsfssfd--->'+this.Auth_checkStatus);
     
      // else{


      return (
         <Fragment>
            <Row>
               <Col xs="12" id="user-profile">
                  <Card className="profile-with-cover">
                     <div
                        className="card-img-top img-fluid bg-cover height-300"
                        style={{ background: `url("${survey_bg}") 50%` }}
                     />
                     <Row className="media profil-cover-details">
                        <Col xs="5">
                           <div className="align-self-start halfway-fab pl-3 pt-2">
                              {/* <div className="text-right">
                                 <h3 className="card-title text-white">{this.state.name} {this.state.surname}</h3>
                               
                              </div> */}
                             
                           </div>
                        </Col>
                        
                        <Col xs="2">
                           <div className="align-self-center halfway-fab text-center">
                              <Link to="/pages/user-profile" className="profile-image">
                                 <img
                                    src={avatar_dga}
                                    className="rounded-circle img-border gradient-summer width-100"
                                    alt="Card avatar"
                                 />
                              </Link>
                           </div>
                        </Col>
                        <Col xs="5">
                           <div className="align-self-start halfway-fab pl-3 pt-2">
                              <div className="text-right" >
                                 <h3 className="card-title text-white" style={{paddingRight:20}}>{dataList.name} {dataList.surname}</h3>
                               
                              </div>
                             
                           </div>
                        </Col>
                     </Row>
                   
                  </Card>
               </Col>
            </Row>

            <TabContent activeTab={this.state.activeTab}>
               
           
               <TabPane tabId="2">
                  
                  <Row>
                     <Col sm="12">
                        <Card>
                           <CardHeader>
                              <h5>ข้อมูลส่วนบุคคล</h5>
                           </CardHeader>
                           <CardBody>
                             
                              <Row>
                                 <Col xs="12" md="6" lg="4">
                                    <ul className="no-list-style">
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/useer-profile">ชื่อเล่น:</Link>
                                          </span>
                                          <span className="display-block overflow-hidden">{dataList.name}</span>
                                       </li>
                                       
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">ฝ่าย/ส่วน :</Link>
                                          </span>
                                          <span className="display-block overflow-hidden">{dataList.department}/{dataList.devision}</span>
                                       </li>
                                    </ul>
                                 </Col>
                                 <Col xs="12" md="6" lg="4">
                                    <ul className="no-list-style">
                                      
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">อีเมล:</Link>
                                          </span>
                                         
                                          <span className="display-block overflow-hidden">   {dataList.email}</span>
                                          
                                       </li>
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">รหัสพนักงาน:</Link>
                                          </span>
                                         
                                          <span className="display-block overflow-hidden">  {dataList.id}</span>
                                          
                                       </li>
                                    </ul>
                                 </Col>
                                 <Col xs="12" md="6" lg="4">
                                    <ul className="no-list-style">
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">เบอร์โทรศัพท์:</Link>
                                          </span>
                                          <span className="display-block overflow-hidden"> {dataList.tel}</span>
                                       </li>
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">ตำแหน่ง:</Link>
                                          </span>
                                          <span className="display-block overflow-hidden">{dataList.position}</span>
                                       </li>
                                       
                                    </ul>
                                 </Col>
                              </Row>
                             
                           </CardBody>
                        </Card>
                     </Col>
                     
                  </Row>
               </TabPane>
               {/* User Timeline */}

               
               {/* Photos */}
              
            </TabContent>
         </Fragment>
      );
      }
   //}
}

export default UserProfile;
