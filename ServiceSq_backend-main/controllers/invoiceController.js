const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const {
  buildInvoiceTotals,
  generateInvoiceNumber,
  mapPaymentStatus
} = require("../services/invoiceService");

const invoicePopulation = [
  { path: "bookingId", select: "serviceType status paymentStatus scheduledStart scheduledEnd address amount" },
  { path: "customerId", select: "name phone email avatar role" },
  {
    path: "providerId",
    populate: {
      path: "userId",
      select: "name phone email avatar role"
    }
  }
];

const bookingPopulation = [
  { path: "customerId", select: "name phone email avatar role" },
  {
    path: "providerId",
    populate: {
      path: "userId",
      select: "name phone email avatar role"
    }
  }
];

const ensureInvoiceAccess = async ({ req, booking }) => {
  if (req.user.role === "admin") {
    return;
  }

  if (booking.customerId._id.toString() === req.user._id.toString()) {
    return;
  }

  if (req.user.role === "provider") {
    const provider = await ProviderProfile.findOne({ userId: req.user._id }).select("_id");

    if (provider && booking.providerId._id.toString() === provider._id.toString()) {
      return;
    }
  }

  throw new AppError("You are not allowed to access this invoice.", 403);
};

const createInvoiceRecord = async ({ booking, payment }) => {
  const totals = buildInvoiceTotals(booking.amount);
  const providerUser = booking.providerId && booking.providerId.userId;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Invoice.create({
        bookingId: booking._id,
        customerId: booking.customerId._id,
        providerId: booking.providerId._id,
        ...totals,
        currency: payment ? payment.currency : process.env.PAYMENT_CURRENCY || "INR",
        paymentStatus: mapPaymentStatus({ booking, payment }),
        invoiceNumber: generateInvoiceNumber(),
        generatedAt: new Date(),
        lineItems: [
          { label: `${booking.serviceType} service`, amount: totals.amount },
          { label: "Taxes", amount: totals.taxes },
          { label: "Platform fee", amount: totals.platformFee }
        ],
        customerSnapshot: {
          name: booking.customerId.name,
          phone: booking.customerId.phone,
          email: booking.customerId.email
        },
        providerSnapshot: {
          providerId: booking.providerId._id,
          name: providerUser && providerUser.name,
          phone: providerUser && providerUser.phone,
          email: providerUser && providerUser.email,
          category: booking.providerId.category
        },
        bookingSnapshot: {
          serviceType: booking.serviceType,
          scheduledStart: booking.scheduledStart,
          scheduledEnd: booking.scheduledEnd,
          address: booking.address
        }
      });
    } catch (error) {
      if (error.code !== 11000 || attempt === 4) {
        throw error;
      }
    }
  }

  throw new AppError("Could not generate invoice number.", 500);
};

const getInvoiceByBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate(bookingPopulation);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  await ensureInvoiceAccess({ req, booking });

  if (booking.status !== "completed") {
    throw new AppError("Invoice can only be generated for completed bookings.", 400);
  }

  const payment = await Payment.findOne({ bookingId: booking._id });
  let invoice = await Invoice.findOne({ bookingId: booking._id });

  if (!invoice) {
    invoice = await createInvoiceRecord({ booking, payment });
  } else if (invoice.paymentStatus !== mapPaymentStatus({ booking, payment })) {
    invoice.paymentStatus = mapPaymentStatus({ booking, payment });
    await invoice.save();
  }

  await invoice.populate(invoicePopulation);

  return sendSuccess(res, 200, "Invoice fetched successfully.", {
    invoice
  });
});

const getInvoiceHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.user.role === "customer") {
    filter.customerId = req.user._id;
  } else if (req.user.role === "provider") {
    const provider = await ProviderProfile.findOne({ userId: req.user._id }).select("_id");
    filter.providerId = provider ? provider._id : null;
  }

  const [invoices, total] = await Promise.all([
    Invoice.find(filter).sort({ generatedAt: -1 }).skip(skip).limit(limit).populate(invoicePopulation),
    Invoice.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Invoice history fetched successfully.", {
    invoices,
    pagination: buildPagination({ page, limit, total })
  });
});

module.exports = {
  getInvoiceByBooking,
  getInvoiceHistory
};
