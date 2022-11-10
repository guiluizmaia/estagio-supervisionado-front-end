import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import autoTable from 'jspdf-autotable';

export async function exportMultipleChartsToPdf(name: string) {
  const doc = new jsPDF('p', 'px');

  const elements = document.getElementsByClassName('custom-chart');

  await creatPdf({ doc, elements });

  doc.save(`${name}.pdf`);
}

async function creatPdf({
  doc,
  elements,
}: {
  doc: jsPDF;
  elements: HTMLCollectionOf<Element>;
}) {
  const padding = 20;
  const marginTop = 20;
  let top = marginTop;
  // doc.text('With content', 14, 22);

  for (let i = 0; i < elements.length; i++) {
    const el = elements.item(i) as HTMLElement;
    const imgData = await htmlToImage.toPng(el);

    let elHeight = el.offsetHeight;
    let elWidth = el.offsetWidth;

    const pageWidth = doc.internal.pageSize.getWidth();

    if (elWidth > pageWidth) {
      const ratio = pageWidth / elWidth;
      elHeight = elHeight * ratio - padding * 2;
      elWidth = elWidth * ratio - padding * 2;
    }

    const pageHeight = doc.internal.pageSize.getHeight();

    if (top + elHeight > pageHeight) {
      doc.addPage();
      top = marginTop;
    }

    doc.addImage(imgData, 'PNG', padding, top, elWidth, elHeight, `image${i}`);
    top += elHeight + marginTop;
  }

  autoTable(doc, {
    html: '.my-table',
    startY: top + 10,
    headStyles: {
      fillColor: '#04050D',
    },
  });
}
