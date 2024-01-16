const router = require("express").Router();
const foodController = require("../controllers/foodController");

router.post("/", foodController.addFood);

router.get("/random/:code", foodController.getRandomFood);
router.get("/search/:search", foodController.searchFoods); // Corrected the route name
router.get("/:category/:code", foodController.getRandomFoodsByCategoryAndCode);

router.get("/recommendation/:code", foodController.getRandomFood);
router.get("/:id", foodController.getFoodById);
router.get("/restaurant-foods/:id", foodController.getFoodByRestaurant);

module.exports = router;
