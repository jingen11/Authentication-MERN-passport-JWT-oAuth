const mongoose = require('mongoose');

const keys = require('../keys');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
    (err) => {
        if (err) throw new Error(err);
        console.log("database is connected");
    }

);

