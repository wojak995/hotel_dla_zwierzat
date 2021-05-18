const express = require("express");
const router = express.Router(); 
//const app = express();
const cors = require("cors");
const pool = require("../db");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session"); //tworzenie i utrzymywanie sesji
//express tworzy "stateless" http server, więc nie moglbym przechowywac tych informacji 

const jwt = require('jsonwebtoken');


const bcrypt = require("bcrypt");
const { header } = require("express-validator");
const saltRounds = 10;



// middleware

const port = process.env.PORT;
router.use(cors({
    origin: [`http://localhost:3000`],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true //allow to cookie be enabled 
}));
router.use(express.json()); //req.body
router.use(cookieParser())
router.use(bodyParser.urlencoded({extended: true}))

router.use(session({
    key: "userID",
    secret: "inzynierka",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24,

    }
}))
//*******Routes*********
//create a user
router.post("/", async(req, res)=>{ 
    try {
        const {id, login, pswd, name, surname, admin} = req.body

        const [user] = await pool.query("SELECT * FROM users WHERE login=?",[login]);

        if(user.length >= 1){
            res.json({message: "login occupied"})
        } else {

            //async dostarcza "await", ktory czeka na ukonczenie funckji zanim bedzie kontynuowal
            bcrypt.hash(pswd, saltRounds, async(error, hash) => { 
                if (error) {
                    res.send({error: error})
                }

            const newUser = await pool.query(
                "INSERT INTO users (id_users, login, pswd, name, surname, admin) VALUES (?,?,?,?,?,?)",
                [id, login, hash, name, surname, admin]);

            res.json(newUser);

            })
        }

    } catch (error) {
        console.log(error.message);
    }
})

//get all users
router.get("/", async(req, res) => {
    try {
        const [allUsers] = await pool.query("SELECT * FROM users");
        if (allUsers.length === 0) {
            console.log("there are no users found")
        }
        res.json(allUsers);
    } catch (error) {
        console.log(error.message)
    }
})

//login
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token) {
        res.send("There is no token send");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded)=> {
            if(err) {
                res.json({auth: false, message: "User failed to authenticate"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

router.get('/isAuthenticated', verifyJWT, (req,res)=> {
    res.json({auth: true, message: "User authenticated", id: req.userId})
})

router.get("/login", (req,res)=> {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }
});

router.post("/login", async(req, res)=>{
    try {
        
        //res.header("Access-Control-Allow-Origin", "*");
        //res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        const login = req.body.login
        const password = req.body.pswd

        const [user] = await pool.query("SELECT * FROM users WHERE login=?",
        [login]);
        

        if (user.length === 0) {
            res.json({auth: false, message: "Wrong login"})
        } else {
            bcrypt.compare(password, user[0].pswd, (error, result) =>{//result=true/false
                if (result) {
                    req.session.user = user

                    const id = user[0].id_users
                    const token = jwt.sign({id}, process.env.JWT_SECRET, {
                        expiresIn: 300,
                    })
                    console.log(token)
                    console.log(req.session.user) //
                    //res.send(user); //send bez tokenu 
                    res.json({auth: true, token: token, user: user})
                    console.log(result) //
                } else {
                    
                    console.log(user[0].pswd)
                    res.json({auth: false, message: "Wrong password"})
                }
            })
        }

        //res.json(checkUser)
    } catch (error) {
        console.log(error.message)
    }
})

//get a user
router.get("/:id", async(req, res)=>{
    try { 
        const [user] = await pool.query("SELECT * FROM users WHERE id_users=?",[req.params.id]);
        res.json(user[0])
    } catch (error) {
        console.log(error.message);
    }
})

//update a user
router.put("/:id", async(req, res)=>{
    try {
        const [user] = await pool.query("SELECT * FROM users WHERE id_users=?",[req.params.id]);

        if (user.length === 0) {
            console.log("Invalid user ID");
        }

        if (req.body.name) user[0].name = req.body.name;
        if (req.body.login) user[0].login = req.body.login;
        if (req.body.pswd) user[0].pswd = req.body.pswd;
        if (req.body.surname) user[0].surname = req.body.surname;
        if (req.body.admin!==null) user[0].admin = req.body.admin;

        const [update] = await pool.query(
            "UPDATE users SET name=?, login=?, pswd=?, surname=?, admin=? WHERE id_users=?",
            [user[0].name, user[0].login, user[0].pswd, user[0].surname, user[0].admin, req.params.id]
        );
        
        res.json("User Updated");

    } catch (error) {
        console.log(error.message)
    }
})


//delete a user
router.delete("/:id", async(req,res)=>{
    try {
        const [user] = await pool.query("DELETE FROM users WHERE id_users=?", [req.params.id]);
        res.json("User deleted");
    } catch (error) {
        console.log(error.message)
    }
})
//

module.exports = router