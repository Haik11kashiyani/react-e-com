import PDFDocument from "pdfkit";

export const renderPdfToBuffer = (drawCallback) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    drawCallback(doc);
    doc.end();
  });
