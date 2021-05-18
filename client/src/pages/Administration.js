import React, {useEffect, useState, useRef} from 'react'
import Axios from 'axios'
import {Row, Col, Button, Form, Container } from "react-bootstrap"
import {useUser} from "../context/UserContext"
import {useStateWithCallbackLazy} from 'use-state-with-callback'
import NewCamera, {newCamera} from '../components/newCamera'
import {Link, useHistory } from 'react-router-dom'

const Administration = () => {
    const [users, setUsers] = useState(false);
    const [cameras, setCameras] = useState(false);
    const [rooms, setRooms] = useState(false);
    const [bookings, setBookings] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [cameraData, setCameraData] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [assignR, setAssignR] = useStateWithCallbackLazy()
    const [assignCam, setAssignCam] = useStateWithCallbackLazy()
    const [conv, setConv] = useState(false) 
    const history = useHistory()

    /*******************HANDLE USERS*******/
    function handleFirst(e){
        e.preventDefault()
        setCameras(false);
        setRooms(false);
        setBookings(false);
        setUsers(true);
    }

    function removeUser(id){
        let temp = userData.filter((item)=>item.id_users !== id)
        console.log("deleted")
        console.log(temp)
        setUserData(temp)
    }

    function updateUserRole(id, rol){
        let indx = userData.findIndex((item)=>item.id_users === id)
        let items = [...userData]
        let temp = {...items[indx]}
        temp.admin = rol
        items[indx]=temp
        setUserData(items)
    }

     /*******************HANDLE CAMERAS*******/
    function handleSecond(e){
        e.preventDefault()
        setUsers(false);
        setRooms(false);
        setBookings(false);
        setCameras(true);
    }

    async function getCamId(id){
        setAssignCam(id, ()=>{
            checkAssign1(id)
        })  
    }

    function changeCam(id){
        console.log("change")
        let indx = cameraData.findIndex((item)=>item.id_cameras === id)
        let items = [...cameraData]
        let temp = {...items[indx]}
        temp.itsOn = !temp.itsOn
        items[indx]=temp
        setCameraData(items)
    }

    function removeCamera(id){
        let temp = cameraData.filter((item)=>item.id_cameras !== id)
        console.log("deleted")
        console.log(temp)
        setCameraData(temp)
    }

    function addCamera(a, b){
        Axios.post("http://localhost:5001/camera",{
            id_cameras: null, 
            id: a, 
            name: b, 
            itsOn: 0
        }).then((response)=>{
            console.log(response)
        })
    }

    /*******************HANDLE ROOMS*******/
    function handleThird(e){
        e.preventDefault()
        setUsers(false);
        setCameras(false);
        setBookings(false);
        setRooms(true);
    }

    function getRoomId(id){
        setAssignR(id, ()=>{
            checkAssign2(id)
        })     
    }

    function removeRoom(id){
        let temp = roomData.filter((item)=>item.id_rooms !== id)
        console.log("deleted")
        console.log(temp)
        setRoomData(temp)
    }

    function addRoom(t, s){
        Axios.post("http://localhost:5001/room",{
            id_rooms: null, 
            type: t, 
            idSize: s, 
            idCamera: null
        }).then((response)=>{
            console.log(response)
        })
    }

    function camToRoom(idCam, idRoom){
        Axios.post("http://localhost:5001/room/assign",{
            id_r: idRoom,
            id_c: idCam
        }).then((response)=>{
            console.log(response)
            setAssignCam();
            setAssignR();
        })
    }

    function checkAssign1(param){
        if(assignR){
            camToRoom(param, assignR)
        } 
    }

    function checkAssign2(param){
        if(assignCam){
            camToRoom(assignCam, param)
        } 
    }

    /*****************HANDLE BOOKINGS**** */

    function handleFourth(){
        setUsers(false);
        setCameras(false);
        setRooms(false);
        setBookings(true);
    }

    function removeBooking(id){
        let temp = bookingData.filter((item)=>item.id_bookings !== id)
        console.log("deleted")
        console.log(temp)
        setBookingData(temp)

    }


    function handleFifth(){
        history.push("/monitoring")
    }
    
    /***********FETCHING DATA */
    async function fetchData() {
        await fetch();
    }

    function fetch(){
        setLoading(true);
        Axios.get("http://localhost:5001/user").then((response)=>{
            console.log(response.data)
            setUserData(response.data)
        })
        Axios.get("http://localhost:5001/room").then((response)=>{
            console.log(response.data)
            setRoomData(response.data)
        })
        Axios.get("http://localhost:5001/camera").then((response)=>{
            console.log(response.data)
            setCameraData(response.data)
        })
        Axios.get("http://localhost:5001/booking").then((response)=>{
            console.log(response.data)
            //setBookingData(response.data)
            //convertDate(response.data[0].firstDay)
            fixDates(response.data)
        })
        setLoading(false)
    }

    const convertDate = str => {
        str = str.toString();
        let parts = str.split("T");
        return parts[0]
    };

    const fixDates=(param)=>{
            let items = [...param]
            for(var i=0; i<items.length; i++){
                items[i].firstDay=convertDate(items[i].firstDay)
                items[i].lastDay=convertDate(items[i].lastDay)
            }          
            setBookingData(items)
    }

    useEffect(()=>{
        fetchData()
    },[])

    
    if(loading){
        return <div>LOADING...</div>
    }
    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style={{minHeight: "10vh" }}>
            <div style={{maxWidth: "600px"}}>
                <div className="divcenter">
                    <p>Panel Administarcyjny</p>
                </div>
                <Row>
                    <Col sm="12">
                        <div className="ml-4 alert alert-info " role="alert" >
                            <Row>
                                <Col sm="9">
                                    <h6 className="ml-3 mt-2">Włączenie oraz zarządzanie systemem monitoringu </h6>
                                </Col>
                                <Col sm="3">
                                    <Button style={{width: "120px"}} onClick={handleFifth}>Monitoring</Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm="3">
                        <Button variant="secondary" style={{width: "150px"}} onClick={handleFirst}>Użytkownicy</Button>
                    </Col>
                    <Col sm="3">
                        <Button variant="secondary" style={{width: "150px"}} onClick={handleSecond}>Kamery</Button>
                    </Col>
                    <Col sm="3">
                        <Button variant="secondary" style={{width: "150px"}} onClick={handleThird}>Pokoje</Button>
                    </Col>
                    <Col sm="3">
                        <Button variant="secondary" style={{width: "150px"}} onClick={handleFourth}>Rezerwacje</Button>
                    </Col>
                </Row>

                <div>
                    {rooms?<AddRoom func={addRoom}/>:null}
                    {cameras?<NewCamera func={addCamera}/>:null}
                </div>
                <div>
                    {
                        users?userData.map((item, index)=>{
                            return <Users key={index} data={item} func={removeUser} func2={updateUserRole}/>
                        }):(
                        cameras?cameraData.map((item, index)=>{
                            return <Cameras key={index} data={item} func={removeCamera} funcc2={getCamId} func3={changeCam}/>
                        }):(
                        rooms?roomData.map((item, index)=>{
                            return <Rooms key={index} data={item} func={removeRoom} func2={getRoomId}/>
                        }):(bookings?bookingData.map((item, index)=>{
                            return <Bookings key={index} data={item} user={userData} func={removeBooking}/>
                        }):null)
                        ))
                    }
                </div>

            </div>
        </Container>

        </>
    )
}
const AddRoom = (props) => {
    const typeRef = useRef()
    const sizeRef = useRef()


    const handleSubmit = e => {
        e.preventDefault();
        props.func(typeRef.current.value, sizeRef.current.value)
    }

    return (
        <Row className='mt-3 align-items-center justify-content-center'>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                <Col sm={6}>
                    <Form.Control size="sm" type="text" ref={typeRef} required placeholder="Podaj typ"/>
                </Col>
                <Col sm={4}>
                    <Form.Control size="sm" type="number" ref={sizeRef} required placeholder="Podaj rozmiar"/>
                </Col>
                <Col sm={2}><Button size="sm" type="submit">Dodaj</Button></Col>
                </Form.Row> 
            </Form>
        </Row>
    )
}

