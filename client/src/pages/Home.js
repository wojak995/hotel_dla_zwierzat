import React, { useState, useRef } from 'react'
import { useUser } from '../context/UserContext'
import {Carousel} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

const Home = (props) => {

    return (
        <Carousel>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://cdn.pixabay.com/photo/2015/07/27/19/11/beach-863139_960_720.jpg"
                alt="First slide"
                />
                <Carousel.Caption>
                <h3>Nie masz konta?</h3>
                <p>Kliknij, żeby założyć konto i dołączyć do naszej społeczności</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://cdn.pixabay.com/photo/2015/02/21/10/39/dog-644111_960_720.jpg"
                alt="Third slide"
                />

                <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://cdn.pixabay.com/photo/2020/03/22/15/25/fetch-4957501_960_720.jpg"
                alt="Third slide"
                />

                <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
        
    )
}

export default Home




/* const videoEl = useRef(null);
    const [role, setRole] = useState("");
    const [loginStatus, setLoginStatus] = useState("false");

    const [cameras, setCameras] = useState([]); 

    const {checkAuthentication, isAdmin} = useUser();


    const addCamera = (camid, idd) => {
        const cam = {id: idd, camid}
        console.log(cam)
        setCameras((cameras)=>{
            return [...cameras, cam]
        }) 

    }

    function getCameras() {
        let i =0;
        navigator.mediaDevices.enumerateDevices().then(function(devices) {
            for(const device of devices) {
                console.log(device)
                //console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                if (device.kind === 'videoinput') {
                    console.log("ID "+device.deviceId+" dLa "+device.label+" iter "+i);
                    addCamera(device.deviceId, i);
                    i = i+1;
                }
        }})
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }


    const userCamera = (id) => {
        console.log("useCamera")
        if (!videoEl) {
            return
        }
        const videoSource = id;
        console.log("xdd "+id)
        navigator.mediaDevices.getUserMedia({
        audio: false,
        //video: true
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
            }).then(stream => {
        let video = videoEl.current
        console.log(stream)
        video.srcObject = stream;
        video.play();
    }).catch(console.error)
    }
    */
/*
    useEffect(() => {
        console.log("USE EFFECT")
        Axios.get("http://localhost:5001/user/login").then((response) => {
            console.log(response.data.loggedIn)
            if(response.data.loggedIn===true){
                setLoginStatus("true")
                setRole(response.data.user[0].admin)
                console.log("USER")
                console.log(response.data.user[0].admin)

            }   
            else {
                console.log("not logged")
            }
        })
    }, [])*/    
    
///////////return 
/*        <div>
            <h1>{role?"true":"false"}</h1>
            <h1>{loginStatus}</h1>
            <h1>{loginStatus?role:"Not logged"}</h1>
            
            {
                cameras.map((item) => {
                    const {id, camid} = item;
                    console.log(item)
                    return (
                        <div key={id}>
                            <h4>{camid}</h4>
                            <button onClick={() => userCamera(camid)}>usecam</button>
                            {console.log("LISTA " + camid + id)}
                        </div>
                    );
                })
            }
            
            <button onClick={getCameras}>aaaa</button>
            <div className="select">
                <label htmlFor="audioSource">Audio source: </label><select id="audioSource"></select>
            </div>

            <div className="select">
                <label htmlFor="videoSource">Video source: </label><select id="videoSource"></select>
            </div>
            <video ref={videoEl}/>

            <button onClick={()=>{console.log(isAdmin)}}>Sprawdź poświadczenie</button>
        </div>*/