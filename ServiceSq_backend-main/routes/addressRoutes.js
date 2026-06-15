const express = require("express");
const {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress
} = require("../controllers/addressController");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  addressIdValidator,
  requiredAddressValidator,
  updateAddressValidator
} = require("../validators/addressValidators");

const router = express.Router();

router.use(protect);

router.post("/add", requiredAddressValidator, validate, addAddress);
router.get("/", getAddresses);
router.put("/:id", updateAddressValidator, validate, updateAddress);
router.delete("/:id", addressIdValidator, validate, deleteAddress);

module.exports = router;
