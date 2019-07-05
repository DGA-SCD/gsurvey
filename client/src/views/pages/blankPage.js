// import external modules
import React, { Component, Fragment } from "react";
import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import { Row, Col, Card, CardBody, CardTitle, Badge } from "reactstrap";
class blankPage extends Component {
   render() {
      return (
         <Fragment>
           <Row>
                <ContentHeader>Blank Page</ContentHeader>
            <ContentSubHeader>A sample blank page to start with</ContentSubHeader>
           </Row>
          
         </Fragment>
      );
   }
}

export default blankPage;
