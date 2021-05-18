import React from 'react'
import {Route, Redirect} from "react-router-dom"

export default function OnlyAdminRoute({ component: Component, ...rest }) {
    const role = localStorage.getItem("role")

    return (
        <Route
        {...rest}
        render={props => {
            return role ? <Component {...props} /> : <Redirect to="/logowanie" />
        }}
        ></Route>
    )
}