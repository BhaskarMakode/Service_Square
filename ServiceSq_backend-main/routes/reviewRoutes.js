const express = require("express");
const {
  addReview,
  getProviderReviews
} = require("../controllers/reviewController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  addReviewValidator,
  providerReviewValidator
} = require("../validators/reviewValidators");

const router = express.Router();

/**
 * @openapi
 * /api/reviews/add:
 *   post:
 *     summary: Add provider review
 *     description: Customer-only endpoint. A review can be created only once per completed booking.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewAddRequest'
 *           examples:
 *             completedBookingReview:
 *               value:
 *                 bookingId: "665a00000000000000000020"
 *                 rating: 5
 *                 comment: "Arrived on time and fixed the issue cleanly."
 *     responses:
 *       201:
 *         description: Review added successfully and provider rating recalculated.
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
 *                         review:
 *                           $ref: '#/components/schemas/Review'
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
router.post("/add", protect, authorizeRoles("customer"), addReviewValidator, validate, addReview);

/**
 * @openapi
 * /api/reviews/provider/{providerId}:
 *   get:
 *     summary: Fetch provider reviews
 *     description: Returns paginated customer reviews and provider rating summary.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a00000000000000000010"
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
 *         description: Provider reviews fetched successfully.
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
 *                         provider:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "665a00000000000000000010"
 *                             rating:
 *                               type: number
 *                               example: 4.7
 *                             reviewsCount:
 *                               type: integer
 *                               example: 12
 *                         reviews:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Review'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/provider/:providerId", providerReviewValidator, validate, getProviderReviews);

module.exports = router;
