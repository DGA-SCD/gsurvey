import * as config from "./AppConfig";
import { toastr } from "react-redux-toastr";

const toastrOptions = {
  timeOut: 2000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};
const login = function(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  };

  return fetch(config.BACKEND_GSURVEY + "/api/v2/auth/login", requestOptions)
    .then(handleResponse)

  .then(user => {
    // login successful if there's a user in the response
    if (user) {
      // store user details and basic auth credentials in local storage
      // to keep user logged in between page refreshes
      //     user.authdata = window.btoa(username + ":" + password);
      localStorage.setItem("userData", JSON.stringify(user.data));
    }

    return user;
  });
};

function clearStrogae() {
  localStorage.clear();
  window.location.replace("login");
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        // auto logout if 401 response returned from api
        // toastr.error("เช็ค username หรือ password", toastrOptions);
        clearStrogae();
        //location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export const userService = {
  login,
  clearStrogae
};