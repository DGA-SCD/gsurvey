import * as config from "./AppConfig";
import { toastr } from "react-redux-toastr";

const login = function(username, password) {
  const requestOptions = {
    method: window.$httpPost,
    headers: window.$httpHeaders,
    body: JSON.stringify({ username, password }),
    credentials: "include"
  };

  return (
    fetch(config.BACKEND_GSURVEY + "/api/v2/auth/login", requestOptions)
      // .then(handleResponse)
      .then(response => response.json())
      .then(user => {
        if (user.success) {
          // store user details and basic auth credentials in local storage
          // to keep user logged in between page refreshes
          //     user.authdata = window.btoa(username + ":" + password);
          localStorage.setItem("userData", JSON.stringify(user.data));
        }

        return user;
      })
  );
};

function clearStrogae() {
  localStorage.clear();
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
