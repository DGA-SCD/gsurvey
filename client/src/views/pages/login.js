// import external modules
//https://www.skptricks.com/2018/06/simple-form-validation-in-reactjs-example.html
import React, { Component } from "react";
import { NavLink,Redirect } from "react-router-dom";
import {PostData} from '../../services/PostData';

import {toastr} from 'react-redux-toastr';
import {
   Row,
   Alert,
   Col,
   Input,
   Form,
   FormGroup,
   Button,
   Label,
   Card,   
   CardBody,
   CardFooter
} from "reactstrap";
const toastrOptions = {
   timeOut: 3000, // by setting to 0 it will prevent the auto close
   position: 'top-right',
   showCloseButton: true, // false by default
   closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
   progressBar: false,
 }
 

class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
        userData : [],
        userid: '',
       session_userid : '',
       visible: false,
        password: '',
        redirectToReferrer: false,
        useridError: false,
        passError: false,
        errors: {
         userid: '',
        
         password: '',
        }
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      
    }

    onKeyPress(event) {
      const keyCode = event.keyCode || event.which;
      const keyValue = String.fromCharCode(keyCode);
       if (/\+|-/.test(keyValue))
         event.preventDefault();
     }

 

    handlePassChange = event => {
      this.setState({ password: event.target.value })
      this.setState({ passError: false });
    
    };
    handleUseridChange = event => {
      this.setState({ userid: event.target.value })
      this.setState({ useridError: false });
    
    };

     maxLengthCheck = (object) => {
      if (object.target.value.length > object.target.maxLength) {
       object.target.value = object.target.value.slice(0, object.target.maxLength)
        }
      }
   
   
   validateForm() {

      const { userid, password} = this.state;
      let errors = {};
      let formIsValid = true;

      if(userid.length !== 6){
        formIsValid = false;
        toastr.error( 'Error','Incorrect UserID',toastrOptions)
      }

      

      
      if (!password) {
        formIsValid = false;
        toastr.error( 'Error','Incorrect UserIDdddd',toastrOptions)
      }


      this.setState({
        errors: errors
      });
      return formIsValid;


    }

    handleSubmit(e) {
      e.preventDefault();
      if (this.validateForm()) {
         
         
          console.log(this.state.userid);
          console.log(this.state.password);
         PostData('login',this.state).then((result) => {
            let responseJson = result;
            console.log(responseJson.userData);
            if(responseJson.userData){         
              sessionStorage.setItem('userData',JSON.stringify(responseJson.userData));
              sessionStorage.setItem('session_userid',JSON.stringify(responseJson.userData.userid));
              
              this.setState({redirectToReferrer: true});
            }
            
         });
      }else{
         alert("cannot submitted");
      }

    }
   
   

   
   render() {
     
      const {errors} = this.state;
      if (this.state.redirectToReferrer) {
         return (<Redirect to={'user-profile'}/>)
       }
      
       if(sessionStorage.getItem('userData')){
         return (<Redirect to={'user-profile'}/>)
       }

   
      return (
         
         <div className="container">
          
            <Row className="full-height-vh">
          
               <Col xs="12" className="d-flex align-items-center justify-content-center">
                  <Card className="gradient-indigo-purple text-center width-400">
                
                     <CardBody>
                        <h2 className="white py-4">Login</h2>
                        {/* <Alert
                              color="danger"
                              isOpen={this.state.visible}
                              toggle={this.onDismiss}
                              className={this.state.visible?'fadeIn':'fadeOut'}
                              >
                           {this.state.useridError}
                           </Alert> */}
                        <Form className="pt-2" id="loginForm" method="post" onSubmit={this.handleSubmit}>
                        <div>
                         
                           </div>
                           <FormGroup>
                               <Col md="12">
                               <input type="number"  
                               name='userid'    
                               onKeyPress={this.onKeyPress.bind(this)}
                               //onKeyDown={e => /[\+\-\.\,]$/.test(e.key) && e.preventDefault()}
                               className="form-control" 
                            
                               placeholder="รหัสพนักงาน" 
                              onInput={this.maxLengthCheck}   
                              value={this.state.userid}
                              //onBlur={this.handleChange}
                               onChange = {this.handleUseridChange}
                             
                               maxLength="6"  
                               required
                           />
                              
                              </Col> 
                           </FormGroup>
                           <FormGroup>
                              <Col md="12">
                                 <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    id="password"
                                    placeholder="xxAug19xx"
                                    value={this.state.password}
                                    onChange = {this.handlePassChange}
                                   // onBlur={this.handleChange}
                               
                                   
                                    required
                                 />
                              </Col>
                           </FormGroup>
                          
                          
                           <FormGroup>
                              <Row>
                                 <Col md="12">
                                    <div className="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0 ml-3">
                                       <Input
                                          type="checkbox"
                                          className="custom-control-input"
                                          checked={this.state.isChecked}
                                          onChange={this.handleChecked}
                                          id="rememberme"
                                       />
                                       <Label className="custom-control-label float-left white" for="rememberme">
                                          Remember Me
                                       </Label>
                                    </div>
                                 </Col>
                              </Row>
                           </FormGroup>
                           <FormGroup>
                              <Col md="12">
                                 <Button type="submit" color="danger" block className="btn-pink btn-raised">
                                    Login
                                 </Button>
                                 <Button type="button" color="secondary" block className="btn-raised">
                                    Cancel
                                 </Button>
                              </Col>
                           </FormGroup>
                        </Form>
                     </CardBody>
                     <CardFooter>
                       
                     </CardFooter>
                  </Card>
               </Col>
            </Row>
         </div>
      );
   }
}

export default Login;
