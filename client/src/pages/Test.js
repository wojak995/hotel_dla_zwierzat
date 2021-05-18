import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer"


const { promisify } = require('util')
const sleep = promisify(setTimeout)

const Test = (props) => {
    const socket = useRef();
    const userVideo = useRef();
    const [yourID, setYourID] = useState("");
    const [stream, setStream] = useState();
    const roomID = props.id
    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);


    useEffect(() => {
        socket.current = io('http://localhost:5001')

        const videoSource = roomID;
        console.log("vid: " + videoSource)
        navigator.mediaDevices.getUserMedia({
            audio: false, 
            video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        }).then(stream => {
            setStream(stream);
            if(userVideo.current){
                userVideo.current.srcObject = stream;
            }
            socket.current.emit("create room", roomID);
            console.log("create room")


            socket.current.on("all users", users => {
                console.log("all")
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socket.current.id, stream);
                    console.log(userID)
                    console.log(socket.current.id)
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

        }).catch(console.error)

        socket.current.on("yourID", id => {
            setYourID(id);   
        })

        socket.current.on("receiving returned signal", payload => {
            console.log("rec ret sig")
            const item = peersRef.current.find(p => p.peerID === payload.id);//szukamy od kogo sygnał
            item.peer.signal(payload.signal);
        });

    }, [])





    function createPeer(userToSignal, callerID, stream) {
        console.log("createPeer")
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            console.log("sending signal")
            socket.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        peer.on("close", () => {
            console.log('Connection destroyed');
            peer.destroy()
        })
        peer.on('error', err => {
            console.log(err);
        });
        return peer;
    }


    let UserVideo;
    if (stream) {
        UserVideo = (
        <video className="videoStyle" playsInline muted ref={userVideo} autoPlay />
        );
    }

    return (
        <div>
            {UserVideo}
        </div>
    )
}
export default Test
