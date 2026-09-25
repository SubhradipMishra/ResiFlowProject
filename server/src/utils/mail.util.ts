import nodemailer from "nodemailer";

const getSmtpUser = () => process.env.BREVO_USER || process.env.SMTP_EMAIL || "resiflow.support@gmail.com";
const getSmtpPass = () => process.env.BREVO_CREDENTIALS || process.env.SMTP_PASS;

export const getMailTransporter = () => {
    const user = getSmtpUser();
    const pass = getSmtpPass();

    return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // TLS
        auth: {
            user,
            pass,
        },
    });
};

// Helper: Try sending via Brevo HTTP API first (using BREVO_API_KEY or BREVO_CREDENTIALS)
const sendMailViaBrevoApi = async (
    senderName: string,
    toEmail: string,
    toName: string,
    subject: string,
    htmlContent: string
): Promise<boolean> => {
    const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_CREDENTIALS;
    if (!apiKey) return false;

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: { name: senderName, email: getSmtpUser() },
                to: [{ email: toEmail, name: toName || toEmail }],
                subject,
                htmlContent,
            }),
        });

        const data = (await response.json()) as any;
        if (response.ok && (data.messageId || data.messageIds)) {
            console.log(`[Brevo API] Email sent to ${toEmail} (MessageId: ${data.messageId || data.messageIds})`);
            return true;
        } else {
            console.warn(`[Brevo API Notice] HTTP ${response.status}: ${data.message || JSON.stringify(data)}. Falling back to SMTP...`);
            return false;
        }
    } catch (e: any) {
        console.warn(`[Brevo API Warning] ${e.message}. Falling back to SMTP...`);
        return false;
    }
};

// Helper: General unified email sender (Brevo HTTP API -> SMTP fallback)
const dispatchEmail = async ({
    senderName,
    toEmail,
    toName,
    subject,
    htmlContent,
}: {
    senderName: string;
    toEmail: string;
    toName: string;
    subject: string;
    htmlContent: string;
}): Promise<boolean> => {
    // 1. Try Brevo API first
    const apiSuccess = await sendMailViaBrevoApi(senderName, toEmail, toName, subject, htmlContent);
    if (apiSuccess) return true;

    // 2. Fallback to SMTP Relay
    try {
        const mailTransporter = getMailTransporter();
        const info = await mailTransporter.sendMail({
            from: `"${senderName}" <${getSmtpUser()}>`,
            to: toEmail,
            subject,
            html: htmlContent,
        });
        console.log(`[Brevo SMTP] Email sent to ${toEmail} (MessageId: ${info.messageId})`);
        return true;
    } catch (error: any) {
        console.error(`[Email Error] Failed to send email to ${toEmail}:`, error.message);
        return false;
    }
};

export const sendAccountCredentialsMail = async ({
    email,
    name,
    role,
    password,
    societyName,
}: {
    email: string;
    name: string;
    role: string;
    password?: string;
    societyName?: string;
}) => {
    console.log(`\n==================================================`);
    console.log(`🔑 [RESIFLOW DEV ACCOUNT CREDENTIALS]`);
    console.log(`👤 Name: ${name}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password || '(Unchanged)'}`);
    console.log(`🏢 Role: ${role} | Society: ${societyName || 'Unassigned'}`);
    console.log(`==================================================\n`);

    const htmlContent = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 28px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">ResiFlow</h1>
                <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Residential & Society Management Platform</p>
            </div>

            <div style="padding: 32px 28px;">
                <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Hello ${name},</h2>
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                    Your ResiFlow account has been created for <strong>${societyName || "Residential Society"}</strong> with the role of <strong>${role}</strong>.
                </p>

                <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <div style="margin-bottom: 10px;">
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Email</span>
                        <span style="font-size: 15px; color: #0f172a; font-weight: 600;">${email}</span>
                    </div>
                    ${password
            ? `<div>
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Temporary Password</span>
                        <span style="font-size: 15px; color: #e11d48; font-weight: 700; font-family: monospace;">${password}</span>
                    </div>`
            : ""
        }
                </div>

                <p style="color: #64748b; font-size: 13px; margin: 0 0 24px 0;">
                    Please log in and update your password immediately to protect your account.
                </p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; transition: all 0.2s ease;">
                        Access ResiFlow Portal
                    </a>
                </div>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding: 16px 28px; background: #fafafa; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ResiFlow System. All rights reserved.</p>
            </div>
        </div>
    </div>
    `;

    return dispatchEmail({
        senderName: "ResiFlow Platform",
        toEmail: email,
        toName: name,
        subject: `Welcome to ResiFlow - Your ${role.toUpperCase()} Account Credentials`,
        htmlContent,
    });
};

export const sendNoticeMail = async ({
    emails,
    title,
    description,
    priority,
    societyName,
}: {
    emails: string[];
    title: string;
    description: string;
    priority: string;
    societyName?: string;
}) => {
    if (!emails || emails.length === 0) return false;

    const priorityColors: Record<string, string> = {
        urgent: "#be123c",
        high: "#e11d48",
        medium: "#d97706",
        low: "#059669",
    };
    const color = priorityColors[priority] || "#0f172a";

    const htmlContent = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
            <div style="background: #0f172a; padding: 24px; text-align: left; border-left: 6px solid ${color};">
                <span style="background: ${color}; color: #ffffff; font-size: 11px; text-transform: uppercase; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.05em;">${priority}</span>
                <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px; font-weight: 700;">${title}</h2>
                <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Published by Management - ${societyName || "ResiFlow"}</p>
            </div>
            <div style="padding: 28px;">
                <div style="color: #334155; font-size: 14px; line-height: 1.7; white-space: pre-line;">${description}</div>
            </div>
            <div style="border-top: 1px solid #f1f5f9; padding: 14px 28px; background: #fafafa; text-align: center;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">This is an official automated notification from ResiFlow.</p>
            </div>
        </div>
    </div>
    `;

    let successCount = 0;
    for (const email of emails) {
        const ok = await dispatchEmail({
            senderName: "ResiFlow Notice Board",
            toEmail: email,
            toName: "Resident",
            subject: `[${priority.toUpperCase()} NOTICE] ${title} - ${societyName || "Society Update"}`,
            htmlContent,
        });
        if (ok) successCount++;
    }

    return successCount > 0;
};

