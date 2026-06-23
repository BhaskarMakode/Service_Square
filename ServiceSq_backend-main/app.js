const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const adminRoutes = require("./routes/adminRoutes");
const addressRoutes = require("./routes/addressRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const locationRoutes = require("./routes/locationRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const providerRoutes = require("./routes/providerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const searchRoutes = require("./routes/searchRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const supportRoutes = require("./routes/supportRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const swaggerSpec = require("./config/swagger");
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { sendSuccess } = require("./utils/apiResponse");

const app = express();

app.disable("x-powered-by");
app.set("etag", false);

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(swaggerSpec);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "LocalConnect API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  })
);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS."));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const preventApiCaching = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
};

app.use(["/api", "/api/v1"], preventApiCaching);
app.use(apiLimiter);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health
 *     description: Returns uptime and timestamp for monitoring.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy.
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
 *                         uptime:
 *                           type: number
 *                           example: 122.45
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */
app.get("/health", (req, res) => {
  return sendSuccess(res, 200, "LocalConnect API is healthy.", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const apiRoutes = [
  ["/addresses", addressRoutes],
  ["/address", addressRoutes],
  ["/admin", adminRoutes],
  ["/analytics", analyticsRoutes],
  ["/auth", authRoutes],
  ["/availability", availabilityRoutes],
  ["/bookings", bookingRoutes],
  ["/categories", categoryRoutes],
  ["/chat", chatRoutes],
  ["/notifications", notificationRoutes],
  ["/payments", paymentRoutes],
  ["/invoices", invoiceRoutes],
  ["/location", locationRoutes],
  ["/portfolio", portfolioRoutes],
  ["/providers", providerRoutes],
  ["/report", reportRoutes],
  ["/reviews", reviewRoutes],
  ["/search", searchRoutes],
  ["/subscription", subscriptionRoutes],
  ["/support", supportRoutes],
  ["/upload", uploadRoutes],
  ["/verification", verificationRoutes]
];

const mountApiRoutes = (prefix) => {
  apiRoutes.forEach(([path, router]) => {
    app.use(`${prefix}${path}`, router);
  });
};

mountApiRoutes("/api");
mountApiRoutes("/api/v1");

app.use(notFound);
app.use(errorHandler);

module.exports = app;
