const express = require("express");
const validateToken = require("../middleware/validateToken");

const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshController,
  currentUser,
  updatePassword,
  forgetPassword,
  resetPassword,
  // resendPasswordEmail,
  verifyEmail,
  isUser,
  isAdmin,
} = require("../controllers/userController");

router.route("/userhome").get(validateToken, isUser, currentUser);

// desc @create/register Users
// route @POST /users
// access-level @user, superadmin
router.route("/register").post(verifyEmail);
router.route("/register-verified/:token").post(createUser);

// desc @login a User
// route @POST /users/login
// access-level @user, superAdmin
router.route("/login").post(isUser, loginUser);

router.route("/place").get((req, res) => {
  return res.status(200).send({
    message: "Places displayed!",
  });
});

// desc @login a User
// route @POST /users/login
// access-level @user, superAdmin
router.route("/logout").post(validateToken, logoutUser);

router.route("/refresh").post(refreshController);

// desc @current User info
// route @GET /users/current
// access-level @user, superAdmin
router.route("/current").get(validateToken, currentUser);

router.route("/password/:id").put(validateToken, updatePassword);

router.route("/forget-password").post(forgetPassword);
// router.route("/forget-password/resend").post(resendPasswordEmail);

router.route("/reset-password").post(resetPassword);

// desc @get a User
// route @GET /users/:id
// access-level @user,superAdmin
router.route("/:id").get(getUserById);

// desc @update a User
// route @PUT /users/
// access-level @user, superAdmin
router.route("/").put(validateToken, updateUser);

// desc @delete a User
// route @DELETE /users/
// access-level @user, superAdmin
router.route("/").delete(validateToken, deleteUser);

// desc @get All Users
// route @GET /users
// access-level @superAdmin
router.route("/").get(getAllUsers);

const link = (module.exports = router);
