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

App.post("/posts", (req, res) => {
    const data = Load(filePath);
    data.posts.push({
        ...req.body,
        "id": data.posts.length + 1,
        "commentCount": 0,
        "comments": []
    });
    Save(data, filePath);
    res.send("Success");
});

App.get("/posts/:id", (req, res) => {
    const id = req.params.id;
    const data = Load(filePath);
    res.send(data.posts.find(post => post.id === parseInt(id)));
});

App.get("/posts/:id/comments", (req, res) => {
    const data = Load(filePath);
    res.send(data.comments.filter(comment => comment.postId === parseInt(req.params.id)));
});

App.post("/posts/:id/comments", (req, res) => {
    const data = Load(filePath);
    data.comments.push({
        ...req.body,
        "id": data.comments.length + 1
    });
    data.posts.find(post => post.id === parseInt(req.params.id)).commentCount++;
    Save(data, filePath);
    res.send("Comment sent");
});

App.listen(3333, () => console.log("Running server..."));