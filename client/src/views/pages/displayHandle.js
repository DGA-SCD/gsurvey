// import external modules
import React, { useState, useEffect, Fragment } from "react";
import * as config from "../../services/AppConfig";
import DisplaySurvey from "./DisplaySurvey";
import { toastr } from "react-redux-toastr";
import SurveyAuthen from "./surveyAuthen";
import { render } from "react-dom";
export default function DisplayHandle() {
  const toastrOptions = {
    timeOut: 3000, // by setting to 0 it will prevent the auto close
    position: "top-right",
    showCloseButton: true, // false by default
    closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    progressBar: false
  };

  const url_string = window.location.href;
  const url = new URL(url_string);
  const surveyid = url.searchParams.get("surveyid");
  const uid = url.searchParams.get("uid");
  const [name, setName] = useState();
  const [data, setData] = useState({
    question: {},
    password_enable: "",
    name: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const options = {
    async: true,
    mode: "cors",
    crossDomain: true,
    cache: "no-cache",
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const fetcher = await fetch(
          `${config.BACKEND_GSURVEY}/api/v2/users/surveys?sid=${surveyid}&v=1&uid=${uid}`,

          options
        );
        const response = await fetcher.json();

        setData({
          question: response.data,
          password_enable: response.data.password_enable,
          name: response.data.name
        });
        setIsLoading(false);
      } catch (error) {
        toastr.error("ไม่สารมารถเปิดแบบสำรวจได้", toastrOptions);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    console.log(data);
  }, []);

  const IsPass = ({ data }) => {
    if (data.password_enable === true) {
      return (
        <SurveyAuthen
          userid={uid}
          surveyid={surveyid}
          // authenPass={authenPass}
          question={data.question}
          name={data.name}
        />
      );
    } else {
      return (
        <DisplaySurvey
          surveyid={surveyid}
          uid={uid}
          question={data.question}
          name={data.name}
        />
      );
    }
  };

  return isLoading ? (
    <div>Loading..</div>
  ) : data.password_enable === true ? (
    <SurveyAuthen
      userid={uid}
      surveyid={surveyid}
      question={data.question}
      name={data.name}
    />
  ) : (
    <DisplaySurvey
      surveyid={surveyid}
      userid={uid}
      question={data.question}
      name={data.name}
    />
  );
  // );
}
