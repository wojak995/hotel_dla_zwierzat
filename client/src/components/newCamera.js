import React, {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import {Form, Row, Col, Button, Container} from 'react-bootstrap'


const NewCamera = (props) => {
    const camName = useRef()
    const [cams, setCams] = useState([]);
    const [newCams, setNewCams] = useState([]);
    const [ready, setReady] = useState(false)

    function removeCamera(id){
        let temp = [...cams]
        let reTemp = [...newCams]

        for(var i=0; i<temp.length; i++){
            reTemp = newCams.filter((item)=>item.camid === temp[i].id)
        }
        console.log("deleted")
        console.log(reTemp)
        setNewCams(reTemp)
        setReady(true);
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(camName.current.value)
        let nam = camName.current.value
        let temp = camName.filter((item)=>item.name === nam)

        props.func(temp[0].id, temp[0].name)
        console.log(temp[0].id+" "+temp[0].name)
    }

    function handleClick(e){
        e.preventDefault();
        console.log("s")
        console.log(newCams)
        console.log(cams)
    }


    const addCamera = (camid, idd, name) => {
        const cam = {id: idd, camid, name}
        console.log(cam)
        setNewCams((cameras)=>{
            return [...cameras, cam]
        }) 
    }

    async function getCams(){
        let i =0;
        setNewCams([])
        setReady(false)
        await navigator.mediaDevices.enumerateDevices().then(function(devices) {
            for(const device of devices) {
                console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                if (device.kind === 'videoinput') {
                    console.log("ID "+device.deviceId+" dLa "+device.label+" iter "+i);
                    addCamera(device.deviceId, i, device.label);
                    i = i+1;
                }
        }})
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
        removeCamera()
    }


    useEffect(() => {
        Axios.get("http://localhost:5001/camera").then((response) => {
            console.log(response.data)
            setCams(response.data)
            getCams();
        }) 
    }, [])

    return (
        <Row>
            <Form inline onSubmit={handleSubmit} className="w-100 mt-3" >
            <Col sm={9}>
                <Form.Group controlId="newCameras">
                    <Form.Control as="select" ref={camName} required>
                    {
                        ready?newCams.map((item)=>{
                            const {id, camid, name} = item;
                            return(
                                <option key={id}>{name}</option>
                            )
                        }):<option>Empty</option>
                    }
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col sm={3}>
                <Button className="pull-right" type="submit">Dodaj</Button>
            </Col>
            </Form>
            

        </Row>
    )
}

export default NewCamera
