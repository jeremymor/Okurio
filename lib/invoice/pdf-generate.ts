import type { Invoice } from "./types";

export async function generatePdf(invoice: Invoice): Promise<void> {
  const { pdf } = await import("@react-pdf/renderer");
  const { InvoicePdf } = await import(
    "@/components/invoice/invoice-pdf"
  );
  const { createElement } = await import("react");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(InvoicePdf, { invoice }) as any;
  const blob = await pdf(element).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoice.invoiceNumber || "invoice"}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
