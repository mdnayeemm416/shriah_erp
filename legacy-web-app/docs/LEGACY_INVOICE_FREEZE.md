# LEGACY INVOICE SYSTEM — FROZEN

Status: **FROZEN (LEGACY)** — do not edit, refactor, rename, optimize, auto-fix, replace, or reuse any file listed below. All current invoice behavior must remain bit-identical. A future invoice system will be built in a brand-new, separate module and will NOT touch anything here.

## Scope of freeze
Everything related to invoice rendering, printing, sharing, exporting, QR, designer, settings, width/DPI, html2canvas/capture, and PDF generation — for ALL paper sizes (58mm, 80mm, 88mm, A4) and ALL templates currently in the project.

---

## A. Frozen files — core invoice library (`src/lib/`)
| File | Role |
|---|---|
| `src/lib/invoice-image.ts` | Invoice payload type + image rendering primitives |
| `src/lib/invoice-print.ts` | Thermal print DOM, iframe print path, capture, error describer |
| `src/lib/invoice-formats.ts` | Format dispatcher (thermal58/thermal88/a4), share/download/print orchestration, `INVOICE_PICKER_EVENT`, `openInvoiceShare` |
| `src/lib/invoice-render-config.ts` | Width / DPI / rendering configuration |
| `src/lib/invoice-designer.ts` | Designer core |
| `src/lib/invoice-designer-88.ts` | 88mm designer logic |
| `src/lib/invoice-designer-sample.ts` | Designer sample data |
| `src/lib/invoice-a4.ts` | A4 HTML/CSS builder, A4 ZATCA QR (TLV+PNG), amount-in-words |
| `src/lib/invoice-a4-render.ts` | A4 PDF/PNG/print/share pipeline, `INVOICE_A4_PICKER_EVENT`, `openA4InvoiceShare` |

## B. Frozen files — components (`src/components/`)
| File | Role |
|---|---|
| `src/components/invoice-share-host.tsx` | Global thermal share/print/download/debug dialog |
| `src/components/invoice-a4-share-host.tsx` | Global A4 share/print/PDF/PNG dialog |
| `src/components/invoice-designer/invoice-designer-panel.tsx` | Designer UI panel |
| `src/components/invoice-designer/thermal88-designer.tsx` | 88mm designer UI |

## C. Frozen integration points (do NOT modify the invoice-related code paths inside these files; other unrelated logic in the same file is not frozen, but anything that calls/imports the invoice system above is)
- `src/routes/__root.tsx` — mounts `<InvoiceShareHost />` and `<InvoiceA4ShareHost />`
- `src/components/pos-sale-details-dialog.tsx` — Thermal + 📄 A4 Tax Invoice buttons, `buildInvoicePayload`, `handleShare`, `handleShareA4`
- `src/components/pos-customer-statement.tsx`
- `src/components/pos-customer-details-dialog.tsx`
- `src/components/pos-customer-add-dialog.tsx`
- `src/components/pos-payment-in-dialog.tsx`
- `src/components/transaction-dialog.tsx`
- `src/components/cf-purchase-smart-form.tsx`
- `src/components/cf-attachment-manager.tsx`
- `src/components/wholesale-report.tsx`, `src/components/wholesale-dashboard.tsx`
- `src/components/employee-share-card.tsx`, `src/components/magic-search-card.tsx`, `src/components/recycle-bin.tsx`, `src/components/sar-amount.tsx`
- `src/routes/_app/settings.tsx` (Invoice Designer entry / invoice settings)
- `src/routes/_app/activity.tsx`, `src/routes/_app/cash-flow.tsx`, `src/routes/_app/overview.tsx`, `src/routes/_app/store-admin.tsx`, `src/routes/_app/backup-center.tsx`

## D. Frozen subsystems (logical, spanning the files above)
- 58mm Receipt · 80mm Receipt · 88mm Receipt
- Thermal Print · Thermal Share · Thermal QR · Thermal PDF · Thermal Image Export · Thermal Receipt Designer
- A4 Invoice · A4 Print · A4 PDF · A4 Share · A4 QR · A4 Layout · A4 Templates · A4 Designer
- Invoice Designer · Invoice Settings · Invoice Templates
- Invoice Rendering Engine · Invoice Export Engine · Invoice Share Engine
- Invoice PDF Generator · Invoice QR Generator · Invoice Width/DPI Settings
- Receipt Capture Logic · html2canvas/html-to-image capture · iframe print logic

## E. Frozen routes
No standalone invoice routes exist — invoice UIs are global modals triggered by:
- `lovable:invoice-share` (thermal) → `InvoiceShareHost`
- `lovable:invoice-a4-share` (A4) → `InvoiceA4ShareHost`

Both event names, both host components, and both dispatch helpers are frozen.

## F. Frozen public APIs / events
- `openInvoiceShare(payload, captionExtra?)`, `INVOICE_PICKER_EVENT`
- `openA4InvoiceShare(payload, captionExtra?)`, `INVOICE_A4_PICKER_EVENT`
- `renderInvoiceImageByFormat`, `renderInvoicePdfA4`, `shareInvoiceWithFormat`, `downloadInvoiceImage`, `downloadInvoicePdf`
- `printThermalReceipt`, `renderPrintedThermalReceiptImage`, `describeThermalExportError`
- `renderA4InvoicePdf`, `renderA4InvoicePng`, `printA4Invoice`, `shareA4Invoice`, `downloadA4InvoicePdf`, `downloadA4InvoicePng`
- `getDefaultInvoiceFormat` / `setDefaultInvoiceFormat` / `getLastInvoiceFormat` / `setLastInvoiceFormat`

## G. Frozen data / DB
No invoice-specific tables are to be altered. ZATCA TLV payload format, customer VAT lookup (`fetchCustomerVatForSale`), and `InvoicePayload` shape are frozen.

---

## Separation

```
LEGACY INVOICE SYSTEM (FROZEN)        FUTURE INVOICE SYSTEM (not yet created)
──────────────────────────────        ───────────────────────────────────────
src/lib/invoice-*.ts                  (will live in a new, separate module —
src/components/invoice-*              e.g. src/lib/invoice-v2/ + src/components/invoice-v2/
src/components/invoice-designer/*      with its own events, hosts, payload type,
+ integration call-sites listed in C   renderer, designer, and DB usage)
```

## Rules going forward
1. Do not edit, refactor, rename, optimize, auto-fix, replace, or reuse anything listed in sections A–F.
2. Do not change current visuals, logic, or DB behavior of any invoice path.
3. The future invoice system must be built in an entirely new module with its own files, its own events, its own dispatcher, its own host components, and its own DB usage. It must not import from the frozen files.
4. If a bug surfaces in the legacy system, report it — do not fix it without an explicit unfreeze instruction from the user.
