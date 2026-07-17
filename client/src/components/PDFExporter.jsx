import React from 'react';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import Button from './Button';

const PDFExporter = ({ personal, education, experience, projects, skills }) => {
  const exportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Set page margins & positions
      const margin = 40;
      let yPos = 50;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Custom helper for font drawing
      const addText = (text, x, y, size, style = 'normal', color = [30, 41, 59]) => {
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, x, y);
      };

      const addSeparator = (y) => {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);
      };

      // --- SECTION 1: Personal Header ---
      addText(personal.name || 'Student Name', margin, yPos, 20, 'bold', [15, 23, 42]);
      yPos += 18;

      const contactInfo = [
        personal.email,
        personal.phone,
        personal.location,
        personal.linkedin,
        personal.github
      ].filter(Boolean).join('  |  ');
      
      addText(contactInfo, margin, yPos, 9, 'normal', [100, 116, 139]);
      yPos += 22;
      addSeparator(yPos);
      yPos += 22;

      // --- SECTION 2: Education ---
      if (education && education.length > 0) {
        addText('EDUCATION', margin, yPos, 11, 'bold', [79, 70, 229]);
        yPos += 14;
        
        education.forEach(edu => {
          if (!edu.school) return;
          addText(edu.school, margin, yPos, 9, 'bold', [15, 23, 42]);
          
          if (edu.dates) {
            const dateWidth = doc.getTextWidth(edu.dates);
            addText(edu.dates, pageWidth - margin - dateWidth, yPos, 9, 'normal', [71, 85, 105]);
          }
          yPos += 13;
          
          let subText = edu.degree || '';
          if (edu.gpa) subText += `  •  GPA: ${edu.gpa}`;
          addText(subText, margin, yPos, 9, 'italic', [71, 85, 105]);
          yPos += 18;
        });
        yPos += 8;
      }

      // --- SECTION 3: Experience ---
      if (experience && experience.length > 0) {
        addText('EXPERIENCE', margin, yPos, 11, 'bold', [79, 70, 229]);
        yPos += 14;
        
        experience.forEach(exp => {
          if (!exp.company) return;
          addText(`${exp.company}  —  ${exp.role}`, margin, yPos, 9, 'bold', [15, 23, 42]);
          
          if (exp.dates) {
            const dateWidth = doc.getTextWidth(exp.dates);
            addText(exp.dates, pageWidth - margin - dateWidth, yPos, 9, 'normal', [71, 85, 105]);
          }
          yPos += 13;
          
          if (exp.description) {
            const splitDescription = doc.splitTextToSize(exp.description, pageWidth - 2 * margin - 10);
            splitDescription.forEach(line => {
              addText(line, margin + 10, yPos, 8.5, 'normal', [71, 85, 105]);
              yPos += 12;
            });
          }
          yPos += 15;
        });
        yPos += 8;
      }

      // --- SECTION 4: Projects ---
      if (projects && projects.length > 0) {
        addText('PROJECTS', margin, yPos, 11, 'bold', [79, 70, 229]);
        yPos += 14;
        
        projects.forEach(proj => {
          if (!proj.name) return;
          addText(proj.name, margin, yPos, 9, 'bold', [15, 23, 42]);
          
          if (proj.stack) {
            const stackText = `(${proj.stack})`;
            addText(stackText, margin + doc.getTextWidth(proj.name) + 6, yPos, 8.5, 'normal', [99, 102, 241]);
          }
          yPos += 13;
          
          if (proj.description) {
            const splitDesc = doc.splitTextToSize(proj.description, pageWidth - 2 * margin - 10);
            splitDesc.forEach(line => {
              addText(line, margin + 10, yPos, 8.5, 'normal', [71, 85, 105]);
              yPos += 12;
            });
          }
          yPos += 15;
        });
        yPos += 8;
      }

      // --- SECTION 5: Skills ---
      if (skills) {
        addText('SKILLS', margin, yPos, 11, 'bold', [79, 70, 229]);
        yPos += 14;
        const splitSkills = doc.splitTextToSize(skills, pageWidth - 2 * margin);
        splitSkills.forEach(line => {
          addText(line, margin, yPos, 9, 'normal', [30, 41, 59]);
          yPos += 12;
        });
      }

      doc.save(`${(personal.name || 'resume').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Button variant="primary" size="sm" onClick={exportPDF}>
      <Download className="w-4 h-4" /> Download PDF
    </Button>
  );
};

export default PDFExporter;
