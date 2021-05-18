import React, {useContext, useState} from 'react'
import Axios from 'axios'

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function useUser() {
    return useContext(UserContext)
}


export function UserProvider({ children }) {
    //const [currentUser, setCurrentUser] = useState("test");
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    //const [isLogged, setIsLogged] = useState(false);
    const [loginSucces, setLoginSucces] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginCheck, setLoginCheck] = useState();

    function signup(name, surname, username, password) {
        setLoginCheck(false)
        Axios.post('http://localhost:5001/user', {
            //id_users: null,
            login: username,
            pswd: password, 
            name: name, 
            surname: surname,
            admin: 0
        }).then((response)=>{
            console.log(response);
            if(response.data.message){
                setLoginCheck(true)
            }
        })
    }

    function logout(){
        setLoginSucces(false)
        localStorage.removeItem("token")
        localStorage.removeItem("loggedIN")
        localStorage.removeItem("role")
        localStorage.removeItem("userId")
        setIsAdmin(false)
        setLoading(false)
        setLoading2(false)
    }
    function loging(username, password) {
        setLoading(true)
        setLoading2(true)
        setLoginCheck(false)
        console.log("logowanie")
        Axios.post("http://localhost:5001/user/login", {
            login: username,
            pswd: password
        }).then((response)=>{
            console.log("response")
            if (!response.data.auth) {
                setLoginSucces(false)
                console.log(response.data.message)
                setLoading2(false)
                setLoginCheck(true)
            } else {
                localStorage.setItem("token", response.data.token) //zalecany sposob do przechowywania tokenow
                console.log(response.data.user[0].login)
                checkAuthentication()
                setLoginSucces(true)
                setLoading2(false)
            }
        })

    }
    
    function checkAuthentication(){
        setLoading(true)

        Axios.get("http://localhost:5001/user/isAuthenticated", {
            headers: {
                "x-access-token": localStorage.getItem("token"), 
            }
        }).then((response)=>{
            console.log(response)
            console.log("Check auth:"+response.data.auth)
            localStorage.setItem("userId", response.data.id)
            setLoginSucces(response.data.auth)
            if(response.data.auth){
                userRole(response.data.id)
            }
        })
        
    }

    function userRole(id){
        Axios.get("http://localhost:5001/user/"+id).then((response)=>{
            console.log("userRole " +response.data.admin)
            setIsAdmin(response.data.admin)
            if(response.data.admin){
                localStorage.setItem("role", response.data.admin)
            }
            setLoading(false)
        })
    }

    function getRole(){
        console.log("Get role " + isAdmin)
        return isAdmin;
    }

    function getAuth(){
        console.log("Get auth " + loginSucces)
        return loginSucces;
    }

    function changeRole(role, id){
        let a = null
        if(role){
            a = false
        } else {
            a = true
        }
        Axios.put("http://localhost:5001/user/"+id, {
            admin: a
        }).then((response)=>{
            console.log(response)
        })
    }

    function deleteUser(id){
        Axios.delete("http://localhost:5001/user/"+id).then((response)=>{
            console.log(response)
        })
    }

    function changeCamRole(id, role){
        let a = null
        if(role){
            a = false
        } else {
            a = true
        }
        Axios.put("http://localhost:5001/camera/"+id, {
            itsOn: a
        }).then((response)=>{
            console.log(response)
        })
    }

    return (
        <UserContext.Provider value={{signup, logout, loging, getRole, getAuth, checkAuthentication, 
            loginSucces, isAdmin, loading, loading2,
            changeRole, deleteUser, changeCamRole, loginCheck}}>
            {children}
        </UserContext.Provider>
    )

}

