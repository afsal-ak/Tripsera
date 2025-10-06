
import puppeteer from 'puppeteer';
import { IBooking } from '@domain/entities/IBooking';

export async function generateBookingInvoice(
  booking: IBooking,
  invoiceCode: string
): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const companyName = "Tripsera Travels";
  const companyContact = "123 Main Street, Kochi, Kerala | +91-9876543210 | support@Tripsera.com";

  const cancelledWatermark =
    booking.bookingStatus === 'cancelled'
      ? `<div class="watermark">CANCELLED</div>`
      : '';

  const html = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 30px;
          color: #333;
          background: #f9f9f9;
          position: relative;
        }
        h1, h2, h3 {
          margin: 5px 0;
          font-weight: 600;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #007BFF;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .company-details {
          text-align: right;
          font-size: 14px;
        }
        .section {
          margin-bottom: 25px;
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px 12px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #007BFF;
          color: #fff;
        }
        tr:nth-child(even) {
          background-color: #f2f6fc;
        }
        .footer {
          font-size: 12px;
          color: #555;
          margin-top: 40px;
        }
        .amount {
          font-size: 16px;
          font-weight: bold;
          color: #007BFF;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 80px;
          font-weight: bold;
          color: rgba(255, 0, 0, 0.15);
          z-index: -1;
          white-space: nowrap;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      ${cancelledWatermark}

      <div class="header">
        <div>
          <h2>${companyName}</h2>
          <div style="font-size:14px">${companyContact}</div>
        </div>
        <div style="text-align:right">
          <h1 style="color:#007BFF;">Invoice</h1>
          <div><strong>Invoice No:</strong> ${invoiceCode}</div>
        </div>
      </div>

      <div class="section">
        <h3>Booking Details</h3>
        <p><strong>Booking Code:</strong> ${booking.bookingCode}</p>
        <p><strong>Package Code:</strong> ${(booking.packageId as any)?.packageCode || ''}</p>
        <p><strong>Package:</strong> ${(booking.packageId as any)?.title || ''}</p>
        <p><strong>Travel Date:</strong> ${formatDate(booking.travelDate)}</p>
        <p><strong>Booking Date:</strong> ${formatDate(booking.bookedAt)}</p>
      </div>

      <div class="section">
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${(booking.userId as any)?.username || ''}</p>
        <p><strong>Email:</strong> ${(booking.userId as any)?.email || ''}</p>
        <p><strong>Phone:</strong> ${booking.contactDetails?.phone || ''}</p>
      </div>

      <div class="section">
        <h3>Traveler Details</h3>
        <table>
          <tr>
            <th>Full Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
          ${booking.travelers
            .map(
              t => `
              <tr>
                <td>${t.fullName}</td>
                <td>${t.age}</td>
                <td>${t.gender || ''}</td>
              </tr>`
            )
            .join('')}
        </table>
      </div>

      <div class="section">
        <h3>Payment Summary</h3>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
        <p class="amount">Amount Paid: ₹${booking.amountPaid}</p>
        ${booking.walletUsed ? `<p><strong>Wallet Used:</strong> ₹${booking.walletUsed}</p>` : ''}
        ${booking.couponCode ? `<p><strong>Coupon Applied:</strong> ${booking.couponCode} (₹${booking.discount})</p>` : ''}
      </div>

      <div class="footer">
        <h4>Terms & Conditions</h4>
        <ul>
          <li>All bookings are subject to availability.</li>
          <li>Cancellation charges may apply as per our policy.</li>
          <li>Carry a valid ID proof during travel.</li>
          <li>Company is not responsible for delays due to unforeseen events.</li>
        </ul>
        <p>Thank you for booking with ${companyName}!</p>
      </div>
    </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

   const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
  await browser.close();

  return pdfBuffer;
}

function formatDate(date?: Date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}
