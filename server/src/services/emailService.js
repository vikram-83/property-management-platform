const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return null;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@property-management.local',
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error('Email send failed:', error.message);
    return null;
  }
};

module.exports = { sendEmail };
