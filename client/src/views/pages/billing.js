import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import withRequest from "../../services/withRequest";
import Box from '@material-ui/core/Box';
import MaterialTable from "material-table";
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';

import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { fontSize } from '@material-ui/system';
import "../../assets/scss/views/pages/survey/survey.css";
import { BACKEND_URL } from "../../services/AppConfig";
import AuthService from '../../services/AuthService';
// import withRequest from '../../services/withRequest';
class Billing extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            columns: [],
            redirect: true


        };

        this.Auth = new AuthService();
        this.intervalID = setInterval(() => this.Auth.IsAvailable(), 10000);
    }
    componentWillUnmount() {

        clearTimeout(this.intervalID);
    }

    render() {
        console.log('result:::' + this.Auth.loggedIn())
        console.log("requestFailed:::" + this.props.requestFailed)
        if (this.props.requestFailed) {
            return (<Redirect to={'login'} />)
        }
        if (this.props.result.data) {

            return (

                <MaterialTable
                    title="จัดการค่าใช้จ่าย"
                    columns={this.props.result.data.columns}
                    data={this.props.result.data.data}

                    options={{
                        sorting: true,
                        grouping: true,
                        exportButton: true,
                        exportAllData: true,
                        // paginationType: "stepped",
                        pageSize: 10,
                        pageSizeOptions: [25, 50, 100],
                        headerStyle: {
                            backgroundColor: '#fd7e14',
                            color: '#FFF',
                            font: "Athiti !important"
                        },
                        rowStyle: {
                            font: "Athiti !important"
                        }
                    }}
                />
            )

        }
        return <div>Loading...</div>;
    }
}
//export default withRequest('https://jsonplaceholder.typicode.com/users')(Result)
export default withRequest(BACKEND_URL + '/v1/reports/billing')(Billing)