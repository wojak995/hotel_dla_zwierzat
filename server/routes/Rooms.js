const express = require("express");
const cors = require("cors");
const pool = require("../db");


const router = express();
router.use(cors());
router.use(express.json()); //req.body

//add room
router.post("/", async(req, res)=>{ 
    try {
        const {id_rooms, type, idSize, idCamera} = req.body
        const newRoom = await pool.query(
            "INSERT INTO rooms (id_rooms, type, idSize, idCamera) VALUES (?,?,?,?)",
            [id_rooms, type, idSize, idCamera]);

        res.json(newRoom);

    } catch (error) {
        console.log(error.message);
    }
})

//get all rooms
router.get("/", async(req,res)=>{
    try {
        const [allRooms] = await pool.query("SELECT * FROM rooms");
        if(allRooms.length===0){
            console.log("There are no cameras found");
        }
        res.json(allRooms);
    } catch (error) {
        console.log(error.message)
    }
})

//assign camera to room
router.post("/assign", async(req, res)=>{
    console.log("assign")
    try {
        const {id_r, id_c} = req.body
        console.log(id_r + " " + id_c)
        const assign = await pool.query("UPDATE rooms SET idCamera=? WHERE id_rooms=?",
        [id_c, id_r])
        res.json(assign)
    } catch (error) {
        console.log(error.message)
    }
})

//get room
router.get("/:id", async(req, res)=>{
    try { 
        const [room] = await pool.query("SELECT * FROM rooms WHERE id_rooms=?",[req.params.id]);
        res.json(room[0])
    } catch (error) {
        console.log(error.message);
    }
})

//update a room
router.put("/:id", async(req, res)=>{
    try {
        const [room] = await pool.query("SELECT * FROM rooms WHERE id_rooms=?",[req.params.id]);

        if (room.length === 0) {
            console.log("Invalid room ID");
        }

        if (req.body.type) room[0].type = req.body.type;
        if (req.body.idSize) room[0].idSize = req.body.idSize;
        if (req.body.idCamera) room[0].idCamera = req.body.idCamera;


        const [update] = await pool.query(
            "UPDATE cameras SET id=?, name=?, itsOn=? WHERE id_cameras=?",
            [room[0].type, room[0].idSize, room[0].idCamera, req.params.id]
        );
        
        res.json("Room Updated");

    } catch (error) {
        console.log(error.message)
    }
})

//delete camera
router.delete("/:id", async(req,res)=>{
    try {
        const [room] = await pool.query("DELETE FROM rooms WHERE id_rooms=?", [req.params.id]);
        res.json("room deleted");
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router