const Users = (props) => {
    const {changeRole, deleteUser} = useUser();
    const [error, setError] = useState();

    const rights = (role, id) => e => {
        e.preventDefault()
        setError(false)
        let a = null
        try {
            changeRole(role, id)
            if(role){a = 0} else {a = 1}
            props.func2(id, a)
        } catch (error) {
            console.log(error)
        }
        setError(true)
    }

    const deleteAcc = param => e => {
        e.preventDefault()
        try {
            deleteUser(param)
            props.func(param)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Row className='mt-3'>
            <Col sm={1}>{props.data.id_users} </Col>
            <Col sm={4}>{props.data.login} </Col>
            <Col sm={3}>{props.data.admin?"Admin":"User"}</Col>
            <Col sm={2}>
                <Button variant="outline-warning" size="sm"
                 onClick={rights(props.data.admin, props.data.id_users)}>Rola</Button>
            </Col>
            <Col sm={2}>
                <Button variant="outline-danger" size="sm" onClick={deleteAcc(props.data.id_users)}>Usuń</Button>
            </Col>
        </Row>
    );
}

const Cameras = (props) => {
    const {changeCamRole} = useUser()
    const [error, setError] = useState(false)


    const deleteCam = param => e => {
        e.preventDefault()
        try {
            Axios.delete("http://localhost:5001/camera/"+param).then((response)=>{
                console.log(response)
                props.func(param)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const assign = params => e => {
        e.preventDefault()
        props.funcc2(params)
    }


    const change = (params, on) => e => {
        e.preventDefault()
        setError(false)
        let a = null
        try {
            changeCamRole(params, on)
            if(on){a = 0} else {a = 1}
            props.func3(params, a)
        } catch (error) {
            console.log(error)
        }
        setError(true)
    }

    return <div>
        <Row className='mt-3'>
            <Col sm={1}>{props.data.id_cameras}</Col>
            <Col sm={4}>{props.data.name}</Col>
            <Col sm={1}>{props.data.itsOn?"On":"Off"}</Col>
            <Col sm={2}>
                <Button variant="outline-warning" size="sm" 
                onClick={assign(props.data.id_cameras)}>Powiąż</Button>
            </Col>
            <Col sm={2}>
                <Button variant="outline-warning" size="sm" 
                onClick={change(props.data.id_cameras, props.data.itsOn)}>Wł/Wył</Button>
            </Col>
            <Col sm={2}>
                <Button variant="outline-danger" size="sm" 
                onClick={deleteCam(props.data.id_cameras)}>Usuń</Button>
            </Col>
        </Row>
    </div>
}



const Rooms = (props) => {

    const deleteRoom = param => e => {
        e.preventDefault()
        try {
            Axios.delete("http://localhost:5001/room/"+param).then((response)=>{
                console.log(response)
                props.func(param)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const assign = param => e => {
        e.preventDefault()
        props.func2(param)
    }
    return <div>
        <Row className='mt-3'>
            <Col sm={1}>{props.data.id_rooms}</Col>
            <Col sm={3}>{props.data.type}</Col>
            <Col sm={1}></Col>
            <Col sm={3}>{props.data.idSize} miejsc</Col>
            <Col sm={2}>
                <Button variant="outline-warning" size="sm" 
                onClick={assign(props.data.id_rooms)}>Powiąż</Button>
            </Col>
            <Col sm={2}>
                <Button variant="outline-danger" size="sm" 
                onClick={deleteRoom(props.data.id_rooms)}>Usuń</Button>
            </Col>
        </Row>
    </div>
}


const Bookings = (props) => {
    
    const deleteBooking = param => e => {
        e.preventDefault()
        try {
            Axios.delete("http://localhost:5001/booking/"+param).then((response)=>{
                console.log(response)
                props.func(param)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    const assign = param => e => {
        e.preventDefault()
        console.log("aa"+param)
    }
    
    return <div>
        <Row className='mt-3'>
            <Col sm={1}>{props.data.id_bookings}</Col>
            <Col sm={3}>{props.data.firstDay}</Col>
            <Col sm={3}>{props.data.lastDay}</Col>
            <Col sm={1}></Col>
            <Col sm={2}>
                <Button variant="outline-dark" size="sm" 
                onClick={assign(props.data.id_bookings)}>More</Button>
            </Col>
            <Col sm={2}>
                <Button variant="outline-danger" size="sm" 
                onClick={deleteBooking(props.data.id_bookings)}>Usuń</Button>
            </Col>
        </Row>
    </div>
}

export default Administration
