"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { Invoice } from "@/lib/invoice/types";
import { calculateTotal } from "@/lib/invoice/calculations";
import { formatCurrency, formatDate } from "@/lib/invoice/format";

const colors = {
  invoiceLight: "rgba(0, 25, 59, 0.4)",
  invoiceDark: "rgba(0, 25, 59, 0.85)",
  invoiceBorder: "rgba(0, 25, 59, 0.08)",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.invoiceDark,
    backgroundColor: "#FFFFFF",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.invoiceBorder,
    paddingHorizontal: 32,
    paddingVertical: 16,
    height: 56,
  },
  headerLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.invoiceLight,
  },
  headerValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  headerRight: {
    flexDirection: "row",
    gap: 24,
  },
  // FROM / TO
  fromTo: {
    flexDirection: "row",
  },
  fromToCol: {
    flex: 1,
    padding: 32,
    paddingVertical: 24,
  },
  fromToDivider: {
    width: 1,
    backgroundColor: colors.invoiceBorder,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.invoiceLight,
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  companyName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 9,
    color: colors.invoiceLight,
    marginBottom: 3,
  },
  // Line items
  itemsSection: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexGrow: 1,
  },
  itemHeader: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.invoiceBorder,
    paddingVertical: 12,
    minHeight: 40,
    alignItems: "center",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right" },
  itemHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.invoiceLight,
  },
  itemText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  // Summary
  summary: {
    paddingHorizontal: 32,
    paddingBottom: 16,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 9,
    color: colors.invoiceLight,
  },
  summaryValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.invoiceBorder,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  totalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  // Payment footer
  paymentFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.invoiceBorder,
    minHeight: 120,
  },
  paymentCol: {
    flex: 1,
    padding: 32,
    paddingVertical: 24,
  },
  paymentDivider: {
    width: 1,
    backgroundColor: colors.invoiceBorder,
  },
});

interface InvoicePdfProps {
  invoice: Invoice;
}

function CompanyBlockPdf({ label, company }: { label: string; company: Invoice["from"] }) {
  return (
    <View style={styles.fromToCol}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {company.logo && (
        <Image src={company.logo} style={styles.logo} />
      )}
      {company.name ? (
        <View>
          <Text style={styles.companyName}>{company.name}</Text>
          {company.email && <Text style={styles.companyDetail}>{company.email}</Text>}
          {company.address.street && <Text style={styles.companyDetail}>{company.address.street}</Text>}
          {(company.address.city || company.address.state) && (
            <Text style={styles.companyDetail}>
              {[company.address.city, company.address.state].filter(Boolean).join(", ")}
            </Text>
          )}
          {(company.address.zip || company.address.country) && (
            <Text style={styles.companyDetail}>
              {[company.address.zip, company.address.country].filter(Boolean).join(", ")}
            </Text>
          )}
          {company.taxId && <Text style={styles.companyDetail}>VAT: {company.taxId}</Text>}
        </View>
      ) : null}
    </View>
  );
}

export function InvoicePdf({ invoice }: InvoicePdfProps) {
  const { subtotal, discountAmount, taxAmount, total } = calculateTotal(
    invoice.items,
    invoice.discountRate,
    invoice.taxRate
  );
  const c = invoice.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Invoice No</Text>
            <Text style={styles.headerValue}>{invoice.invoiceNumber || "INV-001"}</Text>
          </View>
          <View style={styles.headerRight}>
            <View>
              <Text style={styles.headerLabel}>Issued</Text>
              <Text style={styles.headerValue}>{formatDate(invoice.issuedDate) || "—"}</Text>
            </View>
            <View>
              <Text style={styles.headerLabel}>Due Date</Text>
              <Text style={styles.headerValue}>{formatDate(invoice.dueDate) || "—"}</Text>
            </View>
          </View>
        </View>

        {/* FROM / TO */}
        <View style={styles.fromTo}>
          <CompanyBlockPdf label="FROM" company={invoice.from} />
          <View style={styles.fromToDivider} />
          <CompanyBlockPdf label="TO" company={invoice.to} />
        </View>

        {/* Line Items */}
        <View style={styles.itemsSection}>
          <View style={styles.itemHeader}>
            <View style={styles.colDesc}>
              <Text style={styles.itemHeaderText}>Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.itemHeaderText}>Qty</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={[styles.itemHeaderText, { textAlign: "right" }]}>Price</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.itemHeaderText, { textAlign: "right" }]}>Amount</Text>
            </View>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.colDesc}>
                <Text style={styles.itemText}>{item.description || "—"}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={[styles.itemText, { textAlign: "center" }]}>{item.quantity || 0}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={[styles.itemText, { textAlign: "right" }]}>
                  {formatCurrency(item.price || 0, c)}
                </Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={[styles.itemText, { textAlign: "right" }]}>
                  {formatCurrency((item.quantity || 0) * (item.price || 0), c)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal, c)}</Text>
          </View>
          {invoice.discountRate > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount ({invoice.discountRate}%)</Text>
              <Text style={styles.summaryValue}>-{formatCurrency(discountAmount, c)}</Text>
            </View>
          )}
          {invoice.taxRate > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT ({invoice.taxRate}%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(taxAmount, c)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total, c)}</Text>
          </View>
        </View>

        {/* Payment Footer */}
        <View style={styles.paymentFooter}>
          <View style={styles.paymentCol}>
            <Text style={styles.sectionLabel}>Payment Details</Text>
            {invoice.payment.bankName && (
              <Text style={styles.companyName}>{invoice.payment.bankName}</Text>
            )}
            {invoice.payment.accountName && (
              <Text style={styles.companyDetail}>{invoice.payment.accountName}</Text>
            )}
            {invoice.payment.accountNumber && (
              <Text style={styles.companyDetail}>Acc: {invoice.payment.accountNumber}</Text>
            )}
            {invoice.payment.sortCode && (
              <Text style={styles.companyDetail}>Sort: {invoice.payment.sortCode}</Text>
            )}
          </View>
          <View style={styles.paymentDivider} />
          <View style={styles.paymentCol}>
            <Text style={styles.sectionLabel}>Instructions</Text>
            {invoice.payment.iban && (
              <Text style={styles.companyDetail}>IBAN: {invoice.payment.iban}</Text>
            )}
            {invoice.payment.swift && (
              <Text style={styles.companyDetail}>SWIFT: {invoice.payment.swift}</Text>
            )}
            {invoice.payment.instructions && (
              <Text style={styles.companyDetail}>{invoice.payment.instructions}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
