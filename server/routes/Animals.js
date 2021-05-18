const express = require("express");
const cors = require("cors");
const pool = require("../db");


const router = express();
router.use(cors());
router.use(express.json()); //req.body

//add animal
router.post("/", async(req, res)=>{ 
    try {
        const {id_animals, name, species, desc} = req.body
        const newAnimal = await pool.query(
            "INSERT INTO animals (id_animals, name, breed, description) VALUES (?,?,?,?)",
            [id_animals, name, species, desc]);

        res.json(newAnimal);
    } catch (error) {
        console.log(error.message);
    }
})

//get last added animal 
router.post("/new", async(req, res)=>{
    try {
    const {name, species} = req.body
    console.log(name+" "+species)
    const returnAnimal = await pool.query(
        "SELECT id_animals FROM animals WHERE name=? AND breed=?", [name, species]);
    res.json(returnAnimal); 
    } catch (error){
        console.log(error.message)
    }
})

//get all animals
router.get("/", async(req,res)=>{
    try {
        const [allAnimals] = await pool.query("SELECT * FROM animals");
        if(allAnimals.length===0){
            console.log("There are no animals found");
        }
        res.json(allAnimals);
    } catch (error) {
        console.log(error.message)
    }
})

//get animal
router.get("/:id", async(req, res)=>{
    try { 
        const [animal] = await pool.query("SELECT * FROM animals WHERE id_animals=?",[req.params.id]);
        res.json(animal[0])
    } catch (error) {
        console.log(error.message);
    }
})

//update a animal
router.put("/:id", async(req, res)=>{
    console.log("update")
    try {
        const [animal] = await pool.query("SELECT * FROM animals WHERE id_animals=?",[req.params.id]);

        if (animal.length === 0) {
            console.log("Invalid animal ID");
        }

        if (req.body.name) animal[0].name = req.body.name;
        if (req.body.breed) animal[0].breed = req.body.breed;
        if (req.body.description) animal[0].description = req.body.description;


        const [update] = await pool.query(
            "UPDATE animals SET name=?, breed=?, description=? WHERE id_animals=?",
            [animal[0].name, animal[0].breed, animal[0].description, req.params.id]
        );
        
        res.json("Animal Updated");

    } catch (error) {
        console.log(error.message)
    }
})

//delete animal
router.delete("/:id", async(req,res)=>{
    try {
        const [animal] = await pool.query("DELETE FROM animals WHERE id_animals=?", [req.params.id]);
        res.json("Animal deleted");
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router