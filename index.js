const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { info } = require('console');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send("360 support server")
})


// file upload folder
const uploads_folder = './uploads/';

// define storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploads_folder)
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
        const fullName = fileName + fileExt;
        cb(null, fullName);
    }
})


// file upload function
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3000000,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/webp" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true)
        } else {
            cb(new Error("Only webp, png, jpg and jpeg images are allowed"), false)
        }
    }
})

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.7lnyspm.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('project-360');
    const bannerCollection = database.collection('banner_data');
    const featuresCollection = database.collection('home_features');
    const reviewCollection = database.collection('client_review');
    const titlesCollection = database.collection('section_titles');
    const agentContactCollection = database.collection('contact_agent');
    const careerInfoContactCollection = database.collection('career_page_info');
    const careerSidebarContactCollection = database.collection('career_sidebar');

    app.get('/slider', async (req, res)=>{
        const cursor = bannerCollection.find({});
        const result = await cursor.toArray();
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    })
    app.get('/features', async (req, res)=>{
        const cursor = featuresCollection.find({});
        const result = await cursor.toArray();
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    })
    app.get('/review', async (req, res)=>{
        const cursor = reviewCollection.find({});
        const result = await cursor.toArray();
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    })
    app.get('/titles', async (req, res)=>{
        const cursor = titlesCollection.find({});
        const result = await cursor.toArray();
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    });
    app.get('/contact-agent', async (req, res)=>{
        const cursor = agentContactCollection.find({});
        const result = await cursor.toArray();
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    });
    app.get('/career-info', async (req, res)=>{
        const query = {_id: ObjectId("6320ee02edfa774249a946bc")};
        const cursor = careerInfoContactCollection.findOne(query);
        const result = await cursor;
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    });
    app.get('/career-sidebar', async (req, res)=>{
        const query = {_id: ObjectId("63217c3eedfa7742497b5067")};
        const cursor = careerSidebarContactCollection.findOne(query);
        const result = await cursor;
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    });

    app.use((err, req, res, next) => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        res.send("success")
      }
    })


  } finally {
    console.log("server operation complete")
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`listening to the port:  ${port}`)
})