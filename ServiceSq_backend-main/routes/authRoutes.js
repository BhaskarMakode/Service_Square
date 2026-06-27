const express = require("express");
const {
  getProfile,
  logout,
  refreshToken,
  register,
  sendOtp,
  sendSuperAdminOtp,
  verifyOtp
} = require("../controllers/authController");
const protect = require("../middleware/auth");
const { otpLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const {
  refreshTokenValidator,
  registerValidator,
  sendOtpValidator,
  superAdminOtpValidator,
  verifyOtpValidator
} = require("../validators/authValidators");

const router = express.Router();

/**
 * @openapi
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to a mobile number
 *     description: Generates a 6-digit OTP, stores a bcrypt hash with expiry, and sends it through the configured SMS service. Development mode returns `devOtp` for browser testing.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtpRequest'
 *           examples:
 *             customerPhone:
 *               summary: Mobile number
 *               value:
 *                 phone: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP generated and sent.
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
 *                         phone:
 *                           type: string
 *                           example: "+919876543210"
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                         expiresInSeconds:
 *                           type: integer
 *                           example: 300
 *                         devOtp:
 *                           type: string
 *                           example: "123456"
 *             examples:
 *               development:
 *                 value:
 *                   success: true
 *                   message: OTP sent successfully.
 *                   data:
 *                     phone: "+919876543210"
 *                     expiresAt: "2026-05-11T18:30:00.000Z"
 *                     expiresInSeconds: 300
 *                     devOtp: "123456"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         description: Too many OTP requests.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/send-otp", otpLimiter, sendOtpValidator, validate, sendOtp);
router.post("/super-admin/send-otp", otpLimiter, superAdminOtpValidator, validate, sendSuperAdminOtp);

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and generate JWT
 *     description: Verifies the latest unconsumed OTP for the phone number, creates a user when needed, marks the phone verified, and returns a JWT.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *           examples:
 *             verifyOtp:
 *               value:
 *                 phone: "+919876543210"
 *                 otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified and JWT issued.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthTokenResponseData'
 *             example:
 *               success: true
 *               message: OTP verified successfully.
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 requiresRegistration: true
 *                 user:
 *                   _id: "665a00000000000000000001"
 *                   phone: "+919876543210"
 *                   role: customer
 *                   isVerified: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         description: Maximum OTP verification attempts exceeded.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Complete customer or provider registration
 *     description: Completes profile details for an OTP-verified user. The verified phone comes from the JWT.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             providerRegistration:
 *               value:
 *                 name: "Amit Sharma"
 *                 role: provider
 *                 email: "amit@example.com"
 *                 avatar: "https://example.com/avatar.jpg"
 *             customerRegistration:
 *               value:
 *                 name: "Priya Mehta"
 *                 role: customer
 *                 email: "priya@example.com"
 *     responses:
 *       200:
 *         description: Registration completed.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthTokenResponseData'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post("/register", protect, registerValidator, validate, register);
router.post("/refresh-token", refreshTokenValidator, validate, refreshToken);
router.post("/logout", refreshTokenValidator, validate, logout);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     description: Returns the logged-in user and provider profile when the role is provider.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         providerProfile:
 *                           nullable: true
 *                           $ref: '#/components/schemas/ProviderProfile'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/profile", protect, getProfile);

module.exports = router;
