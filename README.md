# Secure Auth Portal

A modern authentication system built with Next.js 15, NextAuth, and shadcn/ui featuring Email/OTP and Google OAuth authentication.

## Features

- **Email + OTP Authentication**: Passwordless authentication with time-limited 6-digit codes
- **Google OAuth**: Seamless sign-in with Google accounts
- **Modern UI**: Dark theme with teal accents using Tailwind CSS v4 and shadcn/ui
- **Form Validation**: Real-time validation with React Hook Form + Zod
- **Session Management**: Secure JWT-based sessions with NextAuth
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth v4
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
# or
pnpm install
```

### Environment Setup

The `.env.local` file is pre-configured. To enable Google OAuth, update:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Get Google OAuth credentials:**

1. Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Email + OTP Login

1. Click **Login** or **Register**
2. Enter your email
3. Use OTP: `123456` (demo code, expires in 5 min)
4. Verify to authenticate

### Google OAuth

1. Click **Login** or **Register**
2. Click **Google** button
3. Complete OAuth flow

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth API routes
│   ├── api/demo-otp/             # OTP endpoints
│   ├── layout.tsx                # Root layout + providers
│   └── page.tsx                  # Home page
├── components/
│   ├── auth-dialog-form.tsx      # Auth form with OTP
│   ├── login-dialog.tsx          # Login modal
│   ├── register-dialog.tsx       # Register modal
│   └── ui/                       # shadcn components
├── lib/
│   ├── auth.ts                   # NextAuth config
│   └── otpStore.ts               # Demo OTP store
└── types/
    └── next-auth.d.ts            # Type extensions
```

## Demo Configuration

- **OTP Code**: `123456` (fixed for demo)
- **OTP Expiry**: 5 minutes
- **Resend Cooldown**: 60 seconds

## Production Checklist

⚠️ **Before production deployment:**

1. **Replace in-memory OTP store** with Redis/PostgreSQL
2. **Generate random OTPs** (6-digit codes)
3. **Integrate email service** (SendGrid, AWS SES, Resend)
4. **Add rate limiting** on OTP endpoints
5. **Implement CAPTCHA** for bot protection
6. **Remove sessionStorage mirroring** (`NEXT_PUBLIC_MIRROR_SESSION_TO_STORAGE=false`)
7. **Use strong NEXTAUTH_SECRET** (`openssl rand -base64 32`)
8. **Add error logging** and monitoring
9. **Test Google OAuth** with production redirect URIs

## API Endpoints

### POST /api/auth/signin/credentials

Authenticate with email + OTP

### POST /api/demo-otp/request

Request OTP for email (demo: returns `123456`)

### POST /api/demo-otp/verify

Verify OTP code

### GET /api/auth/session

Get current session

### Session Duration

Modify `src/lib/auth.ts`:

```typescript
session: {
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

## Troubleshooting

### Google OAuth Issues

- Verify credentials in `.env.local`
- Check redirect URI in Google Console
- Ensure OAuth consent screen is configured

### OTP Not Working

- Use demo code: `123456`
- Check 5-minute expiry
- Wait 60 seconds before resend

### Build Errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Project Specifications](./CLAUDE.md)

---

Built with Next.js 15 + NextAuth + shadcn/ui
