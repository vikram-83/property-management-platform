# Demo Credentials

## Frontend-Only Authentication

This application now uses **frontend-only authentication** that works on Vercel without requiring a backend server.

### Demo User Accounts

All demo users use the same password: `123456`

#### Admin
- **Email**: `admin@demo.com`
- **Password**: `123456`
- **Role**: Admin

#### Manager
- **Email**: `manager@demo.com`
- **Password**: `123456`
- **Role**: Manager

#### Tenant
- **Email**: `tenant@demo.com`
- **Password**: `123456`
- **Role**: Tenant

#### Staff
- **Email**: `staff@demo.com`
- **Password**: `123456`
- **Role**: Staff

#### Vendor
- **Email**: `vendor@demo.com`
- **Password**: `123456`
- **Role**: Vendor

## How It Works

- **No Backend Required**: All authentication is done locally in the browser using localStorage
- **Persistent Storage**: Users are stored in browser's localStorage
- **Create New Users**: You can create new accounts through the signup page
- **Demo Data**: Pre-populated demo accounts are available for quick testing

## Development vs Production

### Development (Local)
```
npm run dev  # Frontend only, no backend needed
```

### Production (Vercel)
- Frontend is deployed to Vercel
- Works completely client-side without backend
- No need for backend server running

## Features
- ✅ Login/Signup without backend
- ✅ Works on Vercel deployment
- ✅ No "Server connection" errors
- ✅ Persistent sessions using localStorage
- ✅ Role-based access control

## Adding More Users

Users are stored in localStorage under the key `pmp_users`. To add more demo users:

1. Edit `client/src/services/authService.js`
2. Add new user objects to the `DEMO_USERS` array
3. Commit and push changes

Example:
```javascript
{
  id: "6",
  name: "Your Name",
  email: "yourname@demo.com",
  password: "123456",
  role: "tenant",
  phone: "+91 9876543215",
}
```
