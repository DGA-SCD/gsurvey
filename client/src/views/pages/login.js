// import external modules
import React, { Component } from "react";
import { NavLink,Redirect } from "react-router-dom";
import {PostData} from '../../services/PostData';
import {
   Row,
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



class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
        userid: '',
       
        password: '',
        redirectToReferrer: false,
        errors: {
         userid: '',
        
         password: '',
        }
      };
    }

    handleUserIdChange = event => {
      this.setState({ userid: event.target.value })
    
    };
    handlePassChange = event => {
      this.setState({ password: event.target.value })
    
    };
     maxLengthCheck = (object) => {
      if (object.target.value.length > object.target.maxLength) {
       object.target.value = object.target.value.slice(0, object.target.maxLength)
        }
      }
   
  
   handleSubmit = event => {
      event.preventDefault();
      const { userid, password } = this.state;
      if(this.state.userid && this.state.password){
         
         PostData('login',this.state).then((result) => {
            let responseJson = result;
            console.log(responseJson.userData);
            if(responseJson.userData){         
              sessionStorage.setItem('userData',JSON.stringify(responseJson));
              this.setState({redirectToReferrer: true});
            }
            
           });
      }
      // alert(`Your state values: \n 
      //         name: ${userid} \n 
      //         email: ${password}`);

      //       //   fetch('/api/authenticate', {
      //       //    method: 'POST',
      //       //    body: JSON.stringify(this.state),
      //       //    headers: {
      //       //      'Content-Type': 'application/json'
      //       //    }
      //       //  })
      //       //  .then(res => {
      //       //    if (res.status === 200) {
      //       //      this.props.history.push('/');
      //       //    } else {
      //       //      const error = new Error(res.error);
      //       //      throw error;
      //       //    }
      //       //  })
      //       //  .catch(err => {
      //       //    console.error(err);
      //       //    alert('Error logging in please try again');
      //       //  });
    };

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
                        <Form className="pt-2" id="loginForm" method="post" onSubmit={this.handleSubmit}>
                          
                           <FormGroup>
                               <Col md="12">
                               <input type="number"  
                               name='userid'    
                               className="form-control" 
                               pattern="[0-9]*"   
                               placeholder="รหัสพนักงาน" 
                             //  onInput={this.maxLengthCheck}   
                               onChange={this.handleUserIdChange}
                               defaultValue="Search..."
                           //    maxLength="6"  
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
                                 
                                   onChange={this.handlePassChange} 
                                   defaultValue=""
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
