
import React, { Fragment, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { BACKEND_URL } from "./AppConfig";
export default class AuthService extends React.Component {


  constructor(props) {
    super(props);
    this.state = {

      user: null,

    };

    this.login = this.login.bind(this)
    this.getProfile = this.getToken.bind(this)
  }

  login(userId, password) {
    let BaseURL = BACKEND_URL + '/v1/auth/login';
    console.log("login" + userId);
    return fetch(BaseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        password: password
      })
    })
      .then(this._checkStatus)
      .then((response) => response.json())
      .then((res) => {
        this.setUserLogin(res.data);
        this.setToken(res.data.token);

        return Promise.resolve(res);
      })
    // .then((res) => {
    //   // console.log("login--->" + res.data);
    //   // console.log("logincode--->" + res.code);
    //   // if (res.code === 20000) {
    //   //   this.setToken(res.data.token)
    //   //   this.setUserLogin(res.data)
    //   //   console.log("logindddddd");
    //   //   return Promise.resolve(res);
    //   // }
    // })

    // .catch(function (error) {
    //   console.log("Request failed", error);
    // });
  }

  IsAvailable() {
    console.log('IsAvailable')
    const options = {
      async: true,
      mode: 'cors',
      crossDomain: true,
      cache: 'no-cache',
      method: 'GET',
      headers: {
        "userid": localStorage.getItem("session_userid"),
        "token": localStorage.getItem("token_local"),
        //"token": "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
        'Content-Type': 'application/json',
        'Accept': 'application/json'

      }
    };
    fetch(BACKEND_URL + '/v1/users/profile', options).then((response) => {
      console.log("isavailabe" + response.status);
      if (response.status !== 200) {

        console.log('Timeout')
        localStorage.clear();


        window.location.href = '/pages/login';
      } else {
        return true;
      }

    })
  }
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    console.log('loggedIn');
    return token
  }
  getStatus() {
    console.log('getstatus')
    const options = {
      async: true,
      mode: 'cors',
      crossDomain: true,
      cache: 'no-cache',
      method: 'GET',
      headers: {
        "userid": localStorage.getItem("session_userid"),
        "token": localStorage.getItem("token_local"),
        'Content-Type': 'application/json',
        'Accept': 'application/json'

      }
    };
    fetch(BACKEND_URL + '/v1/users/profile', options)
      .then(response => {
        if (response.ok) {
          console.log('ok')
          return response
        } else if (response.status == 401) { // something bad happened...
          console.log('401')
          localStorage.clear();
          return false
        } else { // some other status like 400, 403, 500, etc
          // take proper actions
        }
      })
      .catch(error => {
        // do some clean-up job
      });
  }

  getUserFeed() {

    let dataList = localStorage.getItem("userData");
    return dataList;

  }
  setUserLogin(data) {

    let userlogin = data.name + " " + data.surname;
    localStorage.setItem('userlogin', userlogin)
    localStorage.setItem('session_userid', data.id);
    localStorage.setItem('level', data.level);
    localStorage.setItem('userData', JSON.stringify(data));
  }
  setToken(token) {
    // Saves user token to localStorage
    localStorage.setItem('token_local', token)
  }
  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('token_local')
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
  }
  _checkStatus(response) {


    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300


      return response
    } else {
      this.logout();

      var error = new Error(response.statusText)
      error.response = response
      throw error
    }


  }
  _checkroommate(userid) {
    console.log(userid);
  }

}

