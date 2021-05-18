import React, {useState, useRef, useEffect} from 'react'
import {Form, Container, Row, Col, FormGroup, Button, Alert} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Axios from 'axios'
import "react-datepicker/dist/react-datepicker.css";

const Rezerwacje = () => {
    const roomIdRef = useRef();
    const petNameRef = useRef();
    const petSpeciesRef = useRef();
    const [check, setCheck] = useState(false)
    const [show, setShow] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [rooms, setRooms] = useState();
    const userID = localStorage.getItem('userId')

    let date1=null
    let date2=null

    function handleDateSubmit(e) {
        e.preventDefault()
        setCheck(false)
        date1 = convertDate(startDate);
        if(endDate===null){
            date2 = convertDate(startDate)
        } else {
            date2 = convertDate(endDate);
        }
        console.log(date1 + " : " +date2)
        
        Axios.post("http://localhost:5001/booking/free", {
            firstDay: date1,
            lastDay: date2
        }).then((response)=>{
            setRooms(response.data)
            setCheck(true)
            if(response.data.length===0){
                setShow(false)
            } else {
                setShow(true)
            }
        }
        )
    }
    function handleSubmit(e) {
        e.preventDefault()
        console.log("handle submit")
        console.log(roomIdRef.current.value)
        Axios.post("http://localhost:5001/animals", {
            id_animals: null,
            name: petNameRef.current.value,
            species: petSpeciesRef.current.value,
            description: ""
        }).then((response)=>{
            console.log(response)
            checkAnimal()
        })
    }

    function checkAnimal() {
        Axios.post("http://localhost:5001/animals/new", {
            name: petNameRef.current.value,
            species: petSpeciesRef.current.value
        }).then((response)=>{
            console.log("check")
            let x = response.data[0].length - 1
            console.log(response.data[0][x].id_animals)

            addBooking(response.data[0][x].id_animals)
        })
    }

    function addBooking(id) {
        date1 = convertDate(startDate);
        if(endDate===null){
            date2 = convertDate(startDate)
        } else {
            date2 = convertDate(endDate);
        }
        Axios.post("http://localhost:5001/booking", {
            firstDay: date1,
            lastDay: date2,
            idUser: userID,
            idAnimal: id,
            IdRoom: roomIdRef.current.value
        }).then((response)=>{
            console.log()
        })

    }

    const convertDate = str => {
        str = str.toString();
        let parts = str.split(" ");
        let months = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
        };
        return parts[3] + "-" + months[parts[1]] + "-" + parts[2];
    };

    const onChange = dates => {
        const [start, end] = dates;
        setStartDate(start)
        setEndDate(end);
    };

    useEffect(()=>{
        console.log(userID)
    })
 
    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style={{minHeight: "15vh" }}>
            <div className="w-100" style={{maxWidth: "600px"}}>
                <div>
                <Form onSubmit={handleDateSubmit}>
                    <Row>
                    <Col sm={6}>
                        <FormGroup>
                        <DatePicker
                            dateFormat="yyyy mm dd"
                            selected={startDate}
                            onChange={onChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                        />
                        </FormGroup>
                    </Col>

                    <Col sm={6}>
                        <Button className="w-100" type="submit" variant="outline-secondary">
                        Sprawdź termin
                        </Button>
                        <Alert show={show&&check} variant="success" style={{top:12}}>
                            <Alert.Heading>Mamy wolne pokoje!</Alert.Heading>
                                <p>
                                Możesz dokonać rejestracji wypełniając poniższe formularze lub kontaktując się z nami.
                                </p><p>
                                Pod numerem: 666 777 888, 
                                </p><p>
                                Lub na: przykladowy@email.com    
                                </p>
                        </Alert>
                        <Alert show={!show&&check} variant="danger" style={{top:12}}>
                            <Alert.Heading>Terminy zajęte</Alert.Heading>
                                <p>
                                Proszę spróbować wybrać inny okres lub skontaktować się z nami:
                                </p><p>
                                Pod numerem: 666 777 888, 
                                </p><p>
                                Lub na: przykladowy@email.com
                                </p>
                        </Alert>
                    </Col>
                    </Row>
                </Form>
                </div>
                <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="chooseRoom">
                        <Form.Label>Wybierz pokój</Form.Label>
                        <Form.Control as="select" ref={roomIdRef} required>
                            {
                                    show?rooms.map((item) => {
                                        const {id, id_rooms, type, idSize, idCamera} = item;
                                        return (
                                            <option key={id_rooms}>{id_rooms}</option>
                                        );
                                    }):<option>Empty</option>
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group id="Imię">
                        <Form.Label>Imię zwierzęcia:</Form.Label>
                        <Form.Control type="text" ref={petNameRef} required />
                    </Form.Group>
                    <Form.Group id="Gatunek">
                        <Form.Label>Gatunek zwierzęcia:</Form.Label>
                        <Form.Control type="text" ref={petSpeciesRef} required />
                    </Form.Group>
                    <Button disabled={!show} className="w-100" type="submit">
                    Zarezerwuj pokój
                    </Button>
                </Form>
                </div>
            </div>
        </Container>
        </>
    )
}



export default Rezerwacje
