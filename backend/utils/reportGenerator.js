import XLSX from "xlsx";
import { renderPdfToBuffer } from "./pdfHelpers.js";

const fmt = (n) => Number(n || 0).toFixed(2);

export const buildMonthlyReportRows = ({ orders }) =>
  orders.map((o, idx) => ({
    SrNo: idx + 1,
    OrderId: String(o._id),
    Date: new Date(o.createdAt).toISOString().slice(0, 10),
    CustomerName: `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim(),
    CustomerEmail: o.user?.email || "",
    Items: o.items?.reduce((s, i) => s + Number(i.qty || 0), 0) || 0,
    Subtotal: fmt(o.subtotal),
    Discount: fmt(o.discount),
    Shipping: fmt(o.shipping),
    Total: fmt(o.total),
    Status: o.status,
  }));

export const buildMonthlyReportSummary = ({ orders }) => {
  const summary = {
    totalOrders: orders.length,
    grossRevenue: 0,
    totalDiscount: 0,
    shippingCollected: 0,
    netRevenue: 0,
    cancelledOrders: 0,
  };

  for (const order of orders) {
    summary.grossRevenue += Number(order.subtotal || 0);
    summary.totalDiscount += Number(order.discount || 0);
    summary.shippingCollected += Number(order.shipping || 0);
    summary.netRevenue += Number(order.total || 0);
    if (order.status === "cancelled") summary.cancelledOrders += 1;
  }

  return {
    ...summary,
    grossRevenue: Number(summary.grossRevenue.toFixed(2)),
    totalDiscount: Number(summary.totalDiscount.toFixed(2)),
    shippingCollected: Number(summary.shippingCollected.toFixed(2)),
    netRevenue: Number(summary.netRevenue.toFixed(2)),
  };
};

export const generateMonthlyReportExcel = ({ monthLabel, rows, summary }) => {
  const wb = XLSX.utils.book_new();
  const wsRows = [
    { Metric: "Month", Value: monthLabel },
    { Metric: "Total Orders", Value: summary.totalOrders },
    { Metric: "Gross Revenue", Value: summary.grossRevenue },
    { Metric: "Total Discount", Value: summary.totalDiscount },
    { Metric: "Shipping Collected", Value: summary.shippingCollected },
    { Metric: "Net Revenue", Value: summary.netRevenue },
    { Metric: "Cancelled Orders", Value: summary.cancelledOrders },
    {},
  ];

  const summarySheet = XLSX.utils.json_to_sheet(wsRows);
  const ordersSheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(wb, ordersSheet, "Orders");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
};

export const generateMonthlyReportPdf = async ({ monthLabel, rows, summary }) => {
  return renderPdfToBuffer((doc) => {
    doc.fontSize(18).text("TechOrbit Monthly Report", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor("#555").text(`Month: ${monthLabel}`);
    doc.moveDown(1);

    doc.fillColor("#000").fontSize(12).text(`Total Orders: ${summary.totalOrders}`);
    doc.text(`Gross Revenue: INR ${fmt(summary.grossRevenue)}`);
    doc.text(`Total Discount: INR ${fmt(summary.totalDiscount)}`);
    doc.text(`Shipping Collected: INR ${fmt(summary.shippingCollected)}`);
    doc.text(`Net Revenue: INR ${fmt(summary.netRevenue)}`);
    doc.text(`Cancelled Orders: ${summary.cancelledOrders}`);

    doc.moveDown(1);
    doc.fontSize(13).text("Order Snapshot", { underline: true });
    doc.moveDown(0.4);

    const previewRows = rows.slice(0, 25);
    previewRows.forEach((r) => {
      doc.fontSize(9).text(
        `${r.SrNo}. ${String(r.OrderId).slice(-8)} | ${r.Date} | ${r.CustomerName || "N/A"} | INR ${r.Total} | ${r.Status}`,
      );
    });

    if (rows.length > previewRows.length) {
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#555").text(`...and ${rows.length - previewRows.length} more orders in the month.`);
    }
  });
};
