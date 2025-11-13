import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { PackageCardDTO } from '@application/dtos/PackageDTO';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generate HTML email for top packages
 */
const generateTopPackagesEmailHTML = (packages: PackageCardDTO[]): string => {
  const packageCards = packages
    .map(
      (pkg) => `
      <tr>
        <td align="center" style="padding: 15px; border-bottom: 1px solid #ddd;">
          <img src="${pkg.imageUrl}" alt="${pkg.title}" style="width: 200px; height: 120px; border-radius: 10px; object-fit: cover;" />
          <h3 style="font-family: Arial, sans-serif; color: #333;">${pkg.title}</h3>
          <p style="margin: 5px 0; color: #555;">
            ${pkg.durationDays} Days / ${pkg.durationNights} Nights
          </p>
          <p style="font-weight: bold; color: #0d6efd;">₹${pkg.finalPrice.toLocaleString()}</p>
          ${pkg.offerName ? `<p style="color: #28a745;">Offer: ${pkg.offerName} - ${pkg.offerValue}${pkg.offerType === 'PERCENTAGE' ? '%' : '₹'} off</p>` : ''}
          <a href="${process.env.FRONTEND_ORIGIN}/packages/${pkg._id}" style="text-decoration: none; background: #0d6efd; color: white; padding: 8px 15px; border-radius: 5px;">View Package</a>
        </td>
      </tr>
    `
    )
    .join('');

  return `
  <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #0d6efd; color: white; text-align: center; padding: 15px 0;">
      <h2 style="margin: 0;">🌴 Top Travel Packages This Week</h2>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
      ${packageCards}
    </table>
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif; color: #555;">
      <p>Thanks for being a part of Tripsera ✈️</p>
      <p style="font-size: 12px; color: #888;">You are receiving this email because you subscribed to our newsletter.</p>
    </div>
  </div>
  `;
};

/**
 * Send Top Packages Newsletter Email
 */
export const sendTopPackagesMail = async (to: string, packages: PackageCardDTO[]): Promise<void> => {
  const htmlContent = generateTopPackagesEmailHTML(packages);

  const mailOptions = {
    from: `"Tripsera Travels" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🌟 This Week’s Top Travel Packages from Tripsera!',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Top packages email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send top packages email: ${(error as Error).message}`);
    throw new Error('Failed to send newsletter email');
  }
};
