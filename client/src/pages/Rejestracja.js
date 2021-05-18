import React, { useState, useRef } from 'react'
//import Axios from "axios"
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'

const Rejestracja = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const nameRef = useRef();
    const {loginCheck} = useUser();
    const surnameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const {signup} = useUser()

    async function handleSubmit(e) {
        e.preventDefault()
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Podane hasła nie są takie same")
        }

        try {
            setLoading(true)
            await signup(nameRef.current.value, surnameRef.current.value, usernameRef.current.value, passwordRef.current.value)
        } catch (error) {
            setError('Nie udało się utworzyć konta')
            console.log(error)
        }
        setLoading(false)
    }

    /*const register = () => {
        Axios.post('http://localhost:5000/user', {
            //id_users: null,
            login: login,
            pswd: password, 
            name: name, 
            surname: surname,
            admin: 0
        }).then((response)=>{
            console.log(response);
        })
    }*/

    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style={{minHeight: "100vh" }}>
            <div className="w-100" style={{maxWidth: "600px"}}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Rejestracja</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {loginCheck && <Alert variant="danger">Login zajęty</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="name">
                                <Form.Label>Imię</Form.Label>
                                <Form.Control type="text" ref={nameRef} required />
                            </Form.Group>
                            <Form.Group id="surname">
                                <Form.Label>Nazwisko</Form.Label>
                                <Form.Control type="text" ref={surnameRef} required />
                            </Form.Group>
                            <Form.Group id="login">
                                <Form.Label>Nazwa użytkownika</Form.Label>
                                <Form.Control type="text" ref={usernameRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Hasło</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Potwierdź hasło</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required />
                            </Form.Group>
                                <Button disabled={loading} className="w-100" type="submit">
                                Sign Up
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Posiadasz już konto? <Link to="/logowanie">Zaloguj się</Link>
                </div>
            </div>
        </Container>
        </>
        /*
        <div className="container">
            <h1>Register</h1>
            <p>Please fill in this form to create an account.</p>

            <label htmlFor="login"><b>Login</b></label>
            <input type="text" placeholder="Podaj login"
                onChange={(e)=>{
                    setLogin(e.target.value);
                }}
            />            

            <label htmlFor="psw"><b>Hasło</b></label>
            <input type="password" placeholder="Podaj hasło"
                onChange={(e)=>{
                    setPassword(e.target.value);
                }}
            />

            <label htmlFor="name"><b>Imię</b></label>
            <input type="text" placeholder="Podaj imię"
                onChange={(e)=>{
                    setName(e.target.value);
                }}
            />

            <label htmlFor="surname"><b>Nazwisko</b></label>
            <input type="text" placeholder="Podaj nazwisko"
                onChange={(e)=>{
                    setSurname(e.target.value);
                }}
            />

            <button onClick={register} className="registerbtn">Register</button>
        </div>*/
    )
}

export default Rejestracja
