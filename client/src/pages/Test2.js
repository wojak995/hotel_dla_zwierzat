import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer"

const Video = (props) => {
    const reff = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            reff.current.srcObject = stream;
        })
    }, []);

    return (
        <div>
            <video classname="videoStyle" controls autoPlay ref={reff} />
        </div>
    );
}


const Test2 = (props) => {
    const [stream, setStream] = useState();

    //const roomID = props.match.params.roomID
    const roomID = props.id
    const socket = useRef();
    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);
    useEffect(() => {
        socket.current = io("http://localhost:5001");

        socket.current.emit("join room", roomID);
        console.log("join room")

        socket.current.on("user joined", payload => {
            console.log("user joined")
            const peer = addPeer(payload.signal, payload.callerID, stream);
            console.log("peer")
            console.log(peer)
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })
            setPeers(users => [...users, peer]);
        });
        socket.current.on("close peer", () => {
            console.log("destroy peer")
            peersRef.current.destroy(); 
        })
        console.log("peers moj")
        console.log(peers)
    }, [])

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            console.log("returning signal")
            socket.current.emit("returning signal", { signal, callerID })
        })

        peer.on("close", () => {
            console.log('Connection destroyed');
            peer.destroy()
        })
        peer.on('error', err => {
            console.log(err);
        });

        peer.signal(incomingSignal);
        
        return peer;
    }
 

    return (
        <div>
            {/*Object.keys(users).map(key => {
                console.log(key)
                if (key === yourID) {
                    return null;
                }
                return (
                    <button onClick={() => callPeer(key)}>Call {key}</button>
                );
            })          
        */}
        {
            peers.map((peer, index)=> {
                return (
                    <Video key={index} peer={peer} />
                )
            })
        }

        </div>
    )
}

export default Test2
