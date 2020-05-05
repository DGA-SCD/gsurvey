import React, { Component } from "react";

import Highcharts from "highcharts";
import highchartsdata from "highcharts/modules/data";
import HighchartsReact from "highcharts-react-official";
import { BACKEND_URL } from "../../services/AppConfig";

class DashboardByDepartment extends Component {
  constructor(props) {
    super(props);
    highchartsdata(Highcharts);
    this.state = {
      data: ""
    };
  }

  componentDidMount() {
    fetch(BACKEND_URL + "/v1/stats/donesurveybydepartment")
      .then(res => res.json())
      .then(result => {
        console.log(result.data);
        var data = "catagory,ทำแบบสำรวจแล้ว,ยังไม่ทำแบบสำรวจ\n";
        result.data.forEach(e => {
          data += e.Department + "," + e.Done + "," + e.NotDone + "\n";
        });
        this.setState({
          data: data
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    var options = {
      title: {
        text: "สรุปการทำแบบสำรวจ"
      },
      chart: {
        inverted: true,
        polar: false,
        type: "column",
        height: 800
      },
      subtitle: {
        text: "(แบ่งตามส่วนงาน)"
      },
      colors: ["#2EC4B6", "#FF9F1C"],
      plotOptions: {
        series: {
          stacking: "normal",
          dataLabels: {
            enabled: true
          },
          animation: true,
          states: {
            inactive: {}
          }
        }
      },
      xAxis: {
        title: {
          text: "ส่วนงาน",
          style: {
            fontWeight: "normal",
            color: "#666666"
          }
        },
        maxPadding: 0.25
      },
      yAxis: {
        title: {
          text: "จำนวนผู้ทำแบบสำรวจ",
          style: {
            fontWeight: "normal",
            color: "#666666"
          }
        }
      },
      data: {
        csv: this.state.data,
        switchRowsAndColumns: false,
        firstColumnAsNames: false,
        firstRowAsNames: true
      },
      credits: {
        enabled: false
      }
    };

    if (this.state.data === "") {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            immutable={false}
            updateArgs={[true, true, true]}
            ref={this.chartRef}
            allowChartUpdate={true}
          />
        </div>
      );
    }
  }
}

export default DashboardByDepartment;
