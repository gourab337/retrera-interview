import React from "react";
import {Redirect} from "react-router-dom";
import {unAuthenticate} from "../utils";

const Logout = () => {
    unAuthenticate();
    return (
        <Redirect to={"/"}/>
    )
}

export default Logout;