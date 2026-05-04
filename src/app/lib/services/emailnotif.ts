import {Resend} from 'resend';

export interface EmailData {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
  }

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: EmailData) {
    try {
        const response = await resend.emails.send({
        from: data.from,
        to: data.to,
        subject: data.subject,
        html: data.html,
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
    }