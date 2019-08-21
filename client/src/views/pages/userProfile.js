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

// import internal(own) modules
import gallery1 from "../../assets/img/gallery/1.jpg";
import gallery2 from "../../assets/img/gallery/2.jpg";
import gallery3 from "../../assets/img/gallery/3.jpg";
import gallery4 from "../../assets/img/gallery/4.jpg";
import gallery5 from "../../assets/img/gallery/5.jpg";
import gallery6 from "../../assets/img/gallery/6.jpg";
import gallery7 from "../../assets/img/gallery/7.jpg";
import gallery8 from "../../assets/img/gallery/8.jpg";
import gallery9 from "../../assets/img/gallery/9.jpg";
import gallery10 from "../../assets/img/gallery/10.jpg";
import gallery11 from "../../assets/img/gallery/11.jpg";
import gallery12 from "../../assets/img/gallery/12.jpg";
import gallery13 from "../../assets/img/gallery/13.jpg";
import gallery14 from "../../assets/img/gallery/14.jpg";
import gallery15 from "../../assets/img/gallery/15.jpg";
import gallery16 from "../../assets/img/gallery/16.jpg";

import avatarm8 from "../../assets/img/portrait/medium/avatar-m-8.png";
import avatarS3 from "../../assets/img/portrait/small/avatar-s-3.png";
import avatarS5 from "../../assets/img/portrait/small/avatar-s-5.png";
import avatarS6 from "../../assets/img/portrait/small/avatar-s-6.png";
import avatarS9 from "../../assets/img/portrait/small/avatar-s-9.png";
import avatarS11 from "../../assets/img/portrait/small/avatar-s-11.png";
import avatarS12 from "../../assets/img/portrait/small/avatar-s-12.png";
import avatarS14 from "../../assets/img/portrait/small/avatar-s-14.png";
import avatarS16 from "../../assets/img/portrait/small/avatar-s-16.png";
import avatarS18 from "../../assets/img/portrait/small/avatar-s-18.png";
import photo6 from "../../assets/img/photos/06.jpg";
import photo7 from "../../assets/img/photos/07.jpg";
import photo8 from "../../assets/img/photos/08.jpg";
import photo9 from "../../assets/img/photos/09.jpg";
import photo14 from "../../assets/img/photos/14.jpg";

class UserProfile extends Component {

   constructor(props) {
      super(props);

      
      this.state = {
         dataList:[],
         name:"",
         
         test :"ssss",
         user_id:"",
         activeTab: "2",
         redirectToReferrer: false
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

   componentDidMount(){
      this.getUserFeed();
    }
   componentWillMount() {
      console.log('componentwillount');
      let chk = this.Auth.loggedIn();
      console.log(chk);
      if (this.Auth.loggedIn()) {
        
         this.setState({redirectToReferrer: true});
         // return (<Redirect to={'user-profile'}/>)
         }else{
            this.props.history.push('/login')
           // this.setState({redirectToReferrer: false});
         }
     
   

     }
   
     getUserFeed() {
      console.log("getUserFeed");
       let dataList = JSON.parse(localStorage.getItem("userData"));
     
       
       console.log(dataList);
       console.log(dataList);
       this.setState({
          name:dataList.name,
          surname:dataList.surname,
          nickname:dataList.nickName,
          birthday:dataList.birthday,
          email:dataList.email,
          telephone:dataList.tel,
          position:dataList.position,
          department:dataList.department,
          section:dataList.devision,
          userid:dataList.id
       });
      
    }


   render() {

      console.log("render");
      
      if (!this.state.redirectToReferrer) {
         return (<Redirect to={'login'}/>)
       }
      else{


      return (
         <Fragment>
            <Row>
               <Col xs="12" id="user-profile">
                  <Card className="profile-with-cover">
                     <div
                        className="card-img-top img-fluid bg-cover height-300"
                        style={{ background: `url("${photo14}") 50%` }}
                     />
                     <Row className="media profil-cover-details">
                        <Col xs="5">
                           <div className="align-self-start halfway-fab pl-3 pt-2">
                              <div className="text-left">
                                 <h3 className="card-title text-white">{this.state.name} {this.state.surname}</h3>
                               
                              </div>
                             
                           </div>
                        </Col>
                        <Col xs="2">
                           <div className="align-self-center halfway-fab text-center">
                              <Link to="/pages/user-profile" className="profile-image">
                                 <img
                                    src={avatarm8}
                                    className="rounded-circle img-border gradient-summer width-100"
                                    alt="Card avatar"
                                 />
                              </Link>
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
                                          <span className="display-block overflow-hidden">{this.state.nickname}</span>
                                       </li>
                                       
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">ฝ่าย/ส่วน :</Link>
                                          </span>
                                          <span className="display-block overflow-hidden">{this.state.department}/{this.state.section}</span>
                                       </li>
                                    </ul>
                                 </Col>
                                 <Col xs="12" md="6" lg="4">
                                    <ul className="no-list-style">
                                      
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">อีเมล:</Link>
                                          </span>
                                          <Link to="/pages/user-profile" className="display-block overflow-hidden">
                                          {this.state.email}
                                          </Link>
                                       </li>
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">รหัสพนักงาน:</Link>
                                          </span>
                                          <Link to="/pages/user-profile" className="display-block overflow-hidden">
                                          {this.state.userid}
                                          </Link>
                                       </li>
                                    </ul>
                                 </Col>
                                 <Col xs="12" md="6" lg="4">
                                    <ul className="no-list-style">
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">เบอร์โทรศัพท์:</Link>
                                          </span>
                                          <span className="display-block overflow-hidden"> {this.state.telephone}</span>
                                       </li>
                                       <li className="mb-2">
                                          <span className="text-bold-500 primary">
                                             <Link to="/pages/user-profile">ตำแหน่ง:</Link>
                                          </span>
                                          <span className="display-block overflow-hidden">{this.state.position}</span>
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
   }
}

export default UserProfile;
