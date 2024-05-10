const router = require("express").Router();
const foodController = require("../controllers/foodController");
const { verifyVendor } = require("../middleware/verifyToken");

router.post("/", verifyVendor, foodController.addFood);

router.get("/recommendation/:code", foodController.getRandomFood);

router.get("/byCode/:code", foodController.getAllFoodByCode);

router.get("/:id", foodController.getFoodById);
router.get("/restaurant-foods/:id", foodController.getFoodByRestaurant);

router.get("/search/:search", foodController.searchFoods);

router.get("/:category/:code", foodController.getFoodByCategoryAndCode);

module.exports = router;
