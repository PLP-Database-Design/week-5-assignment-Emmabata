//Declare dependencies
const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require("cors");

app.use(express.json());
app.use(cors());
dotenv.config();


//Create Connection to the database
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

port = process.env.PORT;
//Establish connection
db.connect((err) => {
    if(err) {
        return console.error("Error connecting to database", err);
    }
    app.set("view engine", "ejs");
    app.set("views", __dirname + "/views");

    console.log("connected to the database");

//1. Retrieve all patients(patient_id, first_name, last_name & date_of_birth)
app.get("/patients", (req, res) => { 
    const query = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
    db.query(query, (err, results) => {
        if(err) {
            return res.status(500).json({
                error: "Error fetching patients"
            });
        }
        res.render("patients", {patients: results});
    });
});



//2. Retrieve all providers. Create a ```GET``` endpoint that displays all providers with their: first_name, last_name, provider_specialty
app.get("/providers", (req, res) => {
    const query = "SELECT first_name, last_name, provider_specialty FROM providers";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching providers" });
        }
        // Render the providers.ejs file with the results
        res.render("providers", { providers: results });
    });
});


//3. Filter patients by First Name
app.get("/patients/filter", (req, res) => {
    const { first_name } = req.query;
    if (!first_name) {
        return res.status(400).json({ error: "Please provide a first name to filter" });
    }
    const query = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
    db.query(query, [first_name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error filtering patients" });
        }
        // Render the filteredPatients.ejs file with the results
        res.render("filteredPatients", { patients: results });
    });
});

//4. Retrieve all providers by their specialty
app.get("/providers/specialty/:specialty", (req, res) => {
    const { specialty } = req.params;
    const query = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
    db.query(query, [specialty], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching providers by specialty" });
        }
        // Render the providersBySpecialty.ejs file with the results
        res.render("providersBySpecialty", { providers: results });
    });
});
    app.listen(port, () => {
        console.log(`server is running on port:${port}`)
    })
});