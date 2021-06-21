import jsPDF from "jspdf";
import "jspdf-autotable";

function ExportPDF({ type, column, data, filename }) {
  new jsPDF()
    .autoTable({
      head: [column],
      body: data,
    })
    .save(`${filename}.pdf`);
}

export default ExportPDF;
