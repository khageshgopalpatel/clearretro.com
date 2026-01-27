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
const BRAND_PRIMARY = "#14b8a6"; // brand-500
const BRAND_SECONDARY = "#2dd4bf"; // brand-400

// Helper to format reactions summary
const formatReactions = (reactions?: Record<string, string[]>, mode: 'pdf' | 'excel' = 'excel'): string => {
    if (!reactions || Object.keys(reactions).length === 0) return "";
    
    // PDF fonts (Helvetica) don't support emojis, so we map them to clean labels
    const emojiMap: Record<string, string> = {
        "👍": "LIKE",
        "+1": "VOTE",
        "❤️": "HEART",
        "😂": "FUN",
        "😮": "WOW",
        "🚀": "ROCKET",
        "🎉": "WIN",
        "👏": "CLAP",
        "🔥": "HOT"
    };

    return Object.entries(reactions)
        .filter(([_, uids]) => uids.length > 0)
        .map(([emoji, uids]) => {
            const label = mode === 'pdf' ? (emojiMap[emoji] || 'REACT') : emoji;
            return `${label} ${uids.length}`;
        })
        .join("  ");
};

/**
 * Exports the board to a formatted PDF with 'Modern Boxy' design + Advanced Insights.
 */
/**
 * Exports the board to a premium 'Modern Boxy' PDF with Advanced Insights.
 */
