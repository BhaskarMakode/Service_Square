const Address = require("../models/Address");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const addressFields = [
  "fullName",
  "phone",
  "houseNo",
  "street",
  "city",
  "state",
  "pincode",
  "landmark",
  "isDefault"
];

const buildAddressPayload = (body) => {
  return addressFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
    return payload;
  }, {});
};

const addAddress = asyncHandler(async (req, res) => {
  const addressCount = await Address.countDocuments({ userId: req.user._id });
  const makeDefault = req.body.isDefault === true || addressCount === 0;

  if (makeDefault) {
    await Address.updateMany({ userId: req.user._id, isDefault: true }, { isDefault: false });
  }

  const address = await Address.create({
    ...buildAddressPayload(req.body),
    userId: req.user._id,
    isDefault: makeDefault
  });

  return sendSuccess(res, 201, "Address added successfully.", {
    address
  });
});

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

  return sendSuccess(res, 200, "Addresses fetched successfully.", {
    addresses
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

  const payload = buildAddressPayload(req.body);

  if (payload.isDefault === true) {
    await Address.updateMany(
      { userId: req.user._id, _id: { $ne: address._id }, isDefault: true },
      { isDefault: false }
    );
  }

  Object.assign(address, payload);
  await address.save();

  return sendSuccess(res, 200, "Address updated successfully.", {
    address
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

  const wasDefault = address.isDefault;
  await address.deleteOne();

  if (wasDefault) {
    const nextDefault = await Address.findOne({ userId: req.user._id }).sort({ updatedAt: -1, createdAt: -1 });

    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }

  return sendSuccess(res, 200, "Address deleted successfully.", {
    deletedAddressId: req.params.id
  });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

  await Address.updateMany(
    { userId: req.user._id, _id: { $ne: address._id }, isDefault: true },
    { isDefault: false }
  );
  address.isDefault = true;
  await address.save();

  return sendSuccess(res, 200, "Default address updated successfully.", { address });
});

module.exports = {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress
};
