import React from 'react'
import {Route, Redirect} from "react-router-dom"

export default function OnlyUserRoute({ component: Component, ...rest }) {
    const isLogged = localStorage.getItem('loggedIN')
    
    return ( 
        <Route
        {...rest}
        render={props => {
            return isLogged ? <Component {...props} /> : <Redirect to="/logowanie" />
        }}
        ></Route>
    )
}
