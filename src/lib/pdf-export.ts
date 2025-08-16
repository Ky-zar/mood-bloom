import jsPDF from 'jspdf';
import type { MoodEntry } from '@/types';
import { format } from 'date-fns';

export function exportMoodsToPDF(entries: MoodEntry[]) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text('Mood Bloom - Mood History', 10, 20);

  doc.setFontSize(12);
  doc.text(`Report generated on: ${format(new Date(), 'PPP p')}`, 10, 30);

  let y = 40;

  if (entries.length === 0) {
    doc.text('No mood entries to report.', 10, y);
  } else {
    entries.forEach((entry, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      const entryDate = new Date(entry.date);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`${format(entryDate, 'PPPP')} - Mood: ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}`, 10, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      if (entry.notes) {
        const notesLines = doc.splitTextToSize(`Notes: ${entry.notes}`, 180);
        doc.text(notesLines, 15, y);
        y += notesLines.length * 5;
      }

      if (entry.tags && entry.tags.length > 0) {
        doc.text(`Tags: ${entry.tags.join(', ')}`, 15, y);
        y += 8;
      }
      
      y += 5;
      if(index < entries.length -1) {
          doc.line(10, y, 200, y); // separator line
          y += 8;
      }

    });
  }


  doc.save('mood-bloom-history.pdf');
}
