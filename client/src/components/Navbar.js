import React, {useEffect, useState } from 'react'
import logo from "../images/logo.png";
import { FaAlignRight } from "react-icons/fa";
import {Link, useHistory} from "react-router-dom"
import {useUser} from '../context/UserContext'
import {Button} from 'react-bootstrap'

export default function Navbar() {
    const [isError, setIsError] = useState()
    const {loginSucces, checkAuthentication, logout} = useUser();
    const history = useHistory()
    
    const [isOpen, setIsOpen] = useState(false)
    const [role, setRole] = useState()


    const handleToggle = () => {
        if(isOpen===false){
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }

    async function logoutBtn(){
        try {
            await logout();
            setRole(false)
            setIsError(false)
            history.push('/') 
        } catch {
            setIsError(true)
            console.log("Failed to logout")
        }
        
        
    }

    useEffect(()=>{
        
        setRole(localStorage.getItem("role"))
        checkAuthentication(); 
        console.log("role "+role)
    },[])
    //render() {
        return (
                    <nav className="navbar">
                        <div className="nav-center">
                            <div className="nav-header">
                                <Link to="/">
                                    <img className="nav-logo" src={logo} alt="Pet Hotel"/>
                                </Link>
                                <button type="button" className="nav-btn" onClick={handleToggle}>
                                    <FaAlignRight className="nav-icon" />
                                </button>
                            </div>
                            <ul className={isOpen?"nav-links show-nav":"nav-links"}>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/rezerwacja">Rezerwacje</Link>
                                </li>
                                <li>
                                    
                                    {
                                        loginSucces&&role?<Link to="/administrator">Administracja</Link>
                                        :(loginSucces&&!role?<Link to="/userpanel">Moje konto</Link>:<Link to="/logowanie">Zaloguj się</Link>)      
                                    }
                                </li>
                                <li>{loginSucces?<Button variant="outline-danger" onClick={logoutBtn}>Wyloguj się</Button>
                                :<Link to="/rejestracja">Utwórz konto</Link>
                                }
                                </li>
                            </ul>
                        </div>
                    </nav>
            
        )
    //}
}
