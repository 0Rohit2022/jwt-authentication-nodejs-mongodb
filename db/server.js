const mongoose = require('mongoose');

mongoose.connect(process.env.db)
.then(() => {
    console.log("Database connected Succesfully");
})
.catch((err) => {
    res.status(500).send(err);
})