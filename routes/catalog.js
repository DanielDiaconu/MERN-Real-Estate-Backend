const router = require("express").Router();
const Property = require("../models/Property");
const ObjectId = require("mongodb").ObjectId;

router.get("/properties", async (req, res) => {
  const filterQuery = {};

  for (let key in req.query) {
    if (key === "price" || key === "area") {
      filterQuery[key] = {
        $gte: req.query[key][0],
        $lte: req.query[key][1],
      };
    } else if (key === "categoryId") {
      filterQuery[key] = req.query[key].map((item) => ObjectId(item));
    } else if (Array.isArray(req.query[key])) {
      filterQuery[key] = {
        $all: req.query[key].map((item) => ObjectId(item)),
      };
    } else {
      filterQuery[key] = req.query[key];
    }
  }

  let query = Property.find(filterQuery).populate({
    path: "cityId",
    select: "name",
  });
  const totalCount = await Property.find(filterQuery).count();

  query.sort({ premium: -1 });

  if (req.query.sort) {
    query = query.sort(req.query.sort);
  }

  query = query.skip(parseInt(req.query.skip)).limit(6);

  try {
    const properties = await query;
    res.status(200).json({
      data: properties,
      totalCount,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