export const exportToPDF = (boardName: string, columns: RetroColumn[], cards: RetroCard[]) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 15;

    // --- Helper: Footer ---
    const drawFooter = (pageNumber: number) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(150);
        doc.text(`ClearRetro.com — Strategic Report  |  PAGE ${pageNumber}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    };

    // --- Header ---
    doc.setFillColor(BRAND_PRIMARY);
    doc.roundedRect(margin, y, 7, 7, 1.5, 1.5, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("C", margin + 2.2, y + 5);

    doc.setTextColor(40);
    doc.setFontSize(14);
    doc.text(boardName, margin + 10, y + 5.5);

    const dateStr = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(dateStr, pageWidth - margin, y + 5.5, { align: "right" });

    y += 12;

    // --- Bento-Style Engagement Summary ---
    const totalCards = cards.length;
    const actionItemCount = cards.filter(c => c.isActionItem).length;
    const totalVotes = cards.reduce((acc, c) => acc + (c.votes || 0), 0);
    
    // Summary Cards (3 internal blocks)
    const blockWidth = (contentWidth / 3) - 2;
    
    const drawSummaryBlock = (bx: number, by: number, label: string, val: string, iconColor: string) => {
        doc.setFillColor(248, 250, 252); // Slate-50
        doc.roundedRect(bx, by, blockWidth, 12, 1, 1, "F");
        
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(148, 163, 184);
        doc.text(label.toUpperCase(), bx + 3, by + 4);
        
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(val, bx + 3, by + 9);

        doc.setFillColor(iconColor);
        doc.circle(bx + blockWidth - 3, by + 3, 0.8, "F");
    };

    drawSummaryBlock(margin, y, "Thoughts", totalCards.toString(), BRAND_PRIMARY);
    drawSummaryBlock(margin + blockWidth + 3, y, "Action Items", actionItemCount.toString(), "#f43f5e");
    drawSummaryBlock(margin + (blockWidth + 3) * 2, y, "Activity", `${totalVotes} Votes`, "#d97706"); // Amber-600

    y += 16;

    // Sentiment Pulse Bar
    const positiveCols = columns.filter(c => ['green', 'blue', 'pink'].includes(c.color)).length;
    const pulseScore = Math.round((positiveCols / columns.length) * 100);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120);
    doc.text("TEAM SENTIMENT PULSE", margin, y);
    
    const scaleWidth = 40;
    const scaleX = margin + 35;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(scaleX, y - 2, scaleWidth, 2.5, 1, 1, "F");
    doc.setFillColor(BRAND_PRIMARY);
    doc.roundedRect(scaleX, y - 2, (pulseScore / 100) * scaleWidth, 2.5, 1, 1, "F");
    
    doc.setTextColor(BRAND_PRIMARY);
    doc.text(`${pulseScore}% OPTIMISTIC`, scaleX + scaleWidth + 4, y);

    y += 10;

    y += 10;

    // --- Grouped Boxy Columns ---
    columns.forEach((col) => {
        const colCards = cards.filter((c) => c.columnId === col.id && !c.isActionItem);
        if (colCards.length === 0) return;

        const isKudos = col.title.toLowerCase().includes('kudos') || col.title.toLowerCase().includes('shout');
        const colColor = isKudos ? "#ca8a04" : getColumnColor(col.color);

        if (y + 15 > pageHeight - 15) {
            doc.addPage();
            y = margin;
        }

        const headerHeight = 8;
        doc.setFillColor(colColor);
        doc.roundedRect(margin, y, contentWidth, headerHeight, 2, 2, "F");
        doc.rect(margin, y + 4, contentWidth, 4, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255);
        const prefix = isKudos ? "KUDOS: " : "";
        doc.text(prefix + col.title.toUpperCase(), margin + 4, y + 5.5);
        y += headerHeight;

        const boxStartY = y;
        colCards.forEach((card, index) => {
            const lines = splitText(doc, card.text, contentWidth - 15);
            const reactionText = formatReactions(card.reactions, 'pdf');
            const itemHeight = (lines.length * 4.5) + (reactionText ? 7 : 3);

            if (y + itemHeight > pageHeight - 15) {
                doc.setDrawColor(colColor);
                doc.line(margin, boxStartY, margin, y);
                doc.line(pageWidth - margin, boxStartY, pageWidth - margin, y);
                doc.line(margin, y, pageWidth - margin, y);
                doc.addPage();
                y = margin;
                doc.setFillColor(colColor);
                doc.roundedRect(margin, y, contentWidth, 6, 1, 1, "F");
                y += 6;
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(50);
            let textY = y + 4;
            lines.forEach(line => {
                doc.text(line, margin + 4, textY);
                textY += 4.5;
            });

            if (reactionText) {
                doc.setFontSize(7);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(140);
                doc.text(reactionText, margin + 4, textY - 1);
            }

            if (card.votes > 0) {
                const voteText = `+${card.votes}`;
                doc.setFontSize(7);
                doc.setFont("helvetica", "bold");
                const badgeWidth = doc.getTextWidth(voteText) + 3;
                doc.setFillColor(colColor);
                doc.roundedRect(pageWidth - margin - badgeWidth - 3, y + (itemHeight / 2) - 2.5, badgeWidth, 5, 1, 1, "F");
                doc.setTextColor(255);
                doc.text(voteText, pageWidth - margin - badgeWidth - 1.5, y + (itemHeight / 2) + 1.2);
            }

            y += itemHeight;
            if (index < colCards.length - 1) {
                doc.setDrawColor(240);
                doc.line(margin + 2, y, pageWidth - margin - 2, y);
            }
        });

        doc.setDrawColor(colColor); 
        doc.line(margin, boxStartY, margin, y);
        doc.line(pageWidth - margin, boxStartY, pageWidth - margin, y);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
    });

    // --- Action Items (Boxy) ---
    const actionItems = cards.filter(item => item.isActionItem);
    if (actionItems.length > 0) {
        if (y + 15 > pageHeight - 15) {
            doc.addPage();
            y = margin;
        }

        const taskColor = "#2563eb";
        doc.setFillColor(taskColor);
        doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
        doc.rect(margin, y + 4, contentWidth, 4, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255);
        doc.text("ACTION ITEMS & COMMITMENTS", margin + 4, y + 5.5);
        y += 8;

        const boxStartY = y;
        actionItems.forEach((item, index) => {
            const textLines = splitText(doc, item.text, contentWidth - 30);
            const statusLabel = (item.isDone || item.status === 'done') ? "DONE" : "TODO";
            const metaInfo = [
                item.assigneeName ? `@${item.assigneeName}` : null,
                item.dueDate ? `DUE ${new Date(item.dueDate).toLocaleDateString()}` : null
            ].filter(Boolean).join("  |  ");
            const itemHeight = (textLines.length * 4.5) + (metaInfo ? 6 : 4);

            if (y + itemHeight > pageHeight - 15) {
                doc.setDrawColor(taskColor);
                doc.line(margin, boxStartY, margin, y);
                doc.line(pageWidth - margin, boxStartY, pageWidth - margin, y);
                doc.line(margin, y, pageWidth - margin, y);
                doc.addPage();
                y = margin;
                doc.setFillColor(taskColor);
                doc.rect(margin, y, contentWidth, 5, "F");
                y += 5;
            }

            doc.setDrawColor(180);
            doc.rect(margin + 4, y + 1.5, 3, 3, "S");
            if (item.isDone) {
                doc.setFillColor(taskColor);
                doc.rect(margin + 4.3, y + 1.8, 2.4, 2.4, "F");
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(20);
            let textY = y + 4;
            textLines.forEach(line => { doc.text(line, margin + 9, textY); textY += 4.5; });

            if (metaInfo) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(6.5);
                doc.setTextColor(140);
                doc.text(metaInfo, margin + 9, textY - 1);
            }

            const sBadgeWidth = doc.getTextWidth(statusLabel) + 3;
            doc.setFillColor(item.isDone ? 220 : 230, 240, 255);
            doc.roundedRect(pageWidth - margin - sBadgeWidth - 3, y + 2, sBadgeWidth, 4, 1, 1, "F");
            doc.setTextColor(item.isDone ? 30 : 50, 80, 200);
            doc.setFontSize(5.5);
            doc.text(statusLabel, pageWidth - margin - sBadgeWidth - 1.5, y + 4.8);

            y += itemHeight;
            if (index < actionItems.length - 1) {
                doc.setDrawColor(240);
                doc.line(margin + 2, y, pageWidth - margin - 2, y);
            }
        });

        doc.setDrawColor(taskColor);
        doc.line(margin, boxStartY, margin, y);
        doc.line(pageWidth - margin, boxStartY, pageWidth - margin, y);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    }

    // --- Top Voted Highlights Box (Moved to Bottom) ---
    const topVoted = [...cards].sort((a, b) => b.votes - a.votes).slice(0, 3).filter(c => c.votes > 0);
    if (topVoted.length > 0) {
        const boxHeight = (topVoted.length * 8) + 10;
        
        if (y + boxHeight > pageHeight - 20) {
            doc.addPage();
            y = margin;
        }

        doc.setFillColor(240, 249, 255);
        doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(2, 132, 199);
        doc.text("HIGHLIGHTS: KEY RETRO MOMENTS", margin + 4, y + 6);
        y += 11;

        topVoted.forEach((card) => {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.setTextColor(30, 58, 138);
            const textLines = splitText(doc, `"${card.text}"`, contentWidth - 25);
            textLines.forEach(line => {
                doc.text(line, margin + 8, y);
                y += 4;
            });
            doc.setFont("helvetica", "bold");
            doc.setFontSize(6);
            doc.text(`${card.votes} VOTES`, margin + 8, y);
            y += 4;
        });
        y += 6;
    }

    // --- Footer Overlay ---
    const pageCount = (doc.internal as any).pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawFooter(i);
        
        doc.setDrawColor(240);
        doc.roundedRect(pageWidth - margin - 12, pageHeight - 22, 10, 10, 1, 1, "S");
        doc.setFontSize(4);
        doc.setTextColor(200);
        doc.text("SCAN BOARD", pageWidth - margin - 12, pageHeight - 11);
    }

    const cleanName = boardName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${cleanName}_retro.pdf`);
};
/**
 * Exports the board to an Excel file.
 */
