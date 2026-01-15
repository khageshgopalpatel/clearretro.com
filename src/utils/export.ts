import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { RetroCard, RetroColumn, RetroBoard } from "../types";

// Helper to map column colors to Hex values
const getColumnColor = (colorName: string): string => {
    const colors: Record<string, string> = {
        green: "#16a34a", // green-600
        red: "#dc2626",   // red-600
        blue: "#2563eb",  // blue-600
        yellow: "#ca8a04", // yellow-600
        purple: "#9333ea", // purple-600
        pink: "#db2777",   // pink-600
        indigo: "#4f46e5", // indigo-600
        gray: "#4b5563",    // gray-600
    };
    return colors[colorName] || colors.gray;
};

// Helper to wrap text
const splitText = (doc: jsPDF, text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
};
/**
 * Exports the board to a formatted PDF.
 */
export const exportToPDF = (boardName: string, columns: RetroColumn[], cards: RetroCard[]) => {
    // 1. Initialize jsPDF
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // 2. Constants & Settings
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin; // Current Y cursor

    // Fonts
    doc.setFont("helvetica", "bold");

    // --- Header ---
    doc.setFontSize(24);
    doc.text(boardName, margin, y);
    
    // Date and Brand (Right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const brandText = "Clear Retro Export";
    
    doc.setTextColor(100);
    doc.text(dateStr, pageWidth - margin, y, { align: "right" });
    y += 5;
    doc.text(brandText, pageWidth - margin, y, { align: "right" });
    
    y += 15; // Space after header
    doc.setDrawColor(200);
    doc.line(margin, y - 5, pageWidth - margin, y - 5); // Separator line
    doc.setTextColor(0); // Reset text color

    // --- Content ---

    columns.forEach((col) => {
        // Check for page break needed for title
        if (y + 20 > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        // Column Title
        const colColor = getColumnColor(col.color);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(colColor);
        doc.text(col.title.toUpperCase(), margin, y);
        y += 8;

        // Filter cards for this column
        const colCards = cards.filter((c) => c.columnId === col.id);

        if (colCards.length === 0) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(12);
            doc.setTextColor(150);
            doc.text("(No items)", margin + 5, y);
            y += 15;
            return;
        }

        // Render Cards
        colCards.forEach((card) => {
            const cardX = margin + 2;
            const cardWidth = contentWidth - 4;
            
            // Prepare text
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(0);
            
            const textLines = splitText(doc, card.text, cardWidth - 15); // Padding for text
            const lineHeight = 6;
            const blockHeight = (textLines.length * lineHeight) + 12; // Top/Bottom padding

            // Check Page Break
            if (y + blockHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }

            // Draw Card Background/Border
            doc.setDrawColor(220);
            doc.setFillColor(252, 252, 252);
            doc.roundedRect(cardX, y, cardWidth, blockHeight, 3, 3, "FD");

            // Draw Left Border Indicator (Color coded)
            doc.setFillColor(colColor);
            doc.rect(cardX, y + 1, 1.5, blockHeight - 2, "F");

            // Render Text
            let textY = y + 8;
            textLines.forEach(line => {
                doc.text(line, cardX + 5, textY);
                textY += lineHeight;
            });

            // Render Votes Badge (if any)
            if (card.votes > 0) {
                const badgeText = `+${card.votes}`;
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                const badgeWidth = doc.getTextWidth(badgeText) + 4;
                const badgeX = cardX + cardWidth - badgeWidth - 2;
                const badgeY = y + 2;
                
                // Badge bg
                doc.setFillColor(colColor);
                doc.roundedRect(badgeX, badgeY, badgeWidth, 6, 1, 1, "F");
                
                // Badge text
                doc.setTextColor(255, 255, 255);
                doc.text(badgeText, badgeX + 2, badgeY + 4.5);
            }

            y += blockHeight + 4; // Margin between cards
        });

        y += 10; // Margin between columns
    });

    // Save
    const cleanName = boardName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${cleanName}_retro.pdf`);
};

/**
 * Exports the board to an Excel file.
 */
export const exportToExcel = (boardName: string, columns: RetroColumn[], cards: RetroCard[]) => {
    const data: any[] = [];

    columns.forEach(col => {
        const colCards = cards.filter(c => c.columnId === col.id);
        colCards.forEach(card => {
            data.push({
                Column: col.title,
                Text: card.text,
                Votes: card.votes,
                Author: card.creatorName || 'Anonymous',
                Date: card.createdAt ? new Date(card.createdAt.seconds * 1000).toLocaleDateString() : ''
            });
        });
    });

    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-width for columns
    const wscols = [
        { wch: 20 }, // Column
        { wch: 50 }, // Text
        { wch: 10 }, // Votes
        { wch: 20 }, // Author
        { wch: 15 }  // Date
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retro Board");

    const cleanName = boardName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    XLSX.writeFile(wb, `${cleanName}_retro.xlsx`);
};
