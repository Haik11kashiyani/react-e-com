import { renderPdfToBuffer } from "./pdfHelpers.js";

const asMoney = (n) => Number(n || 0).toFixed(2);

export const generateInvoicePdfBuffer = async ({ order }) => {
  return renderPdfToBuffer((doc) => {
    doc.fontSize(18).text("TechOrbit Invoice");
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#555").text(`Invoice #: INV-${String(order._id).slice(-8).toUpperCase()}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);

    doc.moveDown(0.8);
    doc.fillColor("#000").fontSize(12).text("Bill To");
    doc.fontSize(10).text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`);
    doc.text(order.shippingAddress.email);
    doc.text(order.shippingAddress.phone);
    doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.city}`);
    doc.text(`${order.shippingAddress.state} ${order.shippingAddress.zip}, ${order.shippingAddress.country}`);

    doc.moveDown(1);
    doc.fontSize(12).text("Items");
    doc.moveDown(0.3);

    order.items.forEach((item, idx) => {
      const lineTotal = Number(item.price || 0) * Number(item.qty || 0);
      doc.fontSize(10).text(
        `${idx + 1}. ${item.name} | Qty: ${item.qty} | Unit: INR ${asMoney(item.price)} | Total: INR ${asMoney(lineTotal)}`,
      );
    });

    doc.moveDown(0.8);
    doc.fontSize(10).text(`Subtotal: INR ${asMoney(order.subtotal)}`);
    doc.text(`Discount: INR ${asMoney(order.discount)}`);
    doc.text(`Shipping: INR ${asMoney(order.shipping)}`);
    doc.fontSize(12).text(`Grand Total: INR ${asMoney(order.total)}`);

    doc.moveDown(0.8);
    doc.fontSize(10).fillColor("#333").text("Thank you for shopping with TechOrbit.");
  });
};

export const buildInvoiceEmailHtml = ({ order }) => {
  const itemRows = (order.items || [])
    .map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.qty || 0);
      return `<tr><td style="padding:8px;border:1px solid #e5e7eb">${item.name}</td><td style="padding:8px;border:1px solid #e5e7eb">${item.qty}</td><td style="padding:8px;border:1px solid #e5e7eb">INR ${asMoney(item.price)}</td><td style="padding:8px;border:1px solid #e5e7eb">INR ${asMoney(lineTotal)}</td></tr>`;
    })
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;color:#111827">
    <h2>Order Confirmed</h2>
    <p>Your order has been confirmed. Invoice is attached as PDF.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <table style="border-collapse:collapse;width:100%;margin-top:12px">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left">Item</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left">Qty</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left">Price</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left">Line Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <p style="margin-top:12px"><strong>Total:</strong> INR ${asMoney(order.total)}</p>
  </div>
  `;
};
