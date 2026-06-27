const express = require("express");
const {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
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

router.post("/", requiredAddressValidator, validate, addAddress);
router.post("/add", requiredAddressValidator, validate, addAddress);
router.get("/", getAddresses);
router.put("/:id/default", addressIdValidator, validate, setDefaultAddress);
router.put("/:id", updateAddressValidator, validate, updateAddress);
router.delete("/:id", addressIdValidator, validate, deleteAddress);

module.exports = router;
