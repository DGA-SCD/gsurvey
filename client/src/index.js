// import external modules
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// import internal(own) modules
import registerServiceWorker from "./registerServiceWorker";
import { store } from "./redux/storeConfig/store";
import ReduxToastr from "react-redux-toastr";

import "font-awesome/css/font-awesome.min.css";

import "./index.scss";
import Spinner from "./components/spinner/spinner";

/* Setup google analytic */
import ReactGA from "react-ga";
ReactGA.initialize("UA-159912324-1");
ReactGA.pageview(window.location.pathname + window.location.search);

const LazyApp = lazy(() => import("./app/app"));

window.$httpHeaders = {
  "Content-Type": "application/json",
  "Accept-Charset": "utf-8"
};

window.$httpPost = "POST";
window.$toastrOptions = {
  timeOut: 2000, // by setting to 0 it will prevent the auto close
  position: "top-right",
  showCloseButton: true, // false by default
  closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
  progressBar: false
};

window.$httpBody = {};

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <LazyApp />
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="top-left"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
        closeOnToastrClick
      />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
