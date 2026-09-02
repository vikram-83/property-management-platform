// Frontend-only authentication (no backend required)
// Users are stored in localStorage

// Demo users for testing
const DEMO_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@demo.com",
    password: "123456",
    role: "admin",
    phone: "+91 9876543210",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@demo.com",
    password: "123456",
    role: "manager",
    phone: "+91 9876543211",
  },
  {
    id: "3",
    name: "Tenant User",
    email: "tenant@demo.com",
    password: "123456",
    role: "tenant",
    phone: "+91 9876543212",
  },
  {
    id: "4",
    name: "Staff User",
    email: "staff@demo.com",
    password: "123456",
    role: "staff",
    phone: "+91 9876543213",
  },
  {
    id: "5",
    name: "Vendor User",
    email: "vendor@demo.com",
    password: "123456",
    role: "vendor",
    phone: "+91 9876543214",
  },
];

// Initialize users in localStorage if not present
const initializeUsers = () => {
  const existingUsers = localStorage.getItem("pmp_users");
  if (!existingUsers) {
    localStorage.setItem("pmp_users", JSON.stringify(DEMO_USERS));
  }
};

const register = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        initializeUsers();
        const users = JSON.parse(localStorage.getItem("pmp_users") || "[]");
        
        // Check if user already exists
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          reject({
            response: {
              data: {
                message: "User with this email already exists"
              }
            }
          });
          return;
        }

        // Validate password length
        if (data.password.length < 6) {
          reject({
            response: {
              data: {
                message: "Password must be at least 6 characters"
              }
            }
          });
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email.toLowerCase(),
          password: data.password,
          role: data.role || "tenant",
          phone: data.phone || "",
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("pmp_users", JSON.stringify(users));

        resolve({
          message: "User registered successfully",
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
          }
        });
      } catch (error) {
        reject({
          response: {
            data: {
              message: "Registration failed: " + error.message
            }
          }
        });
      }
    }, 500); // Simulate network delay
  });
};

const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        initializeUsers();
        const users = JSON.parse(localStorage.getItem("pmp_users") || "[]");
        
        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          reject({
            response: {
              data: {
                message: "User not found"
              }
            }
          });
          return;
        }

        // Check password
        if (user.password !== password) {
          reject({
            response: {
              data: {
                message: "Invalid password"
              }
            }
          });
          return;
        }

        // Generate token (just a simple token for frontend use)
        const token = `token_${user.id}_${Date.now()}`;

        resolve({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
          }
        });
      } catch (error) {
        reject({
          response: {
            data: {
              message: "Login failed: " + error.message
            }
          }
        });
      }
    }, 500); // Simulate network delay
  });
};

const getMe = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          reject({
            response: {
              data: {
                message: "No token found"
              }
            }
          });
          return;
        }

        const userStr = localStorage.getItem("user");
        if (!userStr) {
          reject({
            response: {
              data: {
                message: "User not found"
              }
            }
          });
          return;
        }

        const user = JSON.parse(userStr);
        resolve(user);
      } catch (error) {
        reject({
          response: {
            data: {
              message: "Failed to get user: " + error.message
            }
          }
        });
      }
    }, 300);
  });
};

export default { register, login, getMe };