export const sendComplaintUpdateMail = async ({
    email,
    residentName,
    title,
    status,
    note,
}: {
    email: string;
    residentName: string;
    title: string;
    status: string;
    note?: string;
}) => {
    const htmlContent = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
            <div style="background: #0f172a; padding: 24px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 18px;">Complaint Status Update</h2>
            </div>
            <div style="padding: 28px;">
                <p style="color: #475569; font-size: 14px; margin: 0 0 16px 0;">Hello <strong>${residentName}</strong>,</p>
                <p style="color: #334155; font-size: 14px; margin: 0 0 20px 0;">Your complaint <strong>"${title}"</strong> status has been updated to:</p>
                <div style="display: inline-block; background: #f1f5f9; padding: 8px 16px; border-radius: 8px; font-weight: 700; color: #0f172a; text-transform: uppercase; font-size: 14px; margin-bottom: 20px;">
                    ${status}
                </div>
                ${note ? `<div style="background: #f8fafc; border-left: 3px solid #0f172a; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #475569;"><strong>Staff/Admin Note:</strong><br/>${note}</div>` : ""}
                <p style="color: #64748b; font-size: 13px;">You can view the real-time status in your ResiFlow resident portal.</p>
            </div>
        </div>
    </div>
    `;

    return dispatchEmail({
        senderName: "ResiFlow Helpdesk",
        toEmail: email,
        toName: residentName,
        subject: `Complaint Status Updated: ${title} [${status.toUpperCase()}]`,
        htmlContent,
    });
};

export const sendOtpMail = async ({
    email,
    name,
    otp,
}: {
    email: string;
    name: string;
    otp: string;
}) => {
    console.log(`\n==================================================`);
    console.log(`🔐 [RESIFLOW 2FA CODE] OTP for ${email}: ${otp}`);
    console.log(`==================================================\n`);

    const htmlContent = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; text-align: center;">
            <div style="background: #0f172a; padding: 24px;">
                <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Verification Required</h2>
            </div>
            <div style="padding: 32px 28px;">
                <p style="color: #475569; font-size: 15px; margin: 0 0 20px 0;">Hi <strong>${name}</strong>,</p>
                <p style="color: #334155; font-size: 14px; margin: 0 0 24px 0;">Use the following 6-digit code to complete your login. This code will expire in 10 minutes.</p>
                <div style="display: inline-block; background: #f1f5f9; padding: 16px 32px; border-radius: 12px; font-weight: 800; color: #e11d48; letter-spacing: 0.2em; font-size: 32px; margin-bottom: 24px; border: 1px dashed #cbd5e1;">
                    ${otp}
                </div>
                <p style="color: #64748b; font-size: 12px; margin: 0;">If you didn't request this code, you can safely ignore this email or contact support if you have concerns.</p>
            </div>
        </div>
    </div>
    `;

    return dispatchEmail({
        senderName: "ResiFlow Security",
        toEmail: email,
        toName: name,
        subject: `Your ResiFlow Verification Code: ${otp}`,
        htmlContent,
    });
};
