import React, { Component, Fragment, PureComponent } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { BACKEND_URL } from "../../services/AppConfig";

import DashboardAll from "./dashboard-all";
import DashboardByDepartment from "./dashboard-by-department";

class Dashboard extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>
             <Fragment>
                <Row className="row-eq-height">
                    <Col sm="12" md="12" xl="12">
                        <Card className="">
                            <CardBody className="pt-2 pb-0">
                                <DashboardAll/>
                            </CardBody>
                        </Card>
                    </Col>
                    </Row>
                <Row className="row-eq-height">
                    <Col sm="12" md="12" xl="12">
                        <Card className="">
                            <CardBody className="pt-2 pb-0">
                                <DashboardByDepartment/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
             </Fragment>
            </div>;
    }
}

export default Dashboard;
