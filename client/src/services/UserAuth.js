import * as config from "./AppConfig";

const login = function (username, password) {
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

export const userService = {
  login,
  clearStrogae
};
