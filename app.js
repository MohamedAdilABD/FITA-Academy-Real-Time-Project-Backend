const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;

const userrouter = require('./userrouter');

app.use( cors() );
app.use( express.json() );


// serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// connect to mongodb
mongoose.connect("mongodb://localhost:27017/FitaAcademy")
    .then(() => {
        console.log("Database Connected");
    })
    .catch(() => {
        console.log("Database Failed to Connect");
    });


// routes
app.use("/fita", userrouter);

app.listen(port, () => {
    console.log("Server running on port", port);
});