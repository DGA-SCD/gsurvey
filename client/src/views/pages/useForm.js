import React, { useState, useEffect } from "react";

const useForm = (callback, validateRegister) => {
  const [account, setaccount] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    min_id: "",
    dep_id: "",
    org_id: "",
    check: false
  });
  //   const [check, setcheck] = useState(false);
  const [errors, seterrors] = useState({});
  const [issubmit, setissubmit] = useState(false);

  // Used to handle every changes in every input
  const handleChange = e => {
    const { name, value } = e.target;
    console.log(name);
    if (name === "min_id") {
      setaccount({
        ...account,
        [name]: value,
        dep_id: "",
        org_id: ""
      });
    }
    if (name === "dep_id") {
      setaccount({
        ...account,
        [name]: value,

        org_id: ""
      });
    }

    setaccount({
      ...account,
      [name]: value
    });
  };

  // const ischecked = () => setaccount({ ...account, check: !check });

  const handleChecked = () =>
    setaccount({
      ...account,
      check: !account.check
    });

  const handleSubmit = e => {
    e.preventDefault();
    console.log("handleSubmit");
    seterrors(validateRegister(account));
    setissubmit(true);
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && issubmit) {
      callback();
    }
  }, [errors]);
  return {
    handleChange,
    handleSubmit,
    handleChecked,
    account,
    errors
  };
};

export default useForm;
