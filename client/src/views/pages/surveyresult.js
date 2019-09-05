import React, { Component, Fragment } from "react";
import { Link,Redirect } from "react-router-dom";
import { Card, CardBody, CardTitle, Row, Col, Button, Form, CustomInput, FormGroup, Label, Input } from "reactstrap";
import AuthService from '../../services/AuthService';
import "../../assets/scss/views/pages/survey/survey.css";
import {
   X,
   CheckSquare,
   User,
   Info,
   FileText,
   Mail
} from "react-feather";

import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import $ from "jquery";
window["$"] = window["jQuery"] = $;

function Follower() 
{ 
   // if(props.isfollwer)
 return <h1>Welcome User</h1>; 
  // console.log(props.isfollwer);
} 


class surveyresult extends Component {


   
   constructor(props) {
      super(props);
     
      this.state = {
         isfollwer : [], 
        dataList: [],
        userList:[],
        issurvey:null,
        shirtmore:[],
        redirectToReferrer: false,
       
        totalcostshirt : 0,
        totalcostfollow : 0
      };
      this.Auth = new AuthService();
    }

   
   
    componentDidMount() {
     
       fetch("http://164.115.17.101:8082/v1/survey/answers/"+ localStorage.getItem("session_userid")+ "/seminar-01/1", {
         method: 'get',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           "userid": localStorage.getItem("session_userid"),
          "token": localStorage.getItem("token_local")
         //  "token" : "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
         },
       
       })
      
       .then(response => {
         console.log(response.status); 
         if (response.status !== 200) {
          this.setState({redirectToReferrer:false});
         console.log('chkredirect==>'+this.state.redirectToReferrer);
      
       }
           return response.json();
       })

