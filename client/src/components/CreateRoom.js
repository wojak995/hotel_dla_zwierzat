import React from "react";

const CreateRoom = (props) => {
    function create() {
        const id = "5e0dd74f516f0de5fb51d9a0831d92862767c0ef77eea6e0543183364ccf04d7";
        props.history.push(`/test/${id}`);
    }
        function create2() {
        const id = "a5699e83d258a326a62a51ea2d0ddb4a8b63eca8763d3de83431a3ab888c209f";
        props.history.push(`/test/${id}`);
    }

    return (
        <div>
            <button onClick={create}>Create room</button>
            <button onClick={create2}>Create room2</button>
        </div>
    );
};

export default CreateRoom;