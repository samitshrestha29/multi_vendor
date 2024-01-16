const Restaurant = require("../models/Restaurant.js");
module.exports = {
  addRestaurant: async (req, res) => {
    const {
      title,
      time,
      imageUrl,
      foods,
      pickup,
      delivery,
      isAvailable,
      owner,
      code,
      logoUrl,
      coords,
    } = req.body;

    if (
      !title ||
      !time ||
      !imageUrl ||
      !owner ||
      !code ||
      !logoUrl ||
      !coords ||
      !coords.latitude ||
      !coords.longitude || // Fix the typo here
      !coords.address ||
      !coords.title
    ) {
      return res
        .status(400)
        .json({ status: false, message: "you have missing field" });
    }

    try {
      const newRestaurant = new Restaurant(req.body);

      await newRestaurant.save();
      res.status(201).json({
        status: true,
        message: "Restaurant has been added successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRestaurantById: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomRestaurants: async (req, res) => {
    const code = req.params.code;
    try {
      let randomRestaurant = [];
      if (code) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { code: code, isAvailable: true } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }
      if (randomRestaurant.length === 0) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { isAvailable: true } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }
      res.status(200).json(randomRestaurant);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllNearByRestaurants: async (req, res) => {
    const code = req.params.code;
    try {
      let randomRestaurants = [];
      if (code) {
        randomRestaurants = await Restaurant.aggregate([
          { $match: { code: code, isAvailable: true } },
          { $project: { __v: 0 } },
        ]);
        if (randomRestaurants.length === 0) {
          randomRestaurants = await Restaurant.aggregate([
            { $match: { isAvailable: true } },
            { $project: { __v: 0 } },
          ]);
        }
      }
      res.status(200).json(randomRestaurants);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