       .then(res => {
     //  .then(function(res) {
        if(res.code === 401000){
            localStorage.clear();
            this.setState({redirectToReferrer: false});
            this.props.history.push('/pages/login');
        }else{
         if(res.data){
            console.log(res.data);
                    console.log('dfsfsfddddddddds-->'+res.data.surveyresult.totalQuantity);
                        this.setState({
                              dataList:res.data.surveyresult,
                              isfollwer:res.data.surveyresult.detailfollower,
                              shirtmore:res.data.surveyresult.items,
                              totalcostshirt:  res.data.surveyresult.totalCost === undefined ? '0':res.data.surveyresult.totalCost ,
                              totalcostfollow : res.data.surveyresult.totalQuantity === undefined ? '0':res.data.surveyresult.totalQuantity ,
            
            
                              //  number1 = parseInt(this.state.totalcostshirt , 10 ),
                              //  number2 = parseInt(this.state.totalcostfollow , 10 ) ,
                           // var num3 = number1 + number2;
                              issurvey:true
                        });
            }else{
               this.setState({
                                    issurvey:false
                                 
                              });
            }
        }
       });


   
     
    
    }

  
    renderUser(_render) {

      switch(_render){
         case "readytogo":

        
            if(this.state.dataList.readytogo === 'Yes')
               return<div>ไป</div>;
            else
               return<div>ไม่ไป</div>;
          
          break;
         case "howtogo":
            if(this.state.dataList.howtogo === '1')
                  return<div>รถบัส</div>;
            
            if(this.state.dataList.howtogo === '2')
                  return<div>ขับรถไปเอง</div>;
            else return <div>-</div>

            break;
         case "typeofsleep":
            if(this.state.dataList.typeofsleep === 'roommate')
                  return<div>นอนคู่</div>;
            
            if(this.state.dataList.typeofsleep === 'family')
                  return<div>นอนกับครอบครัว</div>; 
            if(this.state.dataList.typeofsleep === 'random')
                  return<div>แล้วแต่ทีมงานจัดเลย</div>;
            else return <div>-</div>

            break;
         case "food":
            if(this.state.dataList.food === '1')
                  return<div>ทานได้ทุกอย่าง</div>;
            
            if(this.state.dataList.typeofsleep === '2')
                  return<div>ฮาลาล</div>; 
            if(this.state.dataList.typeofsleep === '3')
                  return<div>มังสวิรัติ</div>;
            else return <div>-</div>

            break;
         case "follower":
            if(this.state.dataList.follower === 'Yes')
                  return<div>มีผู้ติดตาม</div>;
            
            if(this.state.dataList.follower === 'No')
                  return<div>ไม่มีผู้ติดตาม</div>; 
            break;
         case "datetoback":
            if(this.state.dataList.datetoback === '1')
                  return<div>12 ธันวาคม 2562</div>;
            
            if(this.state.dataList.datetoback === '2')
                  return<div>13 ธันวาคม 2562</div>; 
            if(this.state.dataList.datetoback === '3')
                  return<div>14 ธันวาคม 2562</div>;
            break;
         case "datetogo":
            if(this.state.dataList.datetogo === '1')
                  return<div>12 ธันวาคม 2562</div>;
            
            if(this.state.dataList.datetogo === '2')
                  return<div>13 ธันวาคม 2562</div>; 
            if(this.state.dataList.datetogo === '3')
                  return<div>14 ธันวาคม 2562</div>;
            break;



            
            default:
            return null;
         }
        
         
      }
   
        
        

      // if (!this.state.dataList.readytogo) return;
      //    if (this.state.dataList.readytogo === 'Yes') {
      //      return<div>ไป</div>;
      //    }
      //    if (this.state.dataList.readytogo === 'No') {
      //       return<div>ไม่ไป</div>;
      //     }
      //     if (this.state.dataList.howtogo === 'รถบัส') {
      //       return<div>ไป</div>;
      //     }
      //     if (this.state.dataList.howtogo === 'ขับรถไปเอง') {
      //        return<div>ไม่ไป</div>;
      //      }
      //    return null
      Follwer(state,value) {
         console.log(state);
         console.log(value);
         console.log('total--->'+this.state.totalcost);
         console.log('Notification');
         return (
          
             (function() {
               switch(state) {
                 case 'follwer_food':
                  if(value === '1'){
                     return '/ ทานได้ทุกอย่าง';
                  }
                  if(value === '2'){
                     return '/ อาหารฮาลาล';
                  }
                  if(value === '3'){
                     return '/ อาหารมังสวิรัติ';
                  }
                  break;
                 case 'follwermakeinsurance':
                   return<div>wwwwไป</div>;
                   break;
                 default:
                   return null;
               }
             })
           
         );
       }
      renderView() {
         if(this.state.dataList.readytogo === "Yes" ) {
            if(this.state.dataList.follower === "No" ) {
            return <div></div>
            } else  {
               const items = this.state.isfollwer.map((item, key) =>
                     <li key={key.toString()}>
                     <div>ผู้ติดตามคนที่ {key + 1}</div>
                     <div><b>ชื่อ - สกุล :</b>{item.follwer_name} / บัตรประจำตัวประชน : {item.follwerid} / อายุ  {item.follwer_age}</div>
                     
                     <div> {item.follwer_jointoeat === '1'? 'ทานอาหารด้วย':'ไม่ทานอาหาร'} {this.Follwer('follwer_food',item.follwer_food)} </div>
                     <div> {item.follwermakeinsurance === '1'? 'ทำประกัน':'ไม่ทำประกัน'} {item.follwermakeinsurance === '1'? '/ ผู้รับผลประโยชน์กรมธรรม์ :' + item.follwer_insurance + '/ มีความสัมพันธ์เป็น : '+ item.follwer_insurance_relation:''}</div>
                     <div>  โรคประจำตัว : {item.follower_disease === ''? '-':item.follower_disease}</div>
                     </li>
               

            
               );
               return <ul>{items}</ul>
            } 
         }else{
            return <div></div>
         }
       }
       Moreshirt() {
         if(this.state.dataList.shirt_add_more === "No") {
           return <div>ไม่สั่งเสื้อเพิ่ม</div>
         } else  {
          
            const items_shirt = this.state.shirtmore.map((item, key) =>
                   <li key={key.toString()}>
                  <div>เสื้อตัวที่ {key + 1}</div>
                  <div><b>ไซส์ :</b>{item.shirt_more} / จำนวน : {item.quantity_shirt} / ราคา  {item.total}</div>
                  
                 
                  </li>
            

         
            );
            return <ul>{items_shirt}</ul>
         } 
       }
      renderSurvey(){
         if(this.state.issurvey) {
          
             
            var number1 = parseInt(this.state.totalcostshirt , 10 );
            var number2 = parseInt(this.state.totalcostfollow , 10 ) ;
            var totalall = number1 + number2;

        let input 
        return input = 
        <div>
            <FormGroup row>
            <Label  className = "summary_result_lable" sm={3}>ไปร่วมงานสัมมนากับเรา </Label>
            <Col sm={9}>
            {this.renderUser("readytogo")}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}>เลือกการเดินทาง :</Label>
            <Col sm={9}>
            {this.renderUser("howtogo")}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}>ร่วมสัมมนาตั้งแต่วันที่ - ถึงวันที่</Label>
            <Col sm={9}>
            {this.renderUser("datetogo")}-{this.renderUser("datetoback")}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}>เลือกประเภทการนอน</Label>
            <Col sm={9}>
            {this.renderUser("typeofsleep")}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}> เลือกเพื่อนร่วมห้องเป็น</Label>
            <Col sm={9}>
            {this.state.dataList.partner}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label className = "summary_result_lable"  sm={3}>ประเภทอาหาร</Label>
            <Col sm={9}>
            {this.renderUser("food")}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}> โรคประจำตัว/แพ้อาหาร</Label>
            <Col sm={9}>
            {this.state.dataList.follower_disease}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable" sm={3}> ผู้รับผลประโยชน์กรมธรรม์</Label>
            <Col sm={9}>
            {this.state.dataList.insurance_benefit} /โทร:  {this.state.dataList.employee_contact} /มีความสัมพันธ์เป็น:  {this.state.dataList.insurance_benefit_relation}
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}> ผู้ติดตาม</Label>
            <Col sm={9}>
            {this.renderUser("follower")}
             <div>{this.renderView()}</div>

           
            </Col>
         </FormGroup>
         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}> สั่งเสื้อสัมมนา</Label>
            <Col sm={9}>
           ไซส์เสื้อ   {this.state.dataList.shirt}
           

           
            </Col>
         </FormGroup>

         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}> สั่งเสื้อสัมมนาเพิ่ม</Label>
            <Col sm={9}>
            <div>{this.Moreshirt()}</div>
           

           
            </Col>
         </FormGroup>

         <FormGroup row>
            <Label  className = "summary_result_lable"  sm={3}> ค่าใช้จ่ายทั้งหมด</Label>
            <Col sm={9}>
            {(this.state.totalcostfollow)} +  {this.state.totalcostshirt} = {totalall} THB.
            </Col>
         </FormGroup>
      </div>
         }else{
            return <div>ยังไม่ได้ทำแบบสำรวจ</div>
         }

       }

   render() {
      let userList = JSON.parse(localStorage.getItem("userData"));
      if (!this.Auth.loggedIn()) {
         return (<Redirect to={'login'}/>)
      }
      return (

         <Fragment>
           
           
            <Row>
               <Col sm="12">
                  <Card>
                     <CardBody>
                       
                          <div className="px-3">						
                           <Form className="form-bordered form-horizontal">
                              <div className="form-body">
                                 <h4 className="form-section"><Info size={20} color="#212529" />ข้อมูลส่วนบุคคล</h4>
                                 <Row>
                                    <Col md="6">
                                       <FormGroup row>
                                          <Label for="userinput1"  className = "summary_result_lable" sm={3}>ชื่อ สกุล:</Label>
                                          <Col sm={9}>
                                        {userList.name}  {userList.surname}
                                          </Col>
                                       </FormGroup>
                                    </Col>
                                    <Col md="6">
                                       <FormGroup row>
                                          <Label for="userinput2"   className = "summary_result_lable" sm={3}>รหัส:</Label>
                                          <Col sm={9}>
                                          {userList.id}
                                          </Col>
                                       </FormGroup>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col md="6">
                                       <FormGroup row className="last">
                                          <Label for="userinput3"  className = "summary_result_lable" sm={3}>ตำแหน่ง:</Label>
                                          <Col sm={9}>
                                          {userList.position}
                                          </Col>
                                       </FormGroup>
                                    </Col>
                                    <Col md="6">
                                       <FormGroup row className="last">
                                          <Label for="userinput4" className = "summary_result_lable" sm={3}>ฝ่าย/แผนก:</Label>
                                          <Col sm={9}>
                                          {userList.department}/ {userList.devision}
                                          </Col>
                                       </FormGroup>
                                    </Col>
                                 </Row>

                                
                                 <h4 className="form-section"><Mail size={20} color="#212529" /> รายละเอียดงานสัมมนา</h4>

                              
                              {this.renderSurvey()}
                                
                              </div>
                              
                              <div className="form-actions right">
                                 {/* <Button color="warning" className="mr-1"  component={ Redirect } to="/survey" >
                                    <X size={16} color="#FFF" /> แก้ไข
                                 </Button> */}
                                 <Link to="/pages/survey">
                                 <Button color="warning" className="mr-1">
                                 <X size={16} color="#FFF" /> แก้ไข
                                 </Button>
                              </Link>
                              </div>
                           </Form>

                        </div>

                        
                     </CardBody>
                  </Card>
               </Col>
            </Row>

         
         </Fragment>
      );
    
   }
}

export default surveyresult;