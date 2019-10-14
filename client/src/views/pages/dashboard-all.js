import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import Highcharts from 'highcharts'
import highchartsdata from "highcharts/modules/data";
import HighchartsReact from 'highcharts-react-official'
import { BACKEND_URL } from "../../services/AppConfig";

class DashboardAll extends Component {
    constructor(props) {
        super(props);
        highchartsdata(Highcharts);
        this.state = { 
            data: ""
        }
    }

    componentDidMount(){
        fetch(BACKEND_URL + '/v1/stats/completesurvey').then( res => res.json())
        .then( result => {
            console.log( result.data );
            var data = "row,จำนวน\n";
            data += "ทำแบบสำรวจแล้ว" + ',' + result.data.Done + '\n';
            data += "ยังไม่ทำแบบสำรวจ" + ',' + result.data.NotDone + '\n';
            this.setState({ 
                data: data
            })
        } )
        .catch( err => console.log(err))
    }

    render() {
        var options = {
            title: {
                "text": "สรุปการทำแบบสำรวจ"
              },
            chart: {
                inverted: true,
                polar: true,
                type: "pie",
                "options3d": {
                    "enabled": true,
                    "alpha": 45,
                    "beta": 0
                  },
            },
            subtitle: {
                "text": ""
              },
            colors: [
                "#011627",
                "#E71D36"
              ],
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    depth: 35,
                    cursor: "pointer",
                    innerSize: "60%"
                },
                series: {
                    dataLabels: {
                      "enabled": true
                    },
                    animation: true,
                    states: {
                      "inactive": {}
                    }
                }
            },
            xAxis:{
                title: {
                    text: 'ส่วนงาน',
                    style: {
                        fontWeight: 'normal',
                        color: '#666666'
                    },
                },
            },
            yAxis:
            {
                title: {
                    text: 'จำนวนผู้ทำแบบสำรวจ',
                    style: {
                        fontWeight: 'normal',
                        color: '#666666'
                    },
                },
            },
            data: {
                csv:  this.state.data,
                switchRowsAndColumns: false,
                firstColumnAsNames: false,
                firstRowAsNames: true,
            },
            credits: {
                enabled: false
              },
        }
       
        if( this.state.data == "" ){
           return <div>Loading...</div>;
       } else { 
            return <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    immutable = { false }
                    updateArgs = { [true, true, true] }
                    ref={this.chartRef}
                    allowChartUpdate={true}
                />
            </div>
       }
    }
}

export default DashboardAll;
