import 'dotenv/config';
import { Resend } from 'resend';

/**
 * Send booking confirmation email
 * @param {Object} bookingDetails - Contains all the necessary data for the email
*/
export const sendConfirmationEmail = async (bookingDetails) => {
  
  const resend = new Resend(process.env.RESEND_API);
  const {
    firstName,
    email,
    dateString,
    time,
    timezoneLabel,
    meetLink
  } = bookingDetails;

  const mailOptions = {
    from: `"Event Scheduler" <${process.env.EMAIL_USER}>`,
    to: email, // Attendee email
    subject: 'Meeting Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4F46E5;">Meeting Scheduled Successfully</h2>
        <p>Hi ${firstName},</p>
        <p>Your meeting has been confirmed. Below are the details for your upcoming event:</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 10px 0;"><strong>Attendee Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Meeting Date:</strong> ${dateString}</p>
          <p style="margin: 10px 0;"><strong>Time:</strong> ${time} PM</p>
          <p style="margin: 10px 0;"><strong>Timezone:</strong> ${timezoneLabel}</p>
          <p style="margin: 10px 0;"><strong>Google Meet Link:</strong> <a href="${meetLink}" style="color: #4F46E5; text-decoration: none;"><strong>${meetLink}</strong></a></p>
        </div>

        <p>We look forward to meeting with you!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
          <p>If you need to cancel or make changes, please contact us prior to the meeting time.</p>
        </div>
      </div>
    `
  };

  try {
    const { data, error } = await resend.emails.send(mailOptions);
    
    if (error) {
      console.error('Resend API Error:', error);
      throw error;
    }

    console.log('Email sent successfully: %s', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
