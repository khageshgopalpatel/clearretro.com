import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { RetroCard, RetroColumn } from "../types";

export const exportToPDF = (boardName: string, columns: RetroColumn[], cards: RetroCard[]) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(boardName, 10, 10);
    doc.setFontSize(12);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 10, 20);

    let y = 30;

    columns.forEach(col => {
        doc.setFontSize(16);
        doc.setTextColor(col.color === 'green' ? '#16a34a' : col.color === 'red' ? '#dc2626' : '#2563eb');
        doc.text(col.title, 10, y);
        y += 10;

        const colCards = cards.filter(c => c.columnId === col.id);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        if (colCards.length === 0) {
            doc.text("- No items", 15, y);
            y += 10;
        }

        colCards.forEach(card => {
            const text = `- ${card.text} (${card.votes} votes)`;
            const splitText = doc.splitTextToSize(text, 180);
            doc.text(splitText, 15, y);
            y += (splitText.length * 7);

            if (y > 280) {
                doc.addPage();
                y = 10;
            }
        });

        y += 10;
    });

    doc.save(`${boardName.replace(/\s+/g, '_')}.pdf`);
};

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
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retro Board");

    XLSX.writeFile(wb, `${boardName.replace(/\s+/g, '_')}.xlsx`);
};
