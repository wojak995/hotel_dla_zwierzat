import Axios from 'axios';
import React, {useState, useEffect, useRef} from 'react'



const Camera = () => {
    const videoEl = useRef(null);
    const [cameras, setCameras] = useState([]);

    const userCamera = (id) => {
        console.log("useCamera")
        if (!videoEl) {
            return
        }
        const videoSource = id;
        console.log("xdd "+id)
        navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
            }).then(stream => {
        let video = videoEl.current
        console.log(stream)
        video.srcObject = stream;
        video.play();
    }).catch(console.error)
}
    

    const addCamera = (name, camid, idd) => {
        console.log("add camera")
        const cam = {id: idd, name, camid}
        console.log(cam)
        setCameras((cameras)=>{
            return [...cameras, cam]
        }) 

    }

    useEffect(() => {
        console.log("USE EFFECT CAMERA")
        Axios.get("http://localhost:5001/camera").then((response) => {
            console.log(response.data) 
            for(const device of response.data){
                addCamera(device.name, device.id, device.id_cameras)
            }
        })
    }, [])

    return (
        <div>
            <p>TEST</p>
            {
                cameras.map((item) => {
                    const {id, camid} = item;
                    console.log("item V")
                    console.log(item)
                    return (
                        <div key={id}>
                            <h4>{camid}</h4>
                            <button onClick={() => userCamera(camid)}>usecam</button>
                            {console.log("LISTA " + camid + id)}
                        </div>
                    );
                })
            }<video ref={videoEl}/>
        </div>
    )
}

export default Camera
