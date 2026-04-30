import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(filename: string, headers: string[], rows: any[][]) {
  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCsv).join(","),
    ...rows.map(row => row.map(escapeCsv).join(","))
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

export function exportToPDF(title: string, filename: string, headers: string[], rows: any[][]) {
  const doc = new jsPDF();
  
  // Add university logo and official headers if needed here.
  // For now, text header.
  doc.setFontSize(16);
  doc.text("University Student Accommodation Tracker", 14, 15);
  doc.setFontSize(12);
  doc.text(title, 14, 23);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 29);

  // Add a watermark
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(50);
  doc.text("OFFICIAL REPORT", 35, 150, { angle: 45 });
  
  autoTable(doc, {
    startY: 35,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [86, 115, 117] }, // C.teal color
    styles: { fontSize: 8, cellPadding: 3 },
  });

  doc.save(`${filename}.pdf`);
}

export function exportDocumentToPDF(title: string, filename: string, studentName: string, contentLines: string[]) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text("University Student Accommodation Tracker", 14, 20);
  doc.setFontSize(14);
  doc.text(title, 14, 30);
  
  // Meta
  doc.setFontSize(10);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 40);
  doc.text(`Student: ${studentName}`, 14, 46);
  
  // Watermark
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(50);
  doc.text("OFFICIAL DOCUMENT", 35, 150, { angle: 45 });
  
  // Content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  let y = 60;
  contentLines.forEach(line => {
    // Basic text wrapping
    const splitText = doc.splitTextToSize(line, 180);
    doc.text(splitText, 14, y);
    y += (splitText.length * 6);
  });
  
  doc.save(`${filename}.pdf`);
}
