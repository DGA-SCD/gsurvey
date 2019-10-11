import React, { Component } from "react";


export default url => WrappedComponent =>
    class extends Component {
        state = {
            result: [],
            requestFailed: ''

        }

        async componentDidMount() {
            const options = {
                async: true,
                mode: 'cors',
                crossDomain: true,
                cache: 'no-cache',
                redirect: 'follow',

                method: 'GET',
                headers: {
                    "userid": localStorage.getItem("session_userid"),
                    // "token": localStorage.getItem("token_local"),
                    "token": "3gUMtyWlKatfMk5aLi5PpgQxfTJcA91YlN6Nt8XyiR1CwLs6wGP69FSQs8EKHCsg",
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'

                }
            };
            // await fetch(url, options)
            //     .then(response => response.json())
            //     .then(result => {
            //         console.log(result);
            //         console.log(result.status);
            //         this.setState({ result: result, isFetching: false })
            //     })
            //     .catch(e => {
            //         console.log(e);
            //         this.setState({ ...this.state, isFetching: false });
            //     });
            await fetch(url, options)
                .then(response => {
                    console.log("response.status" + response.status)
                    if (response.status === 200) {
                        return response.json()
                    } else {
                        console.log("response.status not success" + response.status)
                        this.setState({ requestFailed: true })
                    }

                })
                .then(result => {
                    console.log(result);

                    this.setState({ result: result, requestFailed: false })
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, requestFailed: true });
                });


        }

        render() {
            console.log('wihtRequest');
            return <WrappedComponent {...this.props} {...this.state} />
        }
    }