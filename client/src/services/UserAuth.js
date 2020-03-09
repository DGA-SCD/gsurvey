import * as config from "./AppConfig";

const login = function(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
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

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("userData");
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        //location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export const userService = {
  login
};