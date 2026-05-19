import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApplicationSubmittedEmail(
  studentEmail: string,
  studentName: string,
  housingName: string,
) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: studentEmail,
      subject: "Application Submitted Successfully",
      html: `
        <h2>Hi ${studentName},</h2>
        <p>Your application for <strong>${housingName}</strong> has been submitted successfully.</p>
        <p>Your application is now <strong>Pending Manager Approval</strong>. We will notify you once it has been reviewed.</p>
        <br/>
        <p>Thank you!</p>
      `,
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
    let body = "";

    switch (status) {
      case "Pending Manager Approval":
        subject = "Application Under Manager Review";
        body = `<p>Your application for <strong>${housingName}</strong> has been set to <strong>Pending Manager Approval</strong>. The landlord/manager is currently reviewing your application.</p>`;
        break;
      case "Pending Admin Approval":
        subject = "Application Approved by Manager";
        body = `<p>Your application for <strong>${housingName}</strong> has been <strong>approved by the manager</strong>.</p>
                <p>Your application is now pending final admin approval. We will notify you once it has been fully approved.</p>`;
        break;
      case "Approved":
        subject = "Application Fully Approved";
        body = `<p>Congratulations! Your application for <strong>${housingName}</strong> has been <strong>fully approved</strong>.</p>
                <p>You have been assigned to your room. Welcome to your new home!</p>`;
        break;
      case "Rejected":
        subject = "Application Rejected";
        body = `<p>Unfortunately, your application for <strong>${housingName}</strong> has been <strong>rejected</strong>.</p>
                <p>You may browse and apply to other available housing listings on our platform.</p>`;
        break;
      case "Cancelled":
        subject = "Application Cancelled";
        body = `<p>Your application for <strong>${housingName}</strong> has been <strong>cancelled</strong>.</p>`;
        break;
      default:
        return;
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: studentEmail,
      subject: subject,
      html: `
        <h2>Hi ${studentName},</h2>
        ${body}
        <br/>
        <p>Thank you!</p>
      `,
    });
  } catch (error) {
    console.error("sendApplicationStatusEmail failed:", error);
  }
}
