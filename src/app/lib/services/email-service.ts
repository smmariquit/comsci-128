import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApplicationSubmittedEmail(
    studentEmail: string,
    studentName: string,
    housingName: string,
) {
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
}

export async function sendApplicationStatusEmail(
    studentEmail: string,
    studentName: string,
    housingName: string,
    status: "Pending Admin Approval" | "Rejected",
) {
    const isApproved = status === "Pending Admin Approval";

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: studentEmail,
        subject: isApproved ? "Application Approved" : "Application Rejected",
        html: `
            <h2>Hi ${studentName},</h2>
            <p>Your application for <strong>${housingName}</strong> has been <strong>${isApproved ? "approved by the manager" : "rejected"}</strong>.</p>
            ${isApproved
                ? "<p>Your application is now pending final admin approval. We will notify you once it has been fully approved.</p>"
                : "<p>Unfortunately your application did not meet the requirements. You may apply to other available housings.</p>"
            }
            <br/>
            <p>Thank you!</p>
        `,
    });
}