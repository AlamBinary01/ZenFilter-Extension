const express = require("express");
const cors = require('cors');
const app = express();
const feedbackRouter = require("./router/feedbackR");
app.use(express.json());


app.use("/", require("./router/feedbackR"));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST","PUT", "DELETE"],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://haseebmushtaq2002:gnouImUJ6H9zxQpn@cluster0.uikfail.mongodb.net", { useNewUrlParser: true })
    .then(() => console.log("Connected To Database"))
    .catch(e => console.log("Database connection error:", e));

app.listen( 5000, () => {
    console.log(`Server started on port ${5000}`);
});
