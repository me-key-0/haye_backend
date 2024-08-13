const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlacesById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");

// desc @get All places
// route @GET /places
// access-level @user, superAdmin
router.route("/").get(getAllPlaces);

// desc @create places
// route @POST /places
// access-level @admin, superadmin
router.route("/").post();

// desc @get a place
// route @GET /places/:id
// access-level @user,superAdmin
router.route("/:id").get();

// desc @update a place
// route @PUT /places/:id
// access-level @admin, superAdmin
router.route("/:id").put();

// desc @delete a place
// route @DELETE /places/:id
// access-level @admin, superAdmin
router.route("/:id").delete();

module.exports = router;
