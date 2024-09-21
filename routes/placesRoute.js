const express = require("express");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const router = express.Router();
const {
  getAllPlaces,
  getPlacesById,
  createPlace,
  updatePlace,
  deletePlace,
  handleHome,
  exploreP,
} = require("../controllers/placeController");

// desc @get All places
// route @GET /places
// access-level @user, superAdmin
router.route("/").get(getAllPlaces);

// desc @create places
// route @POST /places
// access-level @admin, superadmin

router.route("/").post(uploadMiddleware.single("image"), createPlace);

router.route("/home").get(handleHome);

// desc @get a place
// route @GET /places/:id
// access-level @user,superAdmin
router.route("/:id").get(getPlacesById);

// desc @update a place
// route @PUT /places/:id
// access-level @admin, superAdmin
router.route("/:id").put(updatePlace);

// desc @delete a place
// route @DELETE /places/:id
// access-level @admin, superAdmin
router.route("/:id").delete(deletePlace);

// router.route("/places-p").get(placesP);

module.exports = router;
