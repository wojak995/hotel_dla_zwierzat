const express = require("express");
const cors = require("cors");
const pool = require("../db");


const router = express();
router.use(cors());
router.use(express.json()); //req.body

//add camera
router.post("/", async(req, res)=>{ 
    try {
        const {id_cam, id, name, itsOn} = req.body
        const newCamera = await pool.query(
            "INSERT INTO cameras (id_cameras, id, name, itsOn) VALUES (?,?,?,?)",
            [id_cam, id, name, itsOn]);

        res.json(newCamera);

    } catch (error) {
        console.log(error.message);
    }
})

//get all cameras
router.get("/", async(req,res)=>{
    try {
        const [allCameras] = await pool.query("SELECT * FROM cameras");
        if(allCameras.length===0){
            console.log("There are no cameras found");
        }
        res.json(allCameras);
    } catch (error) {
        console.log(error.message)
    }
})

//get camera
router.get("/:id", async(req, res)=>{
    try { 
        const [camera] = await pool.query("SELECT * FROM cameras WHERE id_cameras=?",[req.params.id]);
        res.json(camera[0])
    } catch (error) {
        console.log(error.message);
    }
})

//update a camera
router.put("/:id", async(req, res)=>{
    try {
        const [camera] = await pool.query("SELECT * FROM cameras WHERE id_cameras=?",[req.params.id]);

        if (camera.length === 0) {
            console.log("Invalid camera ID");
        }

        if (req.body.name) camera[0].name = req.body.name;
        if (req.body.id) camera[0].id = req.body.id;
        if (req.body.itsOn!=null) camera[0].itsOn = req.body.itsOn;


        const [update] = await pool.query(
            "UPDATE cameras SET id=?, name=?, itsOn=? WHERE id_cameras=?",
            [camera[0].id, camera[0].name, camera[0].itsOn, req.params.id]
        );
        
        res.json("Camera Updated");

    } catch (error) {
        console.log(error.message)
    }
})

//delete camera
router.delete("/:id", async(req,res)=>{
    try {
        console.log("ID " + req.params.id)
        const [camera] = await pool.query("DELETE FROM cameras WHERE cameras.id_cameras=?", [req.params.id]);
        res.json("Camera deleted");
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router