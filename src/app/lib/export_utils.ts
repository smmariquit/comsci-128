import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BRAND = {
  navy: [28, 38, 50] as [number, number, number],
  teal: [86, 115, 117] as [number, number, number],
  orange: [201, 100, 42] as [number, number, number],
  cream: [234, 232, 225] as [number, number, number],
  softText: [110, 144, 146] as [number, number, number],
};

type ExportCell = string | number | boolean | Date | null | undefined;

function addDesignSystemHeader(doc: jsPDF, title: string, subtitle?: string) {
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("University Student Accommodation Tracker", 14, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND.cream);
  doc.text(title, 14, 20);

  if (subtitle) {
    doc.setFontSize(9);
    doc.text(subtitle, 14, 25);
  }

  doc.setDrawColor(...BRAND.orange);
  doc.setLineWidth(1);
  doc.line(14, 31, 196, 31);
}

function addDesignSystemFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...BRAND.cream);
  doc.setLineWidth(0.4);
  doc.line(14, pageHeight - 16, 196, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.softText);
  doc.text(
    "Generated from the design system export format",
    14,
    pageHeight - 10,
  );
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    196,
    pageHeight - 10,
    { align: "right" },
  );
}

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: ExportCell[][],
) {
  const escapeCsv = (val: ExportCell) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(
  title: string,
  filename: string,
  headers: string[],
  rows: any[][],
) {
  const doc = new jsPDF();

  addDesignSystemHeader(doc, title, "Report export");

  autoTable(doc, {
    startY: 38,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: BRAND.teal, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 249, 245] },
    styles: { fontSize: 8, cellPadding: 3, textColor: BRAND.navy },
    tableLineColor: BRAND.cream,
    tableLineWidth: 0.2,
  });

  addDesignSystemFooter(doc);

  doc.save(`${filename}.pdf`);
}

export function exportDocumentToPDF(
  title: string,
  filename: string,
  studentName: string,
  contentLines: string[],
) {
  const doc = new jsPDF();

  addDesignSystemHeader(doc, title, "Official document export");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.softText);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 40);
  doc.text(`Recipient: ${studentName}`, 14, 46);

  doc.setDrawColor(...BRAND.cream);
  doc.setLineWidth(0.2);
  doc.line(14, 51, 196, 51);

  doc.setTextColor(...BRAND.navy);
  doc.setFontSize(11);
  let y = 60;
  contentLines.forEach((line) => {
    const splitText = doc.splitTextToSize(line, 180);
    doc.text(splitText, 14, y);
    y += splitText.length * 6;
  });

  addDesignSystemFooter(doc);

  doc.save(`${filename}.pdf`);
}
