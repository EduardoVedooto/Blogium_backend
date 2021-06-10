import express from "express";
import cors from "cors";
import Load from "./utils/Load.js";
import Save from "./utils/Save.js";

const App = express();
App.use(express.json());
App.use(cors());

const filePath = "./data.json";

App.get("/posts", (req, res) => {
    res.send(Load(filePath));
});

// App.post("/posts", (req, res) => {

// })

App.listen(3333, () => console.log("Running server..."));