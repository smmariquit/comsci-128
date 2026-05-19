import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getEmailHtmlWrapper(title: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F9F8F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #111820;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F8F6; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
              <!-- Top brand bar -->
              <tr>
                <td style="background-color: #D66B38; height: 6px;"></td>
              </tr>
              <!-- Brand Header Banner -->
              <tr>
                <td style="background-color: #1C2632; padding: 30px 40px; text-align: left;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">UPLB CASA</h1>
                  <p style="margin: 5px 0 0 0; color: #BAC2CC; font-size: 14px;">Smart Student Accommodation Management</p>
                </td>
              </tr>
              <!-- Card Body Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  ${bodyHtml}
                </td>
              </tr>
              <!-- Footer info banner -->
              <tr>
                <td style="padding: 0 40px 35px 40px; text-align: left;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #E5E0D8; padding-top: 25px;">
                    <tr>
                      <td style="color: #73716D; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 0; font-weight: 600; color: #1C2632;">UPLB CASA Services</p>
                        <p style="margin: 3px 0 0 0;">University of the Philippines Los Baños, College, Los Baños, Laguna</p>
                        <p style="margin: 12px 0 0 0; font-size: 11px; color: #A19E98;">This is an automated transaction notification. Please do not reply directly to this email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendApplicationSubmittedEmail(
  studentEmail: string,
  studentName: string,
  housingName: string,
) {
  try {
    const title = "Application Submitted Successfully";
    const bodyHtml = `
      <h2 style="margin: 0 0 15px 0; color: #1C2632; font-size: 20px; font-weight: 600;">Hi ${studentName},</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">
        Your application for <strong>${housingName}</strong> has been submitted successfully and is now officially in progress.
      </p>
      
      <!-- Status highlights card -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3EDE4; border-left: 4px solid #D66B38; border-radius: 8px; margin-bottom: 25px;">
        <tr>
          <td style="padding: 16px 20px;">
            <p style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #73716D; font-weight: 600;">Current Status</p>
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1C2632;">Pending Manager Approval</p>
          </td>
        </tr>
      </table>
      
      <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; color: #555555;">
        The manager of the property will review your documents and accommodation choices shortly. We will keep you updated via email at every step of your application process.
      </p>
      
      <!-- Call to Action button styling -->
      <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
        <tr>
          <td align="center" style="background-color: #D66B38; border-radius: 8px;">
            <a href="https://casa.uplb.edu.ph/student" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: -0.2px;">Go to Student Dashboard</a>
          </td>
        </tr>
      </table>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: studentEmail,
      subject: title,
      html: getEmailHtmlWrapper(title, bodyHtml),
    });
  } catch (error) {
    console.error("sendApplicationSubmittedEmail failed:", error);
  }
}

export async function sendApplicationStatusEmail(
  studentEmail: string,
  studentName: string,
  housingName: string,
  status:
    | "Pending Manager Approval"
    | "Pending Admin Approval"
    | "Approved"
    | "Rejected"
    | "Cancelled",
) {
  try {
    let subject = "";
    let statusText = "";
    let bodyText = "";
    let statusColor = "#D66B38"; // orange

    switch (status) {
      case "Pending Manager Approval":
        subject = "Application Under Manager Review";
        statusText = "Pending Manager Approval";
        statusColor = "#D6B838"; // yellow-gold
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">Your application for <strong>${housingName}</strong> has been updated to <strong>Pending Manager Approval</strong>. The landlord/manager is currently reviewing your application and files.</p>`;
        break;
      case "Pending Admin Approval":
        subject = "Application Approved by Manager";
        statusText = "Pending Admin Approval";
        statusColor = "#D68E38"; // gold-orange
        bodyText = `<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #333333;">Great news! Your application for <strong>${housingName}</strong> has been <strong>approved by the manager</strong>.</p>
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">Your application has now been forwarded to the System Admin for final institutional approval. We will notify you the moment it is finalized.</p>`;
        break;
      case "Approved":
        subject = "Application Fully Approved 🎉";
        statusText = "Approved";
        statusColor = "#2E8B57"; // green
        bodyText = `<p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #1C2632; font-weight: 600;">Congratulations! Your application for <strong>${housingName}</strong> has been <strong>fully approved</strong>.</p>
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">You have been assigned to your new room. You can now proceed to your student dashboard to review your accommodation details and settlement schedules. Welcome to your new home!</p>`;
        break;
      case "Rejected":
        subject = "Application Decision Update";
        statusText = "Rejected";
        statusColor = "#CD5C5C"; // reddish-brown
        bodyText = `<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #333333;">Thank you for your interest in <strong>${housingName}</strong>. Unfortunately, after review, your application has been <strong>declined</strong> at this time.</p>
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">You are welcome to browse other available student housing units and apply for alternative vacancies on our portal.</p>`;
        break;
      case "Cancelled":
        subject = "Application Cancelled";
        statusText = "Cancelled";
        statusColor = "#73716D"; // gray
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">Your application for <strong>${housingName}</strong> has been officially <strong>cancelled</strong>.</p>`;
        break;
      default:
        return;
    }

    const bodyHtml = `
      <h2 style="margin: 0 0 15px 0; color: #1C2632; font-size: 20px; font-weight: 600;">Hi ${studentName},</h2>
      ${bodyText}
      
      <!-- Status Card -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3EDE4; border-left: 4px solid ${statusColor}; border-radius: 8px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 16px 20px;">
            <p style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #73716D; font-weight: 600;">New Application Status</p>
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1C2632;">${statusText}</p>
          </td>
        </tr>
      </table>
      
      <!-- Call to Action -->
      <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <tr>
          <td align="center" style="background-color: #1C2632; border-radius: 8px;">
            <a href="https://casa.uplb.edu.ph/student" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: -0.2px;">View Application Status</a>
          </td>
        </tr>
      </table>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: studentEmail,
      subject: subject,
      html: getEmailHtmlWrapper(subject, bodyHtml),
    });
  } catch (error) {
    console.error("sendApplicationStatusEmail failed:", error);
  }
}

export async function sendBillAssignedEmail(
  studentEmail: string,
  studentName: string,
  amount: number,
  billType: string,
  dueDate: string,
) {
  try {
    const formattedAmount = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

    const subject = `New Bill Issued: ${billType}`;
    const bodyHtml = `
      <h2 style="margin: 0 0 15px 0; color: #1C2632; font-size: 20px; font-weight: 600;">Hi ${studentName},</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">
        A new bill has been issued to your student housing accommodation profile. Please review the details below.
      </p>
      
      <!-- Bill details block -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3EDE4; border-left: 4px solid #D66B38; border-radius: 8px; margin-bottom: 25px;">
        <tr>
          <td style="padding: 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 10px; color: #73716D; font-size: 13px; font-weight: 600; text-transform: uppercase;">Bill Details</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #111820;">
                  <strong style="color: #1C2632;">Bill Type:</strong> ${billType}
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #111820;">
                  <strong style="color: #1C2632;">Amount Due:</strong> <span style="font-size: 16px; font-weight: 700; color: #D66B38;">${formattedAmount}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #111820;">
                  <strong style="color: #1C2632;">Due Date:</strong> ${dueDate}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; color: #555555;">
        Please log into the student portal to upload your proof of payment or settle this statement on or before the due date.
      </p>
      
      <!-- Call to Action button -->
      <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <tr>
          <td align="center" style="background-color: #D66B38; border-radius: 8px;">
            <a href="https://casa.uplb.edu.ph/student" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: -0.2px;">Settle Bill Online</a>
          </td>
        </tr>
      </table>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: studentEmail,
      subject: subject,
      html: getEmailHtmlWrapper(subject, bodyHtml),
    });
  } catch (error) {
    console.error("sendBillAssignedEmail failed:", error);
  }
}

export async function sendBillStatusUpdatedEmail(
  studentEmail: string,
  studentName: string,
  txnId: number,
  _status: string,
) {
  try {
    const subject = `Bill Payment Verified: Bill #${txnId}`;
    const bodyHtml = `
      <h2 style="margin: 0 0 15px 0; color: #1C2632; font-size: 20px; font-weight: 600;">Hi ${studentName},</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #333333;">
        We are happy to inform you that your payment for <strong>Bill #${txnId}</strong> has been successfully processed and verified.
      </p>
      
      <!-- Verification Badge status -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3EDE4; border-left: 4px solid #2E8B57; border-radius: 8px; margin-bottom: 25px;">
        <tr>
          <td style="padding: 16px 20px;">
            <p style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #73716D; font-weight: 600;">Transaction Status</p>
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #2E8B57;">Successfully Paid & Verified</p>
          </td>
        </tr>
      </table>
      
      <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; color: #555555;">
        Thank you for keeping your account status updated. You may view and download your electronic payment receipt from your student cabinet portal.
      </p>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: studentEmail,
      subject: subject,
      html: getEmailHtmlWrapper(subject, bodyHtml),
    });
  } catch (error) {
    console.error("sendBillStatusUpdatedEmail failed:", error);
  }
}