export const exportToExcel = (boardName: string, columns: RetroColumn[], cards: RetroCard[]) => {
    const data: any[] = [];

    columns.forEach(col => {
        const colCards = cards.filter(c => c.columnId === col.id && !c.isActionItem);
        colCards.forEach(card => {
            data.push({
                Column: col.title,
                Text: card.text,
                Votes: card.votes,
                Reactions: formatReactions(card.reactions),
                Author: card.creatorName || 'Anonymous',
                Date: card.createdAt ? (typeof card.createdAt.toDate === 'function' ? card.createdAt.toDate().toLocaleDateString() : new Date(card.createdAt).toLocaleDateString()) : ''
            });
        });
    });

    const actionItems = cards.filter(c => c.isActionItem);
    const actionData = actionItems.map(item => ({
        Task: item.text,
        Assignee: item.assigneeName || 'Unassigned',
        Priority: item.priority || 'Medium',
        Status: item.status || (item.isDone ? 'Done' : 'Todo'),
        DueDate: item.dueDate || '',
        Author: item.creatorName || 'Anonymous'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-width for columns
    const wscols = [
        { wch: 20 }, // Column
        { wch: 50 }, // Text
        { wch: 10 }, // Votes
        { wch: 15 }, // Reactions
        { wch: 20 }, // Author
        { wch: 15 }  // Date
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retro Board");

    if (actionData.length > 0) {
        const aws = XLSX.utils.json_to_sheet(actionData);
        aws["!cols"] = [
            { wch: 50 }, // Task
            { wch: 20 }, // Assignee
            { wch: 15 }, // Priority
            { wch: 15 }, // Status
            { wch: 15 }, // DueDate
            { wch: 20 }  // Author
        ];
        XLSX.utils.book_append_sheet(wb, aws, "Action Items");
    }

    const cleanName = boardName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    XLSX.writeFile(wb, `${cleanName}_retro.xlsx`);
};
