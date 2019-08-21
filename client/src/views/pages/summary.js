import React from 'react';
import { Table } from 'reactstrap';


const url = 'http://jsonplaceholder.typicode.com/posts';


export default class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          droplets: []
        }
      }

    //   componentDidMount() {
    //     console.log("componentDidMount 1");
    //     $.ajax({
    //         method:'get',
    //         crossDomain: true,
    //      url: "http://164.115.17.163:8082/v1/survey/questions/seminar-01"
    //     }).done((res) => {
    //         console.log(res.data);
           
    //         this.setState({json:(res.data)});
    //         console.log("componentDidMount 2");
  
    //     })
    //   }

  render() {
    return (
      <Table responsive  ={ this.state.droplets }>
        <thead>
          <tr>
            <th>#</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
