const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingStatus
} = require("../controllers/bookingController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  bookingIdValidator,
  createBookingValidator,
  listBookingsValidator,
  updateBookingStatusValidator
} = require("../validators/bookingValidators");

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /api/bookings/create:
 *   post:
 *     summary: Create a booking
 *     description: Customer-only endpoint. Blocks overlapping pending or accepted bookings for the selected provider.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreateRequest'
 *           examples:
 *             electricianBooking:
 *               value:
 *                 providerId: "665a00000000000000000010"
 *                 serviceType: electrician
 *                 bookingDate: "2026-05-12T09:00:00.000Z"
 *                 scheduledStart: "2026-05-12T09:00:00.000Z"
 *                 scheduledEnd: "2026-05-12T11:00:00.000Z"
 *                 address: "221B MG Road, Bengaluru"
 *                 amount: 1000
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         booking:
 *                           $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post("/create", authorizeRoles("customer"), createBookingValidator, validate, createBooking);

/**
 * @openapi
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get booking history for current user
 *     description: Customers receive their own bookings. Providers receive bookings assigned to their provider profile.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, completed, cancelled]
 *         example: pending
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Bookings fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         bookings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Booking'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/my-bookings", listBookingsValidator, validate, getMyBookings);
router.get("/all", authorizeRoles("admin"), listBookingsValidator, validate, getAllBookings);

/**
 * @openapi
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     description: Providers can accept, reject, or complete bookings. Customers can cancel their own bookings.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a00000000000000000020"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingStatusRequest'
 *           examples:
 *             providerAccepts:
 *               value:
 *                 status: accepted
 *             customerCancels:
 *               value:
 *                 status: cancelled
 *     responses:
 *       200:
 *         description: Booking status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         booking:
 *                           $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.put("/:id/status", updateBookingStatusValidator, validate, updateBookingStatus);

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     description: Customers can view their own booking. Providers can view bookings assigned to their provider profile.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a00000000000000000020"
 *     responses:
 *       200:
 *         description: Booking fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         booking:
 *                           $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", bookingIdValidator, validate, getBookingById);

module.exports = router;
