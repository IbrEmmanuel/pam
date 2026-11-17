# Email Service Setup Instructions

## Overview
Your contact form is now set up to send emails! When users submit the contact form, it will:
1. Send you an email with their contact details and message
2. Send them an automatic confirmation email

## Setup Steps

### 1. Create Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
COMPANY_EMAIL=your-company-email@gmail.com
```

### 2. Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `EMAIL_PASS`

### 3. Other Email Providers
You can also use other email providers by modifying the `emailService.ts` file:

**Outlook/Hotmail:**
```typescript
service: 'hotmail',
```

**Yahoo:**
```typescript
service: 'yahoo',
```

**Custom SMTP:**
```typescript
host: 'your-smtp-server.com',
port: 587,
secure: false,
```

## How It Works

### API Endpoint
- **URL:** `/api/contact`
- **Method:** POST
- **Required fields:** name, email, message
- **Optional fields:** company, phone

### Email Templates
- **Company Email:** Professional formatted email with all contact details
- **Customer Email:** Automatic confirmation with PAM Africa branding

### Form Features
- ✅ Real-time validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success confirmation
- ✅ Form reset after submission

## Testing
1. Start your development server: `npm run dev`
2. Open the contact form
3. Fill out and submit the form
4. Check your email for the submission
5. Check the customer's email for the confirmation

## Troubleshooting

### Common Issues
1. **"Invalid login"** - Check your email credentials and app password
2. **"Connection timeout"** - Verify your internet connection and email provider settings
3. **"Form not submitting"** - Check browser console for JavaScript errors

### Debug Mode
Add `console.log` statements in the API route to debug issues:
```typescript
console.log('Form data received:', formData);
console.log('Email service result:', result);
```

## Security Notes
- Never commit `.env.local` to version control
- Use App Passwords instead of your main email password
- Consider implementing rate limiting for production use
- Validate all form inputs on both client and server side

## Production Deployment
When deploying to production:
1. Set environment variables in your hosting platform
2. Ensure your email provider allows SMTP from your hosting IP
3. Consider using a dedicated email service like SendGrid or Mailgun for better deliverability
