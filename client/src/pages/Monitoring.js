import React, {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import Test from './Test'
import {Row, Col, Container, Button, Form} from 'react-bootstrap'
import { FaTemperatureHigh } from 'react-icons/fa'

const Monitoring = () => {
    const [cameras, setCameras] = useState([])
    const [animals, setAnimals] = useState([])
    const [show, setShow] = useState(false) 
    const [show2, setShow2] = useState(false)
    const [currentDate, setCurrentDate] = useState();
    const [allBookings, setAllBookings] = useState([])
    const [currentBooking, setCurrentBooking]=useState([]); 

    function handleClick(){
        setShow2(false)
        setShow(true)
    }
    function handle2Click(){
        onlyCurrentBookings(); 
    }

    const onlyCurrentBookings = () => {
        let temp = allBookings.filter((item)=>(item.firstDay+1 <= currentDate && item.lastDay+1>=currentDate))
        console.log(temp)
        fetchAnimals(temp)
        setCurrentBooking(temp)
    }

    /*async function fetchAnimals(param){
        await fetchAnim(param)
        
    }*/

    function fetchAnimals(param){
        setAnimals([])
        console.log(param)
        /*Axios.get("http://localhost:5001/animals/"+param.data.idAnimal).then((response)=>{
            console.log(response)
        })*/
        param.forEach(element => {
            Axios.get("http://localhost:5001/animals/"+element.idAnimal).then((response)=>{
                setAnimals((animal)=>{
                    console.log(response.data)
                    return [...animal, response.data]
                })
            })
        });
        console.log("after")
        console.log(animals)
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

    async function fetchData(){
        await fetch();
        setShow(true);
    }

    async function filterData(data){
        let temp = await filter(data)
        setCameras(temp)
    }

    function filter(data){
        let temp = data.filter((item)=>item.itsOn !== 0)
        return temp 
    }

    function fetch(){
        Axios.get("http://localhost:5001/camera").then((response)=>{
            console.log(response.data)
            filterData(response.data)
        })

        Axios.get("http://localhost:5001/booking/date").then((response)=>{
            console.log(response.data)
            setCurrentDate(response.data)
        })

        Axios.get("http://localhost:5001/booking").then((response)=>{
            console.log(response.data)
            fixDates(response.data)
        })
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style={{minHeight: "10vh" }}>
            <div style={{maxWidth: "700px"}}>                      
            <Row>
                
                <Col sm={6}>   
                    <Button onClick={handleClick}>Monitoring</Button>   
                </Col>
                <Col sm={6}><Button onClick={handle2Click}>Zwierzęta</Button></Col>
                
            </Row>

            <Row>
            {
                show?cameras.map((item, index)=>{
                    return (<Col><Camera data={item} key={index}/></Col>)
                }):null
            }
            </Row>
            
            <div>
            {
                show2?animals.map((item, index)=>{
                    return (<Animal data={item} key={index}/>)
                }):null
                    
            }
            </div>

        </div>
        </Container>
        </>
    )
}


const Camera = param => {
    return <div className="mt-3"> 
        <Test id={param.data.id}/>
    </div>
}

const Animal = param => {
    const [animal, setAnimal] = useState();
    const typeRef = useRef()

    function handleSubmit(e){
        e.preventDefault()
        Axios.put("http://localhost:5001/animals/"+param.data.id_animals,{
            name: null,
            breed: null,
            description: typeRef.current.value
        }).then((response)=>{
            console.log(response)
        })
    }

    return (
        <Row className='mt-3'>
                <Col sm={1}>{param.data.id_animals}</Col>
                <Col sm={3}>{param.data.name}</Col>
                <Col sm={6}>
                    <Form.Control size="sm" type="text" ref={typeRef} required placeholder="Opis"/>
                </Col>
                <Col sm={2}>
                    <Button size="sm" onClick={handleSubmit}>Dodaj</Button>
                </Col>
        </Row>
    )
}

export default Monitoring




    /*return <>
     <Container>
        <Row className="mt-3">
            <Col md={8}>
                <Test id={param.data.id}/>
            </Col>
            <Col md={4}>
                <Form>
                    <Row>
                        <Form.Group controlId="animalInfo">
                            <Form.Label>Wpis o statusie zwierzęcia</Form.Label>
                            <Form.Control as="textarea" rows={9} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Button size="sm" type="submit">Dodaj</Button>
                    </Row>
                </Form>
            </Col>
        </Row>
    </Container>
        </>
        */