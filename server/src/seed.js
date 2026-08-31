// Run with: npm run seed
// Creates one demo user per role so you can log in and test each dashboard.
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");

const demoUsers = [
  { name: "Admin User", email: "admin@demo.com", password: "password123", role: "admin" },
  { name: "Manager User", email: "manager@demo.com", password: "password123", role: "manager" },
  { name: "Tenant User", email: "tenant@demo.com", password: "password123", role: "tenant" },
  { name: "Staff User", email: "staff@demo.com", password: "password123", role: "staff" },
  { name: "Vendor User", email: "vendor@demo.com", password: "password123", role: "vendor" },
];

const run = async () => {
  await connectDB();
  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`Created ${u.role}: ${u.email}`);
    } else {
      console.log(`Already exists: ${u.email}`);
    }
  }
  console.log("Seeding complete. All demo passwords: password123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
