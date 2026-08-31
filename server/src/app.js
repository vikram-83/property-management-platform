const express = require("express");
const cors = require("cors");
const path = require("path");

// Middleware Imports
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Standard Middlewares
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://property-management-platform-murex.vercel.app",
  "https://property-management-platform-git-main-vikram-83s-projects.vercel.app",
  "https://property-management-platform-l8c6jhwci-vikram-83s-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Policy: Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static Folder for Uploads (Images/Documents)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Root Route (ब्राउज़र में direct URL खोलने के लिए)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Property Management API is running successfully",
  });
});

// API Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running fine." });
});

// API Routes Mounting
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/buildings", require("./routes/buildingRoutes"));
app.use("/api/units", require("./routes/unitRoutes"));
app.use("/api/tenants", require("./routes/tenantRoutes"));
app.use("/api/tenant-features", require("./routes/tenantFeaturesRoutes"));
app.use("/api/leases", require("./routes/leaseRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/maintenance", require("./routes/MaintenanceRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/payment-history", require("./routes/paymentHistoryRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/amenities", require("./routes/amenityRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/notifications", require("./routes/NotificationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/community", require("./routes/communityRoutes"));
app.use("/api/profile", require("./routes/ProfileRoutes"));
app.use("/api/support", require("./routes/SupportRoutes"));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;