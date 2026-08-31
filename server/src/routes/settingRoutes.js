const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect, authorize("admin"));

router.route("/").get(getSettings).put(updateSettings);

module.exports = router;