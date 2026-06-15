const express = require("express");
const {
  createProfile,
  getNearbyProviders,
  getProviderById,
  updateProfile
} = require("../controllers/providerController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  createProviderValidator,
  nearbyProviderValidator,
  providerIdValidator,
  updateProviderValidator
} = require("../validators/providerValidators");

const router = express.Router();

/**
 * @openapi
 * /api/providers/create-profile:
 *   post:
 *     summary: Create provider profile
 *     description: Provider-only endpoint for adding service category, skills, pricing, experience, address, and GeoJSON location.
 *     tags:
 *       - Providers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProviderCreateRequest'
 *           examples:
 *             latitudeLongitude:
 *               summary: Coordinates as top-level latitude and longitude
 *               value:
 *                 category: electrician
 *                 skills: ["wiring", "fan repair", "switchboard"]
 *                 hourlyRate: 500
 *                 experience: 6
 *                 availabilityStatus: available
 *                 address: "Indiranagar, Bengaluru"
 *                 latitude: 12.9719
 *                 longitude: 77.6412
 *             geoJson:
 *               summary: Coordinates as GeoJSON Point
 *               value:
 *                 category: plumber
 *                 skills: ["pipe repair", "leak fixing"]
 *                 hourlyRate: 450
 *                 experience: 4
 *                 availabilityStatus: available
 *                 address: "Koramangala, Bengaluru"
 *                 location:
 *                   type: Point
 *                   coordinates: [77.6245, 12.9352]
 *     responses:
 *       201:
 *         description: Provider profile created successfully.
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
 *                           $ref: '#/components/schemas/ProviderProfile'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post(
  "/create-profile",
  protect,
  authorizeRoles("provider"),
  createProviderValidator,
  validate,
  createProfile
);

/**
 * @openapi
 * /api/providers/nearby:
 *   get:
 *     summary: Search nearby providers
 *     description: Uses MongoDB `$geoNear` on a 2dsphere index to find available providers within a radius from the user's location.
 *     tags:
 *       - Providers
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         example: 12.9719
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         example: 77.6412
 *       - in: query
 *         name: radius
 *         description: Search radius in kilometers.
 *         schema:
 *           type: number
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: electrician
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         example: 4
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         example: 800
 *       - in: query
 *         name: availabilityStatus
 *         schema:
 *           type: string
 *           enum: [available, busy, offline]
 *           default: available
 *         example: available
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [distance, rating, price]
 *           default: distance
 *         example: distance
 *     responses:
 *       200:
 *         description: Nearby providers fetched successfully.
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
 *                         providers:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ProviderProfile'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *                         filters:
 *                           type: object
 *                           properties:
 *                             radiusKm:
 *                               type: number
 *                               example: 10
 *                             sort:
 *                               type: string
 *                               example: distance
 *             example:
 *               success: true
 *               message: Nearby providers fetched successfully.
 *               data:
 *                 providers:
 *                   - _id: "665a00000000000000000010"
 *                     category: electrician
 *                     skills: ["wiring", "fan repair"]
 *                     hourlyRate: 500
 *                     experience: 6
 *                     rating: 4.7
 *                     reviewsCount: 12
 *                     availabilityStatus: available
 *                     address: "Indiranagar, Bengaluru"
 *                     distanceKm: 2.34
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 1
 *                   pages: 1
 *                 filters:
 *                   radiusKm: 10
 *                   sort: distance
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/nearby", nearbyProviderValidator, validate, getNearbyProviders);

/**
 * @openapi
 * /api/providers/{id}:
 *   get:
 *     summary: Get provider by ID
 *     description: Fetches a public provider profile with basic linked user details.
 *     tags:
 *       - Providers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a00000000000000000010"
 *     responses:
 *       200:
 *         description: Provider profile fetched successfully.
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
 *                           $ref: '#/components/schemas/ProviderProfile'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", providerIdValidator, validate, getProviderById);

/**
 * @openapi
 * /api/providers/update-profile:
 *   put:
 *     summary: Update provider profile
 *     description: Provider-only endpoint to update category, skills, pricing, availability, address, or location.
 *     tags:
 *       - Providers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProviderUpdateRequest'
 *           examples:
 *             updateAvailability:
 *               value:
 *                 availabilityStatus: busy
 *                 hourlyRate: 650
 *             updateLocation:
 *               value:
 *                 address: "Whitefield, Bengaluru"
 *                 latitude: 12.9698
 *                 longitude: 77.7499
 *     responses:
 *       200:
 *         description: Provider profile updated successfully.
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
 *                           $ref: '#/components/schemas/ProviderProfile'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/update-profile",
  protect,
  authorizeRoles("provider"),
  updateProviderValidator,
  validate,
  updateProfile
);

module.exports = router;
