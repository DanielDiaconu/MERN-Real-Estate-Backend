const { getProperties } = require("../controllers/properties");
const Property = require("../models/Property");
const router = require("express").Router();
const multer = require("multer");
const ObjectId = require("mongodb").ObjectId;

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/property");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

let upload = multer({ storage: fileStorageEngine });

router.get("/properties", (req, res) => {
  return getProperties(req, res);
});

router.post(
  "/properties",
  upload.fields([
    { name: "gallery", maxCount: 8 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    const { body } = req;

    const newProperty = new Property({
      name: body.name,
      overview: body.overview,
      cityId: ObjectId(body.cityId),
      amenities: body.amenities.split(",").map((amenity) => ObjectId(amenity)),
      ownerId: ObjectId(body.ownerId),
      area: body.area,
      categoryId: ObjectId(body.categoryId),
      catsAllowed: body.catsAllowed,
      dogsAllowed: body.dogsAllowed,
      views: body.views,
      built: body.built,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      address: body.address,
      isSponsored: body.isSponsored,
      gallery: req.files.gallery.map((file) => file.filename),
      thumbnail: req.files.thumbnail[0].filename,
      price: body.price,
    });
    try {
      const property = await newProperty.save();
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
