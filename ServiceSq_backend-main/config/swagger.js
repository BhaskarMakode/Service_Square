const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "LocalConnect Backend API",
    version: "1.0.0",
    description:
      "Interactive REST API documentation for LocalConnect, a hyperlocal service marketplace for customers and verified providers."
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`,
      description: "Local development server"
    }
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Authentication", description: "OTP login, registration, and profile APIs" },
    { name: "Providers", description: "Provider profile management and nearby search" },
    { name: "Bookings", description: "Booking creation, history, and status workflow" },
    { name: "Reviews", description: "Provider ratings and customer reviews" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste the JWT returned by `/api/auth/verify-otp` or `/api/auth/register`."
      }
    },
    schemas: {
      ApiSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation completed successfully." },
          data: { type: "object" }
        }
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed." },
          errors: {
            type: "array",
            items: { $ref: "#/components/schemas/ValidationError" }
          }
        }
      },
      ValidationError: {
        type: "object",
        properties: {
          field: { type: "string", example: "phone" },
          message: { type: "string", example: "phone must be a valid mobile number." },
          value: { example: "98765" }
        }
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 42 },
          pages: { type: "integer", example: 5 }
        }
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665a00000000000000000001" },
          name: { type: "string", example: "Amit Sharma" },
          phone: { type: "string", example: "+919876543210" },
          role: { type: "string", enum: ["customer", "provider"], example: "customer" },
          email: { type: "string", example: "amit@example.com" },
          avatar: { type: "string", example: "https://example.com/avatar.jpg" },
          isVerified: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      SendOtpRequest: {
        type: "object",
        required: ["phone"],
        properties: {
          phone: { type: "string", example: "+919876543210" }
        }
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["phone", "otp"],
        properties: {
          phone: { type: "string", example: "+919876543210" },
          otp: { type: "string", example: "123456" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "role"],
        properties: {
          name: { type: "string", example: "Amit Sharma" },
          role: { type: "string", enum: ["customer", "provider"], example: "provider" },
          email: { type: "string", example: "amit@example.com" },
          avatar: { type: "string", example: "https://example.com/avatar.jpg" },
          phone: { type: "string", example: "+919876543210" }
        }
      },
      AuthTokenResponseData: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          requiresRegistration: { type: "boolean", example: false },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      GeoPoint: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["Point"], example: "Point" },
          coordinates: {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: { type: "number" },
            example: [77.6412, 12.9719],
            description: "[longitude, latitude]"
          }
        }
      },
      ProviderProfile: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665a00000000000000000010" },
          userId: {
            oneOf: [
              { type: "string", example: "665a00000000000000000001" },
              { $ref: "#/components/schemas/User" }
            ]
          },
          category: { type: "string", example: "electrician" },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["wiring", "fan repair", "switchboard"]
          },
          hourlyRate: { type: "number", example: 500 },
          experience: { type: "integer", example: 6 },
          rating: { type: "number", example: 4.7 },
          reviewsCount: { type: "integer", example: 12 },
          availabilityStatus: {
            type: "string",
            enum: ["available", "busy", "offline"],
            example: "available"
          },
          address: { type: "string", example: "Indiranagar, Bengaluru" },
          location: { $ref: "#/components/schemas/GeoPoint" },
          distanceKm: { type: "number", example: 2.34 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      ProviderCreateRequest: {
        type: "object",
        required: ["category", "skills", "hourlyRate", "experience", "address"],
        properties: {
          category: { type: "string", example: "electrician" },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["wiring", "fan repair", "switchboard"]
          },
          hourlyRate: { type: "number", example: 500 },
          experience: { type: "integer", example: 6 },
          availabilityStatus: {
            type: "string",
            enum: ["available", "busy", "offline"],
            example: "available"
          },
          address: { type: "string", example: "Indiranagar, Bengaluru" },
          latitude: { type: "number", example: 12.9719 },
          longitude: { type: "number", example: 77.6412 },
          location: { $ref: "#/components/schemas/GeoPoint" }
        }
      },
      ProviderUpdateRequest: {
        type: "object",
        properties: {
          category: { type: "string", example: "electrician" },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["wiring", "inverter repair"]
          },
          hourlyRate: { type: "number", example: 650 },
          experience: { type: "integer", example: 7 },
          availabilityStatus: {
            type: "string",
            enum: ["available", "busy", "offline"],
            example: "busy"
          },
          address: { type: "string", example: "Koramangala, Bengaluru" },
          latitude: { type: "number", example: 12.9352 },
          longitude: { type: "number", example: 77.6245 },
          location: { $ref: "#/components/schemas/GeoPoint" }
        }
      },
      Booking: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665a00000000000000000020" },
          customerId: {
            oneOf: [
              { type: "string", example: "665a00000000000000000001" },
              { $ref: "#/components/schemas/User" }
            ]
          },
          providerId: {
            oneOf: [
              { type: "string", example: "665a00000000000000000010" },
              { $ref: "#/components/schemas/ProviderProfile" }
            ]
          },
          serviceType: { type: "string", example: "electrician" },
          bookingDate: { type: "string", format: "date-time", example: "2026-05-12T09:00:00.000Z" },
          scheduledStart: { type: "string", format: "date-time", example: "2026-05-12T09:00:00.000Z" },
          scheduledEnd: { type: "string", format: "date-time", example: "2026-05-12T11:00:00.000Z" },
          address: { type: "string", example: "221B MG Road, Bengaluru" },
          amount: { type: "number", example: 1000 },
          status: {
            type: "string",
            enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
            example: "pending"
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      BookingCreateRequest: {
        type: "object",
        required: ["providerId", "serviceType", "scheduledStart", "scheduledEnd", "address", "amount"],
        properties: {
          providerId: { type: "string", example: "665a00000000000000000010" },
          serviceType: { type: "string", example: "electrician" },
          bookingDate: { type: "string", format: "date-time", example: "2026-05-12T09:00:00.000Z" },
          scheduledStart: { type: "string", format: "date-time", example: "2026-05-12T09:00:00.000Z" },
          scheduledEnd: { type: "string", format: "date-time", example: "2026-05-12T11:00:00.000Z" },
          address: { type: "string", example: "221B MG Road, Bengaluru" },
          amount: { type: "number", example: 1000 }
        }
      },
      BookingStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["accepted", "rejected", "completed", "cancelled"],
            example: "accepted"
          }
        }
      },
      Review: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665a00000000000000000030" },
          bookingId: { type: "string", example: "665a00000000000000000020" },
          customerId: {
            oneOf: [
              { type: "string", example: "665a00000000000000000001" },
              { $ref: "#/components/schemas/User" }
            ]
          },
          providerId: { type: "string", example: "665a00000000000000000010" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comment: { type: "string", example: "Arrived on time and fixed the issue cleanly." },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      ReviewAddRequest: {
        type: "object",
        required: ["bookingId", "rating"],
        properties: {
          bookingId: { type: "string", example: "665a00000000000000000020" },
          providerId: { type: "string", example: "665a00000000000000000010" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comment: { type: "string", example: "Arrived on time and fixed the issue cleanly." }
        }
      }
    },
    responses: {
      BadRequest: {
        description: "Validation or business-rule failure.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      },
      Unauthorized: {
        description: "JWT token is missing, invalid, or expired.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" },
            example: {
              success: false,
              message: "Authentication token is required.",
              errors: []
            }
          }
        }
      },
      Forbidden: {
        description: "Authenticated user does not have the required role or ownership.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" },
            example: {
              success: false,
              message: "You are not allowed to perform this action.",
              errors: []
            }
          }
        }
      },
      NotFound: {
        description: "Requested resource was not found.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      },
      Conflict: {
        description: "Duplicate data or booking conflict.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      }
    }
  }
};

const bearerSecurity = [{ bearerAuth: [] }];
const jsonBody = (schemaRef, example) => ({
  required: true,
  content: {
    "application/json": {
      schema: { $ref: schemaRef },
      example
    }
  }
});
const ok = (description, example = { success: true, message: "Operation completed.", data: {} }) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ApiSuccess" },
      example
    }
  }
});
const created = (description, example) => ok(description, example);
const commonErrors = {
  400: { $ref: "#/components/responses/BadRequest" },
  401: { $ref: "#/components/responses/Unauthorized" },
  403: { $ref: "#/components/responses/Forbidden" },
  404: { $ref: "#/components/responses/NotFound" },
  409: { $ref: "#/components/responses/Conflict" }
};
const pageParams = [
  { in: "query", name: "page", schema: { type: "integer", default: 1 }, example: 1 },
  { in: "query", name: "limit", schema: { type: "integer", default: 10 }, example: 10 }
];

swaggerDefinition.tags.push(
  { name: "Availability", description: "Provider online status and working hours" },
  { name: "Categories", description: "Admin-managed service categories" },
  { name: "Notifications", description: "User notifications and read state" },
  { name: "Payments", description: "Mock payment intent, verification, and earnings" },
  { name: "Admin", description: "Admin dashboard and moderation APIs" },
  { name: "Chat", description: "Booking-based customer-provider messages" },
  { name: "Support", description: "Support ticket APIs" },
  { name: "Search", description: "Provider search, trending, and recommendations" },
  { name: "Uploads", description: "Profile image and provider document uploads" }
);

Object.assign(swaggerDefinition.components.schemas, {
  RefreshTokenRequest: {
    type: "object",
    properties: {
      refreshToken: { type: "string", example: "e018ad4f..." }
    }
  },
  Availability: {
    type: "object",
    properties: {
      providerId: { type: "string", example: "665a00000000000000000010" },
      isOnline: { type: "boolean", example: true },
      isAvailable: { type: "boolean", example: true },
      workingHours: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", example: "monday" },
            startTime: { type: "string", example: "09:00" },
            endTime: { type: "string", example: "18:00" }
          }
        }
      },
      lastActive: { type: "string", format: "date-time" }
    }
  },
  ToggleAvailabilityRequest: {
    type: "object",
    properties: {
      isOnline: { type: "boolean", example: true },
      isAvailable: { type: "boolean", example: true }
    }
  },
  WorkingHoursRequest: {
    type: "object",
    required: ["workingHours"],
    properties: {
      workingHours: {
        type: "array",
        items: {
          type: "object",
          required: ["day", "startTime", "endTime"],
          properties: {
            day: { type: "string", example: "monday" },
            startTime: { type: "string", example: "09:00" },
            endTime: { type: "string", example: "18:00" }
          }
        }
      }
    }
  },
  Category: {
    type: "object",
    properties: {
      _id: { type: "string", example: "665a00000000000000000040" },
      name: { type: "string", example: "Electrician" },
      slug: { type: "string", example: "electrician" },
      icon: { type: "string", example: "zap" },
      description: { type: "string", example: "Electrical repair and installation services." },
      isActive: { type: "boolean", example: true },
      usageCount: { type: "integer", example: 18 }
    }
  },
  CategoryRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", example: "Electrician" },
      icon: { type: "string", example: "zap" },
      description: { type: "string", example: "Electrical repair and installation services." },
      isActive: { type: "boolean", example: true }
    }
  },
  PaymentIntentRequest: {
    type: "object",
    required: ["bookingId"],
    properties: {
      bookingId: { type: "string", example: "665a00000000000000000020" },
      paymentMethod: { type: "string", example: "mock" }
    }
  },
  PaymentVerifyRequest: {
    type: "object",
    required: ["paymentId", "transactionId"],
    properties: {
      paymentId: { type: "string", example: "665a00000000000000000050" },
      transactionId: { type: "string", example: "txn_mock_001" },
      clientSecret: { type: "string", example: "mock_secret_..." },
      signature: { type: "string", example: "hmac-signature-for-production" }
    }
  },
  ChatSendRequest: {
    type: "object",
    required: ["bookingId", "message"],
    properties: {
      bookingId: { type: "string", example: "665a00000000000000000020" },
      message: { type: "string", example: "I am on my way." }
    }
  },
  SupportTicketRequest: {
    type: "object",
    required: ["subject", "issue"],
    properties: {
      subject: { type: "string", example: "Need help with a booking" },
      issue: { type: "string", example: "The provider has not arrived yet." },
      priority: { type: "string", example: "medium" }
    }
  },
  ProviderVerifyRequest: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["approved", "rejected"], example: "approved" },
      rejectionReason: { type: "string", example: "Document is unclear." }
    }
  }
});

swaggerDefinition.paths = {
  ...(swaggerDefinition.paths || {}),
  "/api/auth/refresh-token": {
    post: {
      summary: "Refresh JWT access token",
      tags: ["Authentication"],
      requestBody: jsonBody("#/components/schemas/RefreshTokenRequest", { refreshToken: "e018ad4f..." }),
      responses: {
        200: ok("Token refreshed.", {
          success: true,
          message: "Token refreshed successfully.",
          data: { token: "jwt...", refreshToken: "new-refresh-token..." }
        }),
        401: commonErrors[401],
        403: commonErrors[403]
      }
    }
  },
  "/api/auth/logout": {
    post: {
      summary: "Logout and revoke refresh token",
      tags: ["Authentication"],
      requestBody: jsonBody("#/components/schemas/RefreshTokenRequest", { refreshToken: "e018ad4f..." }),
      responses: {
        200: ok("Logged out.", { success: true, message: "Logged out successfully.", data: {} }),
        400: commonErrors[400]
      }
    }
  },
  "/api/availability/toggle": {
    put: {
      summary: "Toggle provider availability",
      tags: ["Availability"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/ToggleAvailabilityRequest", { isOnline: true, isAvailable: true }),
      responses: { 200: ok("Availability updated."), ...commonErrors }
    }
  },
  "/api/availability/provider/{id}": {
    get: {
      summary: "Get provider availability",
      tags: ["Availability"],
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, example: "665a00000000000000000010" }],
      responses: { 200: ok("Provider availability fetched."), 400: commonErrors[400], 404: commonErrors[404] }
    }
  },
  "/api/availability/working-hours": {
    put: {
      summary: "Update provider working hours",
      tags: ["Availability"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/WorkingHoursRequest", {
        workingHours: [{ day: "monday", startTime: "09:00", endTime: "18:00" }]
      }),
      responses: { 200: ok("Working hours updated."), ...commonErrors }
    }
  },
  "/api/availability/online-providers": {
    get: {
      summary: "List online providers",
      tags: ["Availability"],
      parameters: [
        { in: "query", name: "category", schema: { type: "string" }, example: "electrician" },
        ...pageParams
      ],
      responses: { 200: ok("Online providers fetched."), 400: commonErrors[400] }
    }
  },
  "/api/categories/create": {
    post: {
      summary: "Create service category",
      tags: ["Categories"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/CategoryRequest", {
        name: "Electrician",
        icon: "zap",
        description: "Electrical services"
      }),
      responses: { 201: created("Category created."), ...commonErrors }
    }
  },
  "/api/categories": {
    get: {
      summary: "List service categories",
      tags: ["Categories"],
      parameters: [
        { in: "query", name: "popular", schema: { type: "boolean" }, example: true },
        { in: "query", name: "includeInactive", schema: { type: "boolean" }, example: false },
        ...pageParams
      ],
      responses: { 200: ok("Categories fetched."), 400: commonErrors[400] }
    }
  },
  "/api/categories/{id}": {
    put: {
      summary: "Update service category",
      tags: ["Categories"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      requestBody: jsonBody("#/components/schemas/CategoryRequest", { name: "Electrician", isActive: true }),
      responses: { 200: ok("Category updated."), ...commonErrors }
    },
    delete: {
      summary: "Soft delete service category",
      tags: ["Categories"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: { 200: ok("Category deleted."), 401: commonErrors[401], 403: commonErrors[403], 404: commonErrors[404] }
    }
  },
  "/api/notifications": {
    get: {
      summary: "List notifications",
      tags: ["Notifications"],
      security: bearerSecurity,
      parameters: [{ in: "query", name: "isRead", schema: { type: "boolean" }, example: false }, ...pageParams],
      responses: { 200: ok("Notifications fetched."), 401: commonErrors[401] }
    }
  },
  "/api/notifications/{id}/read": {
    put: {
      summary: "Mark notification as read",
      tags: ["Notifications"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: { 200: ok("Notification marked as read."), 401: commonErrors[401], 404: commonErrors[404] }
    }
  },
  "/api/notifications/{id}": {
    delete: {
      summary: "Delete notification",
      tags: ["Notifications"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: { 200: ok("Notification deleted."), 401: commonErrors[401], 404: commonErrors[404] }
    }
  },
  "/api/payments/create-payment-intent": {
    post: {
      summary: "Create payment intent",
      tags: ["Payments"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/PaymentIntentRequest", {
        bookingId: "665a00000000000000000020",
        paymentMethod: "mock"
      }),
      responses: { 201: created("Payment intent created."), ...commonErrors }
    }
  },
  "/api/payments/verify": {
    post: {
      summary: "Verify payment",
      tags: ["Payments"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/PaymentVerifyRequest", {
        paymentId: "665a00000000000000000050",
        transactionId: "txn_mock_001",
        clientSecret: "mock_secret_..."
      }),
      responses: { 200: ok("Payment verified."), ...commonErrors }
    }
  },
  "/api/payments/history": {
    get: {
      summary: "Get payment history",
      tags: ["Payments"],
      security: bearerSecurity,
      parameters: [{ in: "query", name: "paymentStatus", schema: { type: "string" }, example: "succeeded" }, ...pageParams],
      responses: { 200: ok("Payment history fetched."), 401: commonErrors[401], 400: commonErrors[400] }
    }
  },
  "/api/payments/provider-earnings": {
    get: {
      summary: "Get provider earnings",
      tags: ["Payments"],
      security: bearerSecurity,
      responses: { 200: ok("Provider earnings fetched."), 401: commonErrors[401], 403: commonErrors[403], 404: commonErrors[404] }
    }
  },
  "/api/admin/dashboard": {
    get: { summary: "Get dashboard analytics", tags: ["Admin"], security: bearerSecurity, responses: { 200: ok("Dashboard fetched."), 401: commonErrors[401], 403: commonErrors[403] } }
  },
  "/api/admin/users": {
    get: {
      summary: "List users",
      tags: ["Admin"],
      security: bearerSecurity,
      parameters: [
        { in: "query", name: "role", schema: { type: "string" }, example: "customer" },
        { in: "query", name: "isActive", schema: { type: "boolean" }, example: true },
        { in: "query", name: "search", schema: { type: "string" }, example: "amit" },
        ...pageParams
      ],
      responses: { 200: ok("Users fetched."), 401: commonErrors[401], 403: commonErrors[403] }
    }
  },
  "/api/admin/providers": {
    get: {
      summary: "List providers for moderation",
      tags: ["Admin"],
      security: bearerSecurity,
      parameters: [
        { in: "query", name: "verificationStatus", schema: { type: "string" }, example: "pending" },
        { in: "query", name: "category", schema: { type: "string" }, example: "electrician" },
        ...pageParams
      ],
      responses: { 200: ok("Providers fetched."), 401: commonErrors[401], 403: commonErrors[403] }
    }
  },
  "/api/admin/provider/{id}/verify": {
    put: {
      summary: "Approve or reject provider",
      tags: ["Admin"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      requestBody: jsonBody("#/components/schemas/ProviderVerifyRequest", { status: "approved" }),
      responses: { 200: ok("Provider verification updated."), ...commonErrors }
    }
  },
  "/api/admin/user/{id}": {
    delete: {
      summary: "Soft delete user",
      tags: ["Admin"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: { 200: ok("User deleted."), ...commonErrors }
    }
  },
  "/api/chat/send": {
    post: {
      summary: "Send booking chat message",
      tags: ["Chat"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/ChatSendRequest", {
        bookingId: "665a00000000000000000020",
        message: "I am on my way."
      }),
      responses: { 201: created("Message sent."), ...commonErrors }
    }
  },
  "/api/chat/{bookingId}": {
    get: {
      summary: "Get booking chat messages",
      tags: ["Chat"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "bookingId", required: true, schema: { type: "string" } }, ...pageParams],
      responses: { 200: ok("Messages fetched."), ...commonErrors }
    }
  },
  "/api/support/create-ticket": {
    post: {
      summary: "Create support ticket",
      tags: ["Support"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/SupportTicketRequest", {
        subject: "Need help with a booking",
        issue: "The provider has not arrived yet.",
        priority: "medium"
      }),
      responses: { 201: created("Ticket created."), 400: commonErrors[400], 401: commonErrors[401] }
    }
  },
  "/api/support/my-tickets": {
    get: {
      summary: "List my support tickets",
      tags: ["Support"],
      security: bearerSecurity,
      parameters: [{ in: "query", name: "status", schema: { type: "string" }, example: "open" }, ...pageParams],
      responses: { 200: ok("Tickets fetched."), 401: commonErrors[401], 400: commonErrors[400] }
    }
  },
  "/api/search/providers": {
    get: {
      summary: "Search providers",
      tags: ["Search"],
      parameters: [
        { in: "query", name: "q", schema: { type: "string" }, example: "fan repair" },
        { in: "query", name: "latitude", schema: { type: "number" }, example: 12.9719 },
        { in: "query", name: "longitude", schema: { type: "number" }, example: 77.6412 },
        { in: "query", name: "radius", schema: { type: "number" }, example: 10 },
        { in: "query", name: "category", schema: { type: "string" }, example: "electrician" },
        ...pageParams
      ],
      responses: { 200: ok("Providers searched."), 400: commonErrors[400] }
    }
  },
  "/api/search/trending": {
    get: { summary: "Get trending providers", tags: ["Search"], parameters: pageParams, responses: { 200: ok("Trending fetched."), 400: commonErrors[400] } }
  },
  "/api/search/recommended": {
    get: { summary: "Get recommended providers", tags: ["Search"], security: bearerSecurity, parameters: pageParams, responses: { 200: ok("Recommended fetched."), 401: commonErrors[401] } }
  },
  "/api/upload/profile-image": {
    post: {
      summary: "Upload profile image",
      tags: ["Uploads"],
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: { file: { type: "string", format: "binary" } }
            }
          }
        }
      },
      responses: { 201: created("Profile image uploaded."), 400: commonErrors[400], 401: commonErrors[401] }
    }
  },
  "/api/upload/documents": {
    post: {
      summary: "Upload provider document",
      tags: ["Uploads"],
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary" },
                documentType: { type: "string", example: "identity" }
              }
            }
          }
        }
      },
      responses: { 201: created("Document uploaded."), ...commonErrors }
    }
  },
  "/api/upload/{id}": {
    get: {
      summary: "Fetch uploaded file",
      tags: ["Uploads"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: {
        200: { description: "Binary file response." },
        401: commonErrors[401],
        403: commonErrors[403],
        404: commonErrors[404]
      }
    }
  }
};

swaggerDefinition.tags.push(
  { name: "Addresses", description: "Customer and provider saved address management" },
  { name: "Invoices", description: "Completed booking invoices and billing history" },
  { name: "Analytics", description: "Admin dashboard analytics" },
  { name: "Portfolio", description: "Provider previous work portfolio" },
  { name: "Subscriptions", description: "Premium provider plans and status" },
  { name: "Reports", description: "Safety reports and admin moderation" },
  { name: "Verification", description: "Provider KYC verification workflow" },
  { name: "Location", description: "Provider live location tracking" }
);

Object.assign(swaggerDefinition.components.schemas, {
  Address: {
    type: "object",
    properties: {
      _id: { type: "string", example: "665a00000000000000000060" },
      userId: { type: "string", example: "665a00000000000000000001" },
      fullName: { type: "string", example: "Amit Sharma" },
      phone: { type: "string", example: "+919876543210" },
      houseNo: { type: "string", example: "221B" },
      street: { type: "string", example: "MG Road" },
      city: { type: "string", example: "Bengaluru" },
      state: { type: "string", example: "Karnataka" },
      pincode: { type: "string", example: "560001" },
      landmark: { type: "string", example: "Near Metro Station" },
      isDefault: { type: "boolean", example: true }
    }
  },
  AddressRequest: {
    type: "object",
    required: ["fullName", "phone", "houseNo", "street", "city", "state", "pincode"],
    properties: {
      fullName: { type: "string", example: "Amit Sharma" },
      phone: { type: "string", example: "+919876543210" },
      houseNo: { type: "string", example: "221B" },
      street: { type: "string", example: "MG Road" },
      city: { type: "string", example: "Bengaluru" },
      state: { type: "string", example: "Karnataka" },
      pincode: { type: "string", example: "560001" },
      landmark: { type: "string", example: "Near Metro Station" },
      isDefault: { type: "boolean", example: true }
    }
  },
  Invoice: {
    type: "object",
    properties: {
      bookingId: { type: "string", example: "665a00000000000000000020" },
      customerId: { type: "string", example: "665a00000000000000000001" },
      providerId: { type: "string", example: "665a00000000000000000010" },
      amount: { type: "number", example: 1000 },
      taxes: { type: "number", example: 0 },
      platformFee: { type: "number", example: 0 },
      totalAmount: { type: "number", example: 1000 },
      paymentStatus: { type: "string", example: "paid" },
      invoiceNumber: { type: "string", example: "LC-INV-20260512-A1B2C3" },
      generatedAt: { type: "string", format: "date-time" }
    }
  },
  Portfolio: {
    type: "object",
    properties: {
      providerId: { type: "string", example: "665a00000000000000000010" },
      title: { type: "string", example: "Apartment rewiring" },
      description: { type: "string", example: "Completed full home wiring and safety checks." },
      images: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string", example: "/api/upload/665a00000000000000000070" },
            storageProvider: { type: "string", example: "local" }
          }
        }
      }
    }
  },
  Subscription: {
    type: "object",
    properties: {
      providerId: { type: "string", example: "665a00000000000000000010" },
      planName: { type: "string", example: "premium_monthly" },
      amount: { type: "number", example: 499 },
      startDate: { type: "string", format: "date-time" },
      expiryDate: { type: "string", format: "date-time" },
      paymentStatus: { type: "string", example: "paid" },
      features: { type: "array", items: { type: "string" } }
    }
  },
  SubscriptionUpgradeRequest: {
    type: "object",
    required: ["planName"],
    properties: {
      planName: { type: "string", example: "premium_monthly" },
      paymentMethod: { type: "string", example: "mock" }
    }
  },
  Report: {
    type: "object",
    properties: {
      reportedBy: { type: "string", example: "665a00000000000000000001" },
      targetUser: { type: "string", example: "665a00000000000000000002" },
      reason: { type: "string", example: "abusive_behavior" },
      description: { type: "string", example: "Used abusive language in chat." },
      status: { type: "string", example: "pending" },
      adminAction: { type: "string", example: "none" },
      createdAt: { type: "string", format: "date-time" }
    }
  },
  Verification: {
    type: "object",
    properties: {
      providerId: { type: "string", example: "665a00000000000000000010" },
      documentType: { type: "string", example: "aadhaar" },
      documentImage: { type: "object" },
      verificationStatus: { type: "string", example: "pending" },
      rejectionReason: { type: "string", example: "Document is unclear." },
      submittedAt: { type: "string", format: "date-time" }
    }
  },
  LiveLocation: {
    type: "object",
    properties: {
      providerId: { type: "string", example: "665a00000000000000000010" },
      location: { $ref: "#/components/schemas/GeoPoint" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  SearchHistory: {
    type: "object",
    properties: {
      userId: { type: "string", example: "665a00000000000000000001" },
      keyword: { type: "string", example: "fan repair" },
      searchedAt: { type: "string", format: "date-time" }
    }
  }
});

Object.assign(swaggerDefinition.paths, {
  "/api/addresses/add": {
    post: {
      summary: "Add saved address",
      tags: ["Addresses"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/AddressRequest", {
        fullName: "Amit Sharma",
        phone: "+919876543210",
        houseNo: "221B",
        street: "MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true
      }),
      responses: { 201: created("Address added."), ...commonErrors }
    }
  },
  "/api/addresses": {
    get: {
      summary: "List saved addresses",
      tags: ["Addresses"],
      security: bearerSecurity,
      responses: { 200: ok("Addresses fetched."), 401: commonErrors[401] }
    }
  },
  "/api/addresses/{id}": {
    put: {
      summary: "Update saved address",
      tags: ["Addresses"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      requestBody: jsonBody("#/components/schemas/AddressRequest", { city: "Bengaluru", isDefault: true }),
      responses: { 200: ok("Address updated."), ...commonErrors }
    },
    delete: {
      summary: "Delete saved address",
      tags: ["Addresses"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: { 200: ok("Address deleted."), 401: commonErrors[401], 404: commonErrors[404] }
    }
  },
  "/api/invoices/{bookingId}": {
    get: {
      summary: "Get or generate invoice for completed booking",
      tags: ["Invoices"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "bookingId", required: true, schema: { type: "string" } }],
      responses: { 200: ok("Invoice fetched."), ...commonErrors }
    }
  },
  "/api/invoices/user/history": {
    get: {
      summary: "Get invoice history",
      tags: ["Invoices"],
      security: bearerSecurity,
      parameters: pageParams,
      responses: { 200: ok("Invoice history fetched."), 401: commonErrors[401] }
    }
  },
  "/api/analytics/revenue": {
    get: { summary: "Get revenue analytics", tags: ["Analytics"], security: bearerSecurity, parameters: [{ in: "query", name: "year", schema: { type: "integer" }, example: 2026 }], responses: { 200: ok("Revenue analytics fetched."), 401: commonErrors[401], 403: commonErrors[403] } }
  },
  "/api/analytics/bookings": {
    get: { summary: "Get booking analytics", tags: ["Analytics"], security: bearerSecurity, parameters: [{ in: "query", name: "year", schema: { type: "integer" }, example: 2026 }], responses: { 200: ok("Booking analytics fetched."), 401: commonErrors[401], 403: commonErrors[403] } }
  },
  "/api/analytics/providers": {
    get: { summary: "Get provider analytics and top providers", tags: ["Analytics"], security: bearerSecurity, parameters: [{ in: "query", name: "limit", schema: { type: "integer" }, example: 10 }], responses: { 200: ok("Provider analytics fetched."), 401: commonErrors[401], 403: commonErrors[403] } }
  },
  "/api/analytics/users": {
    get: { summary: "Get user analytics", tags: ["Analytics"], security: bearerSecurity, responses: { 200: ok("User analytics fetched."), 401: commonErrors[401], 403: commonErrors[403] } }
  },
  "/api/portfolio/add": {
    post: {
      summary: "Add provider portfolio item",
      tags: ["Portfolio"],
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["title", "images"],
              properties: {
                title: { type: "string", example: "Apartment rewiring" },
                description: { type: "string", example: "Completed full wiring project." },
                images: { type: "array", items: { type: "string", format: "binary" } }
              }
            }
          }
        }
      },
      responses: { 201: created("Portfolio added."), ...commonErrors }
    }
  },
  "/api/portfolio/{id}": {
    get: {
      summary: "Get provider portfolio",
      description: "For GET, `id` is the provider profile id.",
      tags: ["Portfolio"],
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }, ...pageParams],
      responses: { 200: ok("Portfolio fetched."), 400: commonErrors[400], 404: commonErrors[404] }
    },
    delete: {
      summary: "Delete portfolio item",
      description: "For DELETE, `id` is the portfolio item id.",
      tags: ["Portfolio"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      responses: { 200: ok("Portfolio deleted."), ...commonErrors }
    }
  },
  "/api/subscription/upgrade": {
    post: {
      summary: "Upgrade provider subscription",
      tags: ["Subscriptions"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/SubscriptionUpgradeRequest", { planName: "premium_monthly", paymentMethod: "mock" }),
      responses: { 201: created("Subscription upgraded."), ...commonErrors }
    }
  },
  "/api/subscription/plans": {
    get: {
      summary: "List subscription plans",
      tags: ["Subscriptions"],
      responses: { 200: ok("Plans fetched.") }
    }
  },
  "/api/subscription/status": {
    get: {
      summary: "Get provider subscription status",
      tags: ["Subscriptions"],
      security: bearerSecurity,
      responses: { 200: ok("Subscription status fetched."), 401: commonErrors[401], 403: commonErrors[403] }
    }
  },
  "/api/report/user": {
    post: {
      summary: "Report a user",
      tags: ["Reports"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/Report", { targetUser: "665a00000000000000000002", reason: "abusive_behavior", description: "Used abusive language." }),
      responses: { 201: created("User report submitted."), ...commonErrors }
    }
  },
  "/api/report/provider": {
    post: {
      summary: "Report a provider",
      tags: ["Reports"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/Report", { providerId: "665a00000000000000000010", reason: "no_show", description: "Provider did not arrive." }),
      responses: { 201: created("Provider report submitted."), ...commonErrors }
    }
  },
  "/api/report/all": {
    get: {
      summary: "List all reports",
      tags: ["Reports"],
      security: bearerSecurity,
      parameters: [{ in: "query", name: "status", schema: { type: "string" }, example: "pending" }, ...pageParams],
      responses: { 200: ok("Reports fetched."), 401: commonErrors[401], 403: commonErrors[403] }
    }
  },
  "/api/report/{id}/action": {
    put: {
      summary: "Moderate report",
      tags: ["Reports"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      requestBody: jsonBody("#/components/schemas/Report", { status: "action_taken", adminAction: "warning", actionNote: "Warning issued." }),
      responses: { 200: ok("Report action updated."), ...commonErrors }
    }
  },
  "/api/verification/upload": {
    post: {
      summary: "Upload provider KYC document",
      tags: ["Verification"],
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["documentType", "document"],
              properties: {
                documentType: { type: "string", example: "aadhaar" },
                document: { type: "string", format: "binary" }
              }
            }
          }
        }
      },
      responses: { 201: created("Verification uploaded."), ...commonErrors }
    }
  },
  "/api/verification/status": {
    get: {
      summary: "Get provider verification status",
      tags: ["Verification"],
      security: bearerSecurity,
      responses: { 200: ok("Verification status fetched."), 401: commonErrors[401], 403: commonErrors[403] }
    }
  },
  "/api/admin/verification/{id}": {
    put: {
      summary: "Approve or reject KYC verification",
      tags: ["Verification"],
      security: bearerSecurity,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
      requestBody: jsonBody("#/components/schemas/ProviderVerifyRequest", { status: "approved" }),
      responses: { 200: ok("Verification reviewed."), ...commonErrors }
    }
  },
  "/api/location/update": {
    put: {
      summary: "Update provider live location",
      tags: ["Location"],
      security: bearerSecurity,
      requestBody: jsonBody("#/components/schemas/GeoPoint", { latitude: 12.9719, longitude: 77.6412 }),
      responses: { 200: ok("Live location updated."), ...commonErrors }
    }
  },
  "/api/location/provider/{id}": {
    get: {
      summary: "Get provider live location",
      tags: ["Location"],
      security: bearerSecurity,
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
        { in: "query", name: "latitude", schema: { type: "number" }, example: 12.9719 },
        { in: "query", name: "longitude", schema: { type: "number" }, example: 77.6412 }
      ],
      responses: { 200: ok("Live location fetched."), ...commonErrors }
    }
  },
  "/api/search/history": {
    get: {
      summary: "Get recent search history",
      tags: ["Search"],
      security: bearerSecurity,
      parameters: [{ in: "query", name: "limit", schema: { type: "integer" }, example: 10 }],
      responses: { 200: ok("Search history fetched."), 401: commonErrors[401] }
    },
    delete: {
      summary: "Clear search history",
      tags: ["Search"],
      security: bearerSecurity,
      responses: { 200: ok("Search history cleared."), 401: commonErrors[401] }
    }
  }
});

const options = {
  definition: swaggerDefinition,
  apis: ["./app.js", "./routes/*.js"]
};

module.exports = swaggerJSDoc(options);
