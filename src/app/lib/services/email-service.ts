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
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #ede9de; color: #1c2632; margin: 0; padding: 40px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #1c2632;">
        <tr>
          <td style="background-color: #1c2632; padding: 30px; text-align: center;">
            <h1 style="color: #ede9de; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">${title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px; background-color: #ffffff;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="background-color: #ede9de; padding: 20px; text-align: center; border-top: 1px solid #e3af64;">
            <p style="margin: 0; font-size: 12px; color: #2f4a4c;">
              &copy; 2026 UPLB CASA Platform. All rights reserved.
            </p>
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
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Hi ${studentName},
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Your application for <strong>${housingName}</strong> has been submitted successfully.
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Your application status is now <strong>Pending Manager Approval</strong>. We will notify you once it has been reviewed.
      </p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <a href="https://casa.uplb.edu.ph/student" style="background-color: #c9642a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Go to Student Dashboard</a>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #567375;">
        Thank you for choosing UPLB CASA!
      </p>
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
  status: "Pending Manager Approval" | "Pending Admin Approval" | "Approved" | "Rejected" | "Cancelled",
) {
  try {
    let subject = "";
    let bodyText = "";

    switch (status) {
      case "Pending Manager Approval":
        subject = "Application Under Manager Review";
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">Your application for <strong>${housingName}</strong> has been updated to <strong>Pending Manager Approval</strong>. The landlord/manager is currently reviewing your application.</p>`;
        break;
      case "Pending Admin Approval":
        subject = "Application Approved by Manager";
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">Your application for <strong>${housingName}</strong> has been <strong>approved by the manager</strong>.</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">Your application is now pending final admin approval. We will notify you once it has been fully approved.</p>`;
        break;
      case "Approved":
        subject = "Application Fully Approved 🎉";
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">Congratulations! Your application for <strong>${housingName}</strong> has been <strong>fully approved</strong>.</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">You have been assigned to your room. Welcome to your new home!</p>`;
        break;
      case "Rejected":
        subject = "Application Rejected";
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">Unfortunately, your application for <strong>${housingName}</strong> has been <strong>rejected</strong>.</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">You may browse and apply to other available housing listings on our platform.</p>`;
        break;
      case "Cancelled":
        subject = "Application Cancelled";
        bodyText = `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">Your application for <strong>${housingName}</strong> has been <strong>cancelled</strong>.</p>`;
        break;
      default:
        return;
    }

    const bodyHtml = `
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Hi ${studentName},
      </p>
      ${bodyText}
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <a href="https://casa.uplb.edu.ph/student" style="background-color: #c9642a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">View Application Status</a>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #567375;">
        Thank you, <br/>UPLB CASA Team
      </p>
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
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Hi ${studentName},
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        A new bill has been issued to your student housing account:
      </p>
      <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #ede9de; border-radius: 8px; margin-bottom: 20px; border: 1px solid #1c2632;">
        <tr>
          <td style="font-size: 15px; color: #1c2632;"><strong>Bill Type:</strong></td>
          <td style="font-size: 15px; color: #111820;">${billType}</td>
        </tr>
        <tr>
          <td style="font-size: 15px; color: #1c2632;"><strong>Amount:</strong></td>
          <td style="font-size: 15px; color: #111820; font-weight: bold;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="font-size: 15px; color: #1c2632;"><strong>Due Date:</strong></td>
          <td style="font-size: 15px; color: #111820;">${dueDate}</td>
        </tr>
      </table>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Please settle this bill through your student dashboard on or before the due date to avoid any issues.
      </p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <a href="https://casa.uplb.edu.ph/student" style="background-color: #c9642a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Settle Bill Online</a>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #567375;">
        Thank you, <br/>UPLB CASA Team
      </p>
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
  status: string,
) {
  try {
    const subject = `Bill Payment Verified: Bill #${txnId}`;
    const bodyHtml = `
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Hi ${studentName},
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        Your payment for <strong>Bill #${txnId}</strong> has been successfully processed and verified.
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #111820;">
        The bill status has been updated to: <strong>${status}</strong>.
      </p>
      <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #567375;">
        Thank you for keeping your account status updated. <br/>UPLB CASA Team
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
