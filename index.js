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

    app.get('/slider', async (req, res)=>{
        const cursor = bannerCollection.find({});
        const result = await cursor.toArray();
        if ((result.length) === 0) {
            res.json("No documents found!")
          } else {
            res.json(result)
          }
    })

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