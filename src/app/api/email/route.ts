// import {NextResponse} from "next/server";
// import { sendEmail } from "@/app/lib/services/email";

// export async function POST(request: Request) {
//     const { to, subject, message } = await request.json();
//     await sendEmail(to, subject, message);

//     return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
// }