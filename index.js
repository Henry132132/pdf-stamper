const express = require('express');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const app = express();

// Erlaube, dass PDF (binary) bis 50 MB entgegengenommen werden kann:
app.use(express.raw({ type: 'application/pdf', limit: '50mb' }));

/**
 * POST /stampPDF?text=Kartenanzahl%3A8
 * Body: PDF (binary)
 * Antwort: neue PDF (binary)
 */
app.post('/stampPDF', async (req, res) => {
  try {
    const pdfBytes = req.body;  // Die gesendete PDF
    const text = req.query.text || 'Hello from PDF-Stamper'; // Query-Parameter

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Schrift einbetten
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Den Text unten links auf der Seite platzieren:
    firstPage.drawText(text, {
      x: 50,
      y: 50,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // Neue PDF erzeugen
    const newPdfBytes = await pdfDoc.save();

    // PDF zurückschicken
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(newPdfBytes));
  } catch (error) {
    console.error('Fehler beim PDF-Stempeln:', error);
    res.status(500).json({ error: 'PDF stamping failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`PDF-Stamper listening on port ${port}`);
});
