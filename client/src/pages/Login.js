import React, {useState, useRef} from 'react'
//import Axios from "axios"
import {useUser} from '../context/UserContext'
import {Link, useHistory } from 'react-router-dom'
import { Form, Button, Card, Alert, Container } from "react-bootstrap"

const Login = () => {
    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('')
    //const [loginStatus, setLoginStatus] = useState(false)

    const usernameRef = useRef()
    const passwordRef = useRef()
    const {loging, loginCheck} = useUser()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    //const [logged, setLogged] = useState()
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setError("")
            setLoading(true)
            await loging(usernameRef.current.value, passwordRef.current.value)
            localStorage.setItem("loggedIN", true)
            history.push("/")
        } catch {
            setError("Failed to log in")
        }

        setLoading(false)
    }

/*    
    Axios.defaults.withCredentials = true;
    const login = () => {
        Axios.post("http://localhost:5001/user/login", {
            login: username,
            pswd: password
        }).then((response)=>{
            if (!response.data.auth) {
                setLoginStatus(false)
                console.log(response.data.message)
                console.log("Test")
            } else {
                setLoginStatus(true)
                localStorage.setItem("token", response.data.token) //zalecany sposob do przechowywania tokenow
                console.log(response.data.user[0].login)
                console.log("lol")
            }
        })
    }

    useEffect(() => {
        Axios.get("http://localhost:5001/user/login").then((response)=>{
            console.log("useEffect")
            console.log(response);
            if (response.data.loggedIn){
                setLoginStatus(true)
                console.log(response.data.user[0].login)
            }
        })
    }, [])

    const userAuthenticated = () => {
        Axios.get("http://localhost:5001/user/isAuthenticated", {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((response)=>{
            console.log(response)
        })
    }
*/
    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style={{minHeight: "80vh" }}>
            <div className="w-100" style={{maxWidth: "600px"}}>
            <Card>
                <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {loginCheck && <Alert variant="danger">Niepoprawny login</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="login">
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="text" ref={usernameRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">
                    Zaloguj się
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password">Zapomniałeś hasła?</Link>
                </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
            </div>
            </div>
        </Container>
        </>


        /*<div className="container">
            <div className="login-form">
                <h2>Login</h2>

                <label><b>Login</b></label>
                <input type="text" placeholder="Podaj login"
                    onChange={(e)=>{
                        setUsername(e.target.value);
                    }}
                />            

                <label><b>Hasło</b></label>
                <input type="password" placeholder="Podaj hasło"
                    onChange={(e)=>{
                        setPassword(e.target.value);
                    }}
                />

                <button onClick={login} className="loginbtn">Login</button>
            </div>
            <h2></h2>
            <h2>Status:</h2>
            <h1>{loginStatus?"true":"false"}</h1>
            <h1>{<button onClick={userAuthenticated}>Sprawdź poświadczenie</button>}</h1>
        </div>*/
    )
}

export default Login
