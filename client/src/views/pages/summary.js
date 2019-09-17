import React, { Component, useState } from 'react';
import ReactDOM from "react-dom";
import { forwardRef } from 'react';
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
const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };


const url = 'http://jsonplaceholder.typicode.com/posts';

class Example extends Component {


  constructor(props) {
    super(props);

    
    this.state = {
      columns:[
        { title: 'รหัสพนักงาน', field: 'id' },
        { title: 'First Name', field: 'employee_name' },
        { title: 'Sarary Name', field: 'employee_salary' },
        { title: 'Employee_age', field: 'employee_age' },
        { title: 'Image', field: 'profile_image' },
        // {
        //   title: 'Avatar',
        //   field: 'avatar',
        //   render: rowData => (
        //     <img
        //       style={{ height: 36, borderRadius: '50%' }}
        //       src={rowData.avatar}
        //     />
        //   ),
        // },
        // { title: 'Id', field: 'id' },
        // { title: 'First Name', field: 'first_name' },
        // { title: 'Last Name', field: 'last_name' },
      ],
      data: [],
    }
  }

  componentDidMount() {
     
   // fetch("https://reqres.in/api/users")
   fetch("http://dummy.restapiexample.com/api/v1/employees")
    .then(response => {
      console.log(response.status); 
      if (response.status !== 200) {
       this.setState({redirectToReferrer:false});
        console.log('chkredirect==>'+this.state.redirectToReferrer);
   
      } 
        return response.json();
    })
    .then(res => {
      console.log(res);
      this.setState({ data: res})
    })
  }

  handleRowAdd(newData,resolve) {
    console.log('dfdfd')
    console.log(newData)
    // const { products } = this.state;

    // const apiUrl = 'http://localhost/dev/tcxapp/reactapi/deleteProduct';
    // const formData = new FormData();
    // formData.append('productId', productId);

    // const options = {
    //   method: 'POST',
    //   body: formData
    // }

    // fetch(apiUrl, options)
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         response: result,
    //         products: products.filter(product => product.id !== productId)
    //       });
    //     },
    //     (error) => {
    //       this.setState({ error });
    //     }
    //   )
  }
  render() {
    return (
      
      <MaterialTable
        title="Editable Preview"
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.state.data;
                  data.push(newData);
                  this.setState({ data }, () => resolve());
                }
                resolve()
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
          
           new Promise((resolve, reject) => {
            //  console.log(newData);
              this.handleRowAdd(newData, resolve);
              const data = this.state.data;
                
              const index = data.indexOf(oldData);
            //  console.log(index);
              data[index] = newData;
             // console.log(data[index]);
              this.setState({ data }, () => resolve());
            }),
          onRowDelete: oldData =>
         
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let data = this.state.data;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.setState({ data }, () => resolve());
                }
                resolve()
              }, 1000)
            }),
        }}
        options={{
          sorting: true,
          //filtering: true,
          exportButton: true,
          paginationType: "stepped",
          headerStyle: {
            backgroundColor: '#00ADFF',
            color: '#FFF',
            font:"Athiti !important"
          },
          rowStyle: {
            font:"Athiti !important"
          }
        }}
      />
   
    )
  }
   

 
}
export default Example;

// import React, Component, { useState, useEffect } from 'react';

// function Example() {
//   const [count, setCount] = useState(0);
//   const MyComponent = lazy(() => import('./MyComponent'))
//   // Similar to componentDidMount and componentDidUpdate:
//   useEffect(() => {
//     // Update the document title using the browser API
//     document.title = `You clicked ${count} times`;
//   });

//   return (
//     <div>
//       <p>You clicked {count} times</p>
//       <button onClick={() => setCount(count + 1)}>
//         Click me
//       </button>
//     </div>
//   );
// }
