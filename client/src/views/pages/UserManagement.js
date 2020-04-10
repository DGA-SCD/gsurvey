import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";
export default function UserManagement() {
  const [dataArray, setdataArray] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     // You can await here
  //     const response = await axios("https://reqres.in/api/users");
  //     console.log(response);
  //     if (response.status !== 200) {
  //       console.log("ไม่สารมารถเปิดแบบสำรวจได้");
  //       //   toastr.error("ไม่สารมารถเปิดแบบสำรวจได้", toastrOptions);
  //     }
  //     setdataArray(response.data.data);
  //   }
  //   fetchData();
  // }, []); // Or [] if effect doesn't need props or state

  return (
    // <div>
    //   <ul>
    //     {dataArray.map(item => (
    //       <li key={item.id}>
    //         <a href={item.first_name}>{item.email}</a>
    //       </li>
    //     ))}
    //   </ul>

    <MaterialTable
      title="Remote Data Preview"
      columns={[
        {
          title: "Avatar",
          field: "avatar",
          render: rowData => (
            <img
              style={{ height: 36, borderRadius: "50%" }}
              src={rowData.avatar}
            />
          )
        },
        { title: "Id", field: "id" },
        { title: "First Name", field: "first_name" },
        { title: "Last Name", field: "last_name" }
      ]}
      data={query =>
        new Promise((resolve, reject) => {
          let url = "http://demo8767913.mockable.io/alluser%3F";
          //let url = "https://reqres.in/api/users?";
          url += "per_page=" + query.pageSize;
          url += "&page=" + (query.page + 1);
          console.log(url);
          fetch(url)
            .then(response => response.json())
            .then(result => {
              console.log(result);
              resolve({
                data: result.data,
                page: result.page - 1,
                totalCount: result.total
              });
            });
        })
      }
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              {
                /* const data = this.state.data;
                          data.push(newData);
                          this.setState({ data }, () => resolve()); */
              }
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              {
                /* const data = this.state.data;
                          const index = data.indexOf(oldData);
                          data[index] = newData;                
                          this.setState({ data }, () => resolve()); */
              }
              resolve();
            }, 1000);
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              {
                /* let data = this.state.data;
                          const index = data.indexOf(oldData);
                          data.splice(index, 1);
                          this.setState({ data }, () => resolve()); */
              }
              resolve();
            }, 1000);
          })
      }}
      options={{
        pageSize: 10,
        exportButton: true,
        exportAllData: true
      }}
    />
  );
}
