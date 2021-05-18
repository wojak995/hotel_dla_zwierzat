import React, {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import Camera from './Test2'
import {Container, Form, Row, Col, Button, Table} from 'react-bootstrap'

const UserPanel = () => {
    const bookRef=useRef()
    const [disabledB, setDisabledB] = useState(false)
    const userId = localStorage.getItem("userId")
    const [turnOn, setTurnOn] = useState(false)
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [allBookings, setAllBookings] = useState([])
    const [currentDate, setCurrentDate]= useState();
    const [currentCamera, setCurrentCamera]=useState();
    const [currentBooking, setCurrentBooking]=useState([]); 
    const [notCurrentBooking, setNotCurrentBooking]=useState([]);


    function getCamId(id){
        setTurnOn(false)
        Axios.get("http://localhost:5001/camera/"+id).then((response)=>{
            setCurrentCamera(response.data.id)
            setTurnOn(true)
        })

    }

    function removeBooking(id){
        let temp = notCurrentBooking.filter((item)=>item.id_bookings !== id)
        console.log("deleted")
        console.log(temp)
        setNotCurrentBooking(temp)
    }

    const onlyCurrentBookings = () => {
        let temp = allBookings.filter((item)=>(item.firstDay+1 <= currentDate && item.lastDay+1>=currentDate))
        console.log(temp)
        setCurrentBooking(temp)
        setShow2(false)
        setShow(true)
        setDisabledB(true)
    }

    const notCurrentBookings = () => {
        let temp = allBookings.filter((item)=>!(item.firstDay+1 <= currentDate && item.lastDay+1>=currentDate))
        console.log(temp)
        setNotCurrentBooking(temp)
        setShow(false)
        setShow2(true)
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
            setAllBookings(items)
    }

    async function fetchData() {
        await fetch();
    }

    function fetch(){
        Axios.get("http://localhost:5001/booking/user/"+userId).then((response)=>{
            console.log(response.data)
            fixDates(response.data)
        })
        Axios.get("http://localhost:5001/booking/date").then((response)=>{
            console.log(response.data)
            setCurrentDate(response.data)
        })
        
    }

    useEffect(()=>{
        fetchData();
    },[])

    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style={{minHeight: "10vh" }}>
            <div style={{width: "700px"}}>
                <div className="divcenter">
                    <p>Panel użytkownika</p>
                </div>
                <Row className="divcenter2">
                    <Col sm="6">
                        <Button onClick={onlyCurrentBookings}>Wyświetl monitoring</Button>
                    </Col>
                    <Col sm="6">
                        <Button onClick={notCurrentBookings}>Moje Rezerwacje</Button>
                    </Col>
                </Row>
                <div>
                <Table striped bordered hover>  
                    <thead> 
                        {show?(<tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Opis</th>
                            <th>Kamera</th>
                        </tr>):null}
                        
                        {show2?(<tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Początek</th>
                            <th>Koniec</th>
                            <th>Usuń</th>
                        </tr>):null}
                    </thead>
                    <tbody>
                    {show?currentBooking.map((item, index) => {
                        const {id, firstD, lastD, idUser, idAnimal, idRoom} = item;
                        return (
                            <ListBookings data={item} func={getCamId} key={index}/>
                        );
                    }):null}

                    {show2?notCurrentBooking.map((item, index) => {
                        const {id, firstD, lastD, idUser, idAnimal, idRoom} = item;
                        return (
                            <ListNewBookings data={item} func={removeBooking} key={index}/>
                        );
                    }):null
                    }


                    </tbody>    
                </Table>  
                </div>

                <div>
                    {turnOn?<Cam data={currentCamera}/>:null}
                </div>

            </div>
        </Container>

        </>
    )
    
}
/*
<Button onClick={onlyCurrentBookings}>Wyświetl monitoring</Button>

                    {show?currentBooking.map((item, index) => {
                        const {id, firstD, lastD, idUser, idAnimal, idRoom} = item;
                        return (
                            <ListBookings data={item} func={getCamId} key={index}/>
                        );
                    }):null
                    }

{turnOn?<Cam data={currentCamera}/>:null}
*/
//                    <button onClick={onlyCurrentBookings}></button>
const Cam = param =>{

    return <div className="mt-3"> 
        <Camera id={param.data}/>
    </div>
}



const ListBookings = (param) => {
    const [animal, setAnimal] = useState();
    const [camId, setCamId] = useState();

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("idrom" + param.data.IdRoom)
        Axios.get("http://localhost:5001/room/"+param.data.IdRoom).then((response)=>{
            setCamId(response.data.idCamera)
            param.func(response.data.idCamera)
        })

    }
    useEffect(() => {
        Axios.get("http://localhost:5001/animals/"+param.data.idAnimal).then((response)=>{
            console.log(response)
            setAnimal(response.data)

        })

    }, [])

    return (
        <tr>
            <td>{param.data.id_bookings}</td>
            <td>{animal && animal.name}</td>
            <td>{animal && animal.description}</td>
            <td><Button size="sm" onClick={handleSubmit}>Kamera</Button></td>      
        </tr>
    )

}

/*
        <Row className='mt-3'>
            <Col sm={1}>{param.data.id_bookings}</Col>
            <Col sm={3}>{animal && animal.name}</Col>
            <Col sm={6}>{animal && animal.description}</Col>

            <Col sm={2}>
                <Button size="sm" onClick={handleSubmit}>Kamera</Button>
            </Col>
        </Row>

*/

const ListNewBookings = (param) => {
    const [animal, setAnimal] = useState();
    const [camId, setCamId] = useState();

    const handleSubmit = (e)=>{
        e.preventDefault();
        Axios.delete("http://localhost:5001/booking/"+param.data.id_bookings).then((response)=>{
            param.func(param.data.id_bookings)
        })

    }
    useEffect(() => {
        Axios.get("http://localhost:5001/animals/"+param.data.idAnimal).then((response)=>{
            console.log(response)
            setAnimal(response.data)

        })

    }, [])

    return (
        <tr>
            <td>{param.data.id_bookings}</td>
            <td>{animal && animal.name}</td>
            <td>{param.data.firstDay}</td>
            <td>{param.data.lastDay}</td>
            <td><Button variant="outline-danger" size="sm" onClick={handleSubmit}>Usuń rezerwacje</Button></td>      
        </tr>
    )

}
/* 
        <Row className='mt-3'>
            <Col sm={1}>{param.data.id_bookings}</Col>
            <Col sm={2}>{animal && animal.name}</Col>
            <Col sm={2}>{param.data.firstDay}</Col>
            <Col sm={3}>{param.data.lastDay}</Col>
            <Col sm={4}>
                <Button variant="outline-danger" size="sm" onClick={handleSubmit}>Usuń rezerwacje</Button>
            </Col>
        </Row>

*/
export default UserPanel