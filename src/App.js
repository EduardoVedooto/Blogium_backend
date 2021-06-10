import express from "express";
import cors from "cors";
import validUrl from "valid-url";
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
    const body = req.body;
    if (!body.title || !body.coverUrl || !body.content || !validUrl.isUri(body.coverUrl)) {
        res.status(400).send(`Todos os campos do formulário precisam ser válidos.`);
    } else {
        data.posts.push({
            ...req.body,
            "id": data.posts[data.posts.length - 1].id + 1 || 1,
            "commentCount": 0,
            "comments": []
        });
        Save(data, filePath);
        res.send("Success");
    }
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

App.put("/posts/:id", (req, res) => {
    const data = Load(filePath);
    const post = data.posts.find(post => post.id === parseInt(req.params.id));
    post.title = req.body.title;
    post.coverUrl = req.body.coverUrl;
    post.content = req.body.content;
    Save(data, filePath);
    res.send(post);
});

App.delete("/posts/:id", (req, res) => {
    const data = Load(filePath);
    const post = data.posts.find(post => post.id === parseInt(req.params.id));
    data.posts.splice(data.posts.indexOf(post), 1);
    data.comments = data.comments.filter(comment => comment.postId !== parseInt(req.params.id));
    Save(data, filePath);
    res.send("Post deleted");
});

App.listen(3333, () => console.log("Running server..."));