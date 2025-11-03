import nodemailer from 'nodemailer';
import logger from './logger.config.js';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ilyes.mekalfa@gmail.com',
    pass: 'sguc hpok vbpb jnsg',
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    logger.error('Gmail SMTP connection error:', error);
  } else {
    logger.info('Gmail SMTP server is ready to send emails');
  }
});

const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER || 'MSJ Hackathon <noreply@msj.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    });

    logger.info(
      {
        messageId: info.messageId,
        to: options.email,
        provider: 'gmail',
      },
      'Email sent successfully via Gmail'
    );

    return info;
  } catch (error) {
    logger.error({ err: error }, 'Failed to send email via Gmail');
    throw new Error('Email could not be sent');
  }
};

const sendPasswordResetEmail = async (user, resetCode) => {
  const text = `Hi ${user.name},

We received a request to reset your password for your MSJ mobile app account.

Your password reset code is: ${resetCode}

Enter this code in the mobile app to reset your password.

⏱️ This code will expire in 10 minutes for security reasons.

🔒 SECURITY NOTICE: Never share this code with anyone. MSJ support will never ask for your reset code.

If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The MSJ Team`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #dbe8dc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5dab7a 0%, #4a9368 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                🔐 Reset Your Password
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${user.name}</strong>,
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                We received a request to reset your password. Enter this code in the MSJ mobile app to create a new password:
              </p>

              <!-- 4-Digit Code Display -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #5dab7a 0%, #4a9368 100%); border-radius: 12px; padding: 20px 40px; box-shadow: 0 4px 12px rgba(93, 171, 122, 0.3);">
                      <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                        Your Reset Code
                      </p>
                      <p style="color: #ffffff; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${resetCode}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
                ⏱️ <strong>This code will expire in 10 minutes</strong>
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #e8f5e9; border-left: 4px solid #5dab7a; padding: 15px 20px; border-radius: 6px;">
                <p style="color: #2e7d4e; font-size: 14px; margin: 0; line-height: 1.5;">
                  🔒 <strong>Security Notice:</strong> Never share this code with anyone. MSJ support will never ask for your reset code. If you didn't request this, please ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f8f4; padding: 30px; text-align: center; border-top: 1px solid #d4e8db;">
              <p style="color: #6c8876; font-size: 12px; margin: 0 0 10px;">
                This is an automated message from MSJ Mobile App.
              </p>
              <p style="color: #6c8876; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} MSJ. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail({
    email: user.email,
    subject: '🔐 Reset Your MSJ Password',
    message: text,
    html,
  });
};

const sendEmailVerification = async (user, verificationCode) => {
  const text = `Hi ${user.name},

Welcome to MSJ! 

Your verification code is: ${verificationCode}

Enter this code in the mobile app to verify your email address and complete your registration.

⏱️ This code will expire in 1 hours for security reasons.


If you didn't create an account, you can safely ignore this email.

Best regards,
The MSJ Team`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #dbe8dc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5dab7a 0%, #4a9368 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                ✉️ Verify Your Email
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${user.name}</strong>,
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Welcome to MSJ! Enter this verification code in the mobile app to complete your registration:
              </p>

              <!-- 4-Digit Code Display -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #5dab7a 0%, #4a9368 100%); border-radius: 12px; padding: 20px 40px; box-shadow: 0 4px 12px rgba(93, 171, 122, 0.3);">
                      <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                        Your Verification Code
                      </p>
                      <p style="color: #ffffff; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${verificationCode}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
                ⏱️ <strong>This code will expire in 24 hours</strong>
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #e8f5e9; border-left: 4px solid #5dab7a; padding: 15px 20px; border-radius: 6px;">
                <p style="color: #2e7d4e; font-size: 14px; margin: 0; line-height: 1.5;">
                  🔒 <strong>Security Notice:</strong> Never share this code with anyone. MSJ support will never ask for your verification code.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f8f4; padding: 30px; text-align: center; border-top: 1px solid #d4e8db;">
              <p style="color: #6c8876; font-size: 12px; margin: 0 0 10px;">
                If you didn't create an account with MSJ, you can safely ignore this email.
              </p>
              <p style="color: #6c8876; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} MSJ. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail({
    email: user.email,
    subject: '✉️ Verify Your MSJ Email Address',
    message: text,
    html,
  });
};

const sendProjectRequestEmail = async (supervisor, entrepreneur, project, requestId, message) => {
  const approveUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/project-requests/${requestId}/respond?status=approved`;
  const rejectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/project-requests/${requestId}/respond?status=rejected`;

  const text = `Hi ${supervisor.name},

${entrepreneur.name} has requested your supervision for their startup project!

PROJECT DETAILS:
Title: ${project.title}
Category: ${project.category}
Stage: ${project.stage || 'idea'}

${message ? `MESSAGE FROM ENTREPRENEUR:\n"${message}"\n` : ''}
To respond to this request, please use one of the links below:

Approve: ${approveUrl}
Reject: ${rejectUrl}

Best regards,
The MSJ Sparks Hub Team`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                🚀 New Supervision Request
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${supervisor.name}</strong>,
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                <strong>${entrepreneur.name}</strong> has requested your supervision for their startup project!
              </p>

              <!-- Project Details Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <h3 style="color: #667eea; margin: 0 0 15px; font-size: 18px;">📋 Project Details</h3>
                <p style="color: #333333; margin: 8px 0; font-size: 15px;">
                  <strong>Title:</strong> ${project.title}
                </p>
                <p style="color: #333333; margin: 8px 0; font-size: 15px;">
                  <strong>Category:</strong> ${project.category}
                </p>
                <p style="color: #333333; margin: 8px 0; font-size: 15px;">
                  <strong>Stage:</strong> ${project.stage || 'idea'}
                </p>
                ${
                  project.problemStatement
                    ? `<p style="color: #555555; margin: 15px 0 8px; font-size: 14px;">
                  <strong>Problem:</strong> ${project.problemStatement.substring(0, 150)}${project.problemStatement.length > 150 ? '...' : ''}
                </p>`
                    : ''
                }
              </div>

              ${
                message
                  ? `
              <!-- Message from Entrepreneur -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <h3 style="color: #856404; margin: 0 0 10px; font-size: 16px;">💬 Message from ${entrepreneur.name}</h3>
                <p style="color: #333333; margin: 0; font-size: 15px; font-style: italic;">
                  "${message}"
                </p>
              </div>
              `
                  : ''
              }

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 20px;">
                Please review the project and respond:
              </p>

              <!-- Action Buttons -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="padding: 10px; text-align: center;">
                    <a href="${approveUrl}" style="display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);">
                      ✅ Approve & Supervise
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; text-align: center;">
                    <a href="${rejectUrl}" style="display: inline-block; background-color: #e0e0e0; color: #555555; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      ❌ Decline Request
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #e8f4fd; border-left: 4px solid #2196f3; padding: 15px; margin: 30px 0; border-radius: 6px;">
                <p style="color: #1565c0; margin: 0; font-size: 14px;">
                  ℹ️ <strong>Note:</strong> Once you approve, the project will become public in the Sparks Hub and you'll be listed as the supervisor.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px;">
                This email was sent from the MSJ Sparks Hub
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} MSJ. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail({
    email: supervisor.email,
    subject: '🚀 New Supervision Request - MSJ Sparks Hub',
    message: text,
    html,
  });
};

export { sendEmail, sendPasswordResetEmail, sendEmailVerification, sendProjectRequestEmail };
