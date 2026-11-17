import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, ContactFormData } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const formData: ContactFormData = {
      name: body.name.trim(),
      company: body.company?.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim(),
      message: body.message.trim(),
    };

    // Send email
    const result = await sendContactEmail(formData);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint' },
    { status: 200 }
  );
}