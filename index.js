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
    const careerInfoCollection = database.collection('career_page_info');
    const careerSidebarCollection = database.collection('career_sidebar');
    const aboutCollection = database.collection('about_info');
    const servicesCollection = database.collection('services');
    const contactCollection = database.collection('contact');
    const authCollection = database.collection('authentication_001_auth');
    const serviceIconsCollection = database.collection('service_icons');
    const socialCollection = database.collection('social_links');
    const mapCollection = database.collection('maps');
    const imageCollection = database.collection('images');

    app.put('/add-logo', upload.fields([{ name: 'featuredImage', maxCount: 1 }]), async (req, res) => {
      const images = req.files;
      const featuredImageFile = images['featuredImage'][0];
      const featuredImagePath = featuredImageFile.path.replace("\\", "/");

      console.log("the image", featuredImagePath)
      const filter = { _id: ObjectId("63260edf9664004f689dc50d") };
      const updateDoc = {
        $set: {
          logo: featuredImagePath,
        }
      }
      const result = await imageCollection.updateOne(filter, updateDoc)
      res.json(result)
    })
    app.put('/add-career-logo', upload.fields([{ name: 'gallaryImages', maxCount: 1 }]), async (req, res) => {
      const images = req.files;
      const careerLogoFile = images['gallaryImages'][0] && images['gallaryImages'][0];
      const careerImagePath = careerLogoFile && careerLogoFile.path.replace("\\", "/");

      const filter = { _id: ObjectId("63260edf9664004f689dc50d") };
      const updateDoc = {
        $set: {
          careerLogo: careerImagePath
        }
      }
      const result = await imageCollection.updateOne(filter, updateDoc)
      res.json(result)
    })
    app.put('/client-one', upload.fields([{ name: 'clientOne', maxCount: 1 }]), async (req, res) => {
      const images = req.files;
      const clientFile = images['clientOne'][0] && images['clientOne'][0];
      const clientImagePath = clientFile && clientFile.path.replace("\\", "/");

      const filter = { _id: ObjectId("6324a3f311440911952a8f1f") };
      const updateDoc = {
        $set: {
          imgUrlOne: clientImagePath
        }
      }
      const result = await reviewCollection.updateOne(filter, updateDoc)
      res.json(result)
    })
    app.put('/client-two', upload.fields([{ name: 'clientTwo', maxCount: 1 }]), async (req, res) => {
      const images = req.files;
      const clientFile = images['clientTwo'][0] && images['clientTwo'][0];
      const clientImagePath = clientFile && clientFile.path.replace("\\", "/");

      const filter = { _id: ObjectId("6324a3f311440911952a8f1f") };
      const updateDoc = {
        $set: {
          imgUrlTwo: clientImagePath
        }
      }
      const result = await reviewCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    app.put('/client-three', upload.fields([{ name: 'clientThree', maxCount: 1 }]), async (req, res) => {
      const images = req.files;
      const clientFile = images['clientThree'][0] && images['clientThree'][0];
      const clientImagePath = clientFile && clientFile.path.replace("\\", "/");

      const filter = { _id: ObjectId("6324a3f311440911952a8f1f") };
      const updateDoc = {
        $set: {
          imgUrlThree: clientImagePath
        }
      }
      const result = await reviewCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    app.get('/slider', async (req, res) => {
      const cursor = bannerCollection.findOne({ _id: ObjectId("63249f4aedfa774249454c95") });
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });
    app.put('/update-slider', async (req, res) => {
      const data = req.body;
      const {
        _id,
        titleOne,
        titleTwo,
        titleThree,
        titleFour,
        titleFive,
      } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          titleOne,
          titleTwo,
          titleThree,
          titleFour,
          titleFive,
        }
      };
      const result = await bannerCollection.updateOne(filter, updateDoc);
      res.json(result)
    });
    app.get('/features', async (req, res) => {
      const cursor = featuresCollection.findOne({ _id: ObjectId("6324a20311440911952a8f1e") });
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    })
    app.put('/update-feature', async (req, res) => {
      const data = req.body;
      const {
        _id,
        titleOne,
        titleTwo,
        titleThree,
        descOne,
        descTwo,
        descThree,
      } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          titleOne,
          titleTwo,
          titleThree,
          descOne,
          descTwo,
          descThree,
        }
      };
      const result = await featuresCollection.updateOne(filter, updateDoc);
      res.json(result)
    });
    app.get('/review', async (req, res) => {
      const cursor = reviewCollection.findOne({ _id: ObjectId("6324a3f311440911952a8f1f") });
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    })
    app.put('/update-review', async (req, res) => {
      const data = req.body;
      const {
        _id,
        nameOne,
        nameTwo,
        nameThree,
        reviewOne,
        reviewTwo,
        reviewThree
      } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          nameOne,
          nameTwo,
          nameThree,
          reviewOne,
          reviewTwo,
          reviewThree
        }
      };
      const result = await reviewCollection.updateOne(filter, updateDoc);
      res.json(result)
    });
    app.get('/titles', async (req, res) => {
      const cursor = titlesCollection.findOne({ _id: ObjectId("6320e348edfa77424998a0af") });
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });
    app.put('/update-title', async (req, res) => {
      const data = req.body;
      const {
        _id,
        title
      } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          title
        }
      };
      const result = await titlesCollection.updateOne(filter, updateDoc);
      res.json(result)
    });
    app.get('/contact-agent', async (req, res) => {
      const cursor = agentContactCollection.findOne({ _id: ObjectId("6320e78cedfa7742499f6ec8") });
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });
    app.put('/update-agent', async (req, res) => {
      const data = req.body;
      const {
        _id,
        title,
        number
      } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          title,
          number
        }
      };
      const result = await agentContactCollection.updateOne(filter, updateDoc);
      res.json(result)
    });
    app.get('/career-info', async (req, res) => {
      const query = { _id: ObjectId("6320ee02edfa774249a946bc") };
      const cursor = careerInfoCollection.findOne(query);
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });
    app.put('/update-career-info', async (req, res) => {
      const data = req.body;
      const { _id,
        pageTitle,
        pageDesc,
        teleMarketResponsobilityTitle,
        teleMarketResponsobilities,
        teleMarketrequireTitle,
        teleMarketrequirements,
        locationAddress,
        locationTitle,
        salaryAmount,
        salaryTitle,
        benefitsTitle,
        benefitsDesc,
        emailAddress,
        emailTitle,
        mailSubjectDetail,
        mailSubjectTitle } = data;
      const filter = { _id: ObjectId(_id) }
      const updateDoc = {
        $set: {
          pageTitle,
          pageDesc,
          teleMarketResponsobilityTitle,
          teleMarketResponsobilities,
          teleMarketrequireTitle,
          teleMarketrequirements,
          locationAddress,
          locationTitle,
          salaryAmount,
          salaryTitle,
          benefitsTitle,
          benefitsDesc,
          emailAddress,
          emailTitle,
          mailSubjectDetail,
          mailSubjectTitle
        }
      };
      const result = await careerInfoCollection.updateOne(filter, updateDoc);
      res.json(result)
    })
    app.get('/career-sidebar', async (req, res) => {
      const query = { _id: ObjectId("63217c3eedfa7742497b5067") };
      const cursor = careerSidebarCollection.findOne(query);
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });
    app.put('/update-career-sidebar', async (req, res) => {
      const data = req.body;
      const { _id,
        sidebarCountryName,
        officeAddressTitle,
        officeAddressDesc,
        officeHoursTitle,
        officeHoursDesc,
        sidebarPhone,
        sidebarEmail } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          sidebarCountryName,
          officeAddressTitle,
          officeAddressDesc,
          officeHoursTitle,
          officeHoursDesc,
          sidebarPhone,
          sidebarEmail
        }
      };
      const result = await careerSidebarCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
    app.get('/about', async (req, res) => {
      const query = { _id: ObjectId("63218480edfa77424987c834") };
      const cursor = aboutCollection.findOne(query);
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });
    app.put('/update-about', async (req, res) => {
      const data = req.body;
      const { _id, aboutTitle, aboutDesc, aboutAuthor } = data;
      const filter = { _id: ObjectId(_id) }
      const updateDoc = {
        $set: {
          aboutTitle,
          aboutDesc,
          aboutAuthor
        }
      };
      const result = await aboutCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
    app.get('/services', async (req, res) => {
      const query = { _id: ObjectId("63232897edfa774249098284") };
      const cursor = servicesCollection.findOne(query);
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });

    app.put('/update-services', async (req, res) => {
      const data = req.body;
      const { _id, serviceOneTitle, serviceOnedesc, serviceTwoTitle, serviceTwoDesc, serviceThreeTitle, serviceThreedesc } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          serviceOneTitle,
          serviceOnedesc,
          serviceTwoTitle,
          serviceTwoDesc,
          serviceThreeTitle,
          serviceThreedesc
        }
      };
      const result = await servicesCollection.updateOne(filter, updateDoc);
      res.json(result)
    });

    app.get('/contact', async (req, res) => {
      const query = { _id: ObjectId("632330f3edfa77424916eb67") };
      const cursor = contactCollection.findOne(query);
      const result = await cursor;
      if ((result.length) === 0) {
        res.json("No documents found!")
      } else {
        res.json(result)
      }
    });

    // update contact data
    app.put('/update-contact', async (req, res) => {
      const data = req.body;
      const { _id, contactTitle, optionOneTitle, optionTwoTitle, optionThreeTitle, optionFourTitle, optionOnedesc, optionTwoDesc, optionThreedesc, optionFourdesc } = data;
      const filter = { _id: ObjectId(_id) };
      const updateDoc = {
        $set: {
          contactTitle,
          optionOneTitle,
          optionTwoTitle,
          optionThreeTitle,
          optionFourTitle,
          optionFourdesc,
          optionOnedesc,
          optionThreedesc,
          optionTwoDesc
        },
      };
      const result = await contactCollection.updateOne(filter, updateDoc);
      res.json(result)
    })

    // get api for admin login
    app.get('/admin-login', async (req, res) => {
      const data = req.query;
      const cursor = authCollection.findOne({ _id: ObjectId("6324d3b711440911952a8f20") });
      const result = await cursor;
      if (data.email == result.email && data.pass == result.password) {
        res.json({ login: true })
      } else {
        res.json({ login: false })
      }
    })

    app.put('/admin-update', async (req, res) => {
      const data = req.body;
      const cursor = authCollection.findOne({ _id: ObjectId("6324d3b711440911952a8f20") });
      const authData = await cursor;
      const filter = { _id: ObjectId("6324d3b711440911952a8f20") };
      const updateDoc = {
        $set: {
          email: data.newEmail,
          password: data.newPass
        }
      }
      if (data.oldPass === authData.password && data.oldEmail === authData.email) {
        const result = await authCollection.updateOne(filter, updateDoc);
        res.json(result)
      } else {
        res.json("incorrect")
      }

    })

    // get api for service icons
    app.get('/service-icons', async (req, res) => {
      const cursor = serviceIconsCollection.findOne({ _id: ObjectId("6326034f9664004f689dc50a") });
      const result = await cursor;
      res.json(result)
    })

    app.put('/update-service-icons', async (req, res) => {
      const data = req.body;
      const { _id,
        serviceOneIcon,
        serviceTwoIcon,
        serviceThreeIcon, } = data;
      const filter = { _id: ObjectId(_id) }
      const updateDoc = {
        $set: {
          serviceOneIcon,
          serviceTwoIcon,
          serviceThreeIcon,
        }
      }
      const result = await serviceIconsCollection.updateOne(filter, updateDoc);
      console.log("hitted")
      res.json(result);
    })

    app.get('/social-links', async (req, res) => {
      const cursor = socialCollection.findOne({ _id: ObjectId("6326091c9664004f689dc50b") });
      const result = await cursor;
      res.json(result)
    })
    app.put('/update-social-links', async (req, res) => {
      const data = req.body;
      const { _id,
        facebook,
        linkedin, } = data;
      const filter = { _id: ObjectId(_id) }
      const updateDoc = {
        $set: {
          facebook,
          linkedin,
        }
      }
      const result = await socialCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
    app.get('/maps', async (req, res) => {
      const cursor = mapCollection.findOne({ _id: ObjectId("63260d089664004f689dc50c") });
      const result = await cursor;
      res.json(result)
    })
    app.put('/update-maps', async (req, res) => {
      const data = req.body;
      const { _id,
        contact,
        career, } = data;
      const filter = { _id: ObjectId(_id) }
      const updateDoc = {
        $set: {
          contact,
          career,
        }
      }
      const result = await mapCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
    app.get('/images', async (req, res) => {
      const cursor = imageCollection.findOne({ _id: ObjectId("63260edf9664004f689dc50d") });
      const result = await cursor;
      res.json(result)
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