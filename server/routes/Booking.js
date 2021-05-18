const express = require("express");
const cors = require("cors");
const pool = require("../db");
let date_ob = new Date();

const router = express();
router.use(cors());
router.use(express.json()); //req.body

router.get("/date", (req, res) => {
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let day = ("0" + date_ob.getDate()).slice(-2);
    let date = (year+"-"+month+"-"+day)
    res.json(date)
})

//add booking
router.post("/", async(req, res)=>{ 
    try {
        const {id_bookings, firstDay, lastDay, idUser, idAnimal, IdRoom} = req.body
        const newBooking = await pool.query(
            "INSERT INTO bookings (id_bookings, firstDay, lastDay, idUser, idAnimal, IdRoom) VALUES (?,?,?,?,?,?)",
            [id_bookings, firstDay, lastDay, idUser, idAnimal, IdRoom]);

        res.json(newBooking);

    } catch (error) {
        console.log(error.message);
    }
})

//get all bookings
router.get("/", async(req,res)=>{
    try {
        const [allBookings] = await pool.query("SELECT * FROM bookings");
        if(allBookings.length===0){
            console.log("There are no bookings found");
        }
        res.json(allBookings);
    } catch (error) {
        console.log(error.message)
    }
})
//get free bookings
router.post("/free", async(req,res)=>{
    try {
        const {firstDay, lastDay} = req.body

        console.log(firstDay)
        const [roomsId] = await pool.query
        ("SELECT r.* FROM rooms r LEFT JOIN bookings b ON r.id_rooms = b.IdRoom AND ((b.firstDay<=? AND b.lastDay>=?) OR (b.firstDay>=? AND b.firstDay<=?)) WHERE b.id_bookings IS NULL",
        //("SELECT r.* FROM rooms r LEFT JOIN bookings b ON r.id_rooms = b.IdRoom AND ((b.firstDay<? AND b.lastDay>?) OR b.firstDay>?) WHERE b.id_bookings IS NULL",
        [firstDay, firstDay, firstDay, lastDay]);
        res.json(roomsId);
    } catch (error) {
        console.log(error.message)
    }
})

//get booking
router.get("/:id", async(req, res)=>{
    try { 
        const [booking] = await pool.query("SELECT * FROM bookings WHERE id_bookings=?",[req.params.id]);
        res.json(booking[0])
    } catch (error) {
        console.log(error.message);
    }
})

router.get("/user/:id", async(req, res)=>{
    try { 
        const [booking] = await pool.query("SELECT * FROM bookings WHERE idUser=?",[req.params.id]);
        res.json(booking)
    } catch (error) {
        console.log(error.message);
    }
})

//update a booking
router.put("/:id", async(req, res)=>{
    try {
        const [booking] = await pool.query("SELECT * FROM bookings WHERE id_bookings=?",[req.params.id]);

        if (booking.length === 0) {
            console.log("Invalid booking ID");
        }

        if (req.body.firstDay) booking[0].firstDay = req.body.firstDay;
        if (req.body.lastDay) booking[0].lastDay = req.body.lastDay;
        if (req.body.idUser) booking[0].idUser = req.body.idUser;
        if (req.body.idAnimal) booking[0].idAnimal = req.body.idAnimal;
        if (req.body.IdRoom) booking[0].IdRoom = req.body.IdRoom;


        const [update] = await pool.query(
            "UPDATE cameras SET firstDay=?, lastDay=?, idUser=?, IdRoom=? WHERE id_bookings=?",
            [booking[0].firstDay, booking[0].lastDay, booking[0].idUser, booking[0].idAnimal, booking[0].IdRoom, req.params.id]
        );
        
        res.json("Booking Updated");

    } catch (error) {
        console.log(error.message)
    }
})

//delete booking
router.delete("/:id", async(req,res)=>{
    try {
        const [booking] = await pool.query("DELETE FROM bookings WHERE id_bookings=?", [req.params.id]);
        res.json("booking deleted");
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router