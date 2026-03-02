const SPREADSHEET_ID = "11IQpitHKfNSx4dZSk9mcIOjOKVCknE3GrR0anNuezFc";
const SHEET_NAME = "Form Responses 1";
const faviconUrl =
  "https://lh3.googleusercontent.com/u/0/d/1bZv51GB9pJ5S4kfTsP8wj0bMT5J4GV4a#.png";

function doGet(e) {
  const rowId = e.parameter.rowId;

  const sheet =
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const lastCol = sheet.getLastColumn();
  const values = sheet
    .getRange(Number(rowId), 2, 1, lastCol - 1)
    .getValues()[0];

  const [
    emailAddress,
    employeeName,
    department,
    designation,
    destination,
    departureDate,
    returnDate,
    travelCategory,
    businessJustification,
    modeOfTransport,
    perDiemPolicy,
    estimatedCost,
    costCentre,
    withinBudget,
    approvalTier,
    hodApprover,
    hodEmail,
    hodComments,
    hrApprover,
    hrEmail,
    hrComments,
    directorApprover,
    directorEmail,
    directorComments,
    hodApprovalStatus,
    hrApprovalStatus,
    directorApprovalStatus,
  ] = values;

  const formattedDepartureDate = dateFormatter(departureDate);
  const formattedReturnDate = dateFormatter(returnDate);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Travel Requisition — ${employeeName}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            background-color: #F4F4F4; 
            padding: 40px 20px; 
            color: #333333;
          }

          .wrapper { max-width: 680px; margin: 0 auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

          /* Header */
          .header {
            background: linear-gradient(135deg, #C8102E 0%, #1A1A1A 80%);
            border-radius: 8px 8px 0 0;
            padding: 40px 36px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header .bubble1 { position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.1); }
          .header .bubble2 { position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(0,0,0,0.2); }
          .header .brand { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #FFFFFF; opacity: 0.8; margin-bottom: 8px; }
          .header h1 { font-size: 26px; font-weight: 600; color: #FFFFFF; letter-spacing: 0.5px; }
          .header .divider { margin: 18px auto 0; width: 50px; height: 3px; background-color: #C8102E; }

          /* Body */
          .body { background: #FFFFFF; padding: 36px; border-left: 1px solid #E0E0E0; border-right: 1px solid #E0E0E0; }

          /* Section label */
          .section-label { font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #C8102E; margin: 0 0 15px; border-bottom: 2px solid #E0E0E0; padding-bottom: 8px; }

          /* Tables */
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 35px; }
          .approval-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #E0E0E0; }
          td { padding: 12px 15px; border-bottom: 1px solid #E0E0E0; font-size: 14px; }
          td.label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #757575; width: 35%; }
          td.alt { background-color: #FAFAFA; }
          td.no-border { border-bottom: none; }
          
          /* Strong values */
          td.val { font-weight: 600; color: #1A1A1A; }

          /* Badge */
          .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
          .badge.pending { color: #d97706; background: #fffbeb; }
          .badge.approved { color: #166534; background: #dcfce7; }
          .badge.declined { color: #991b1b; background: #fee2e2; }

          /* Comment */
          .comment { font-size: 14px; font-style: italic; color: #757575; }

          /* Group header */
          .group-header td { padding: 10px 15px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF; background-color: #1A1A1A; border-bottom: none; }

          /* Cost */
          .cost-row td { background-color: #C8102E; color: #FFFFFF; border-bottom: none; }
          .cost-label { color: #FFFFFF !important; font-weight: 700; }
          .cost-val { font-size: 18px; font-weight: 700; color: #FFFFFF !important; }

          /* Download button */
          .btn-wrap { display: flex; justify-content: flex-end; margin-bottom: 20px; }
          .btn { display: inline-block; background-color: #1A1A1A; color: #FFFFFF; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border: none; transition: background-color 0.2s;}
          .btn:hover { background-color: #333333; }

          /* Footer */
          .footer { background: #1A1A1A; border-radius: 0 0 8px 8px; padding: 24px 36px; text-align: center; }
          .footer p { font-size: 11px; color: #999999; margin-bottom: 8px; letter-spacing: 0.5px; }
          .footer .copy { color: #FFFFFF; font-weight: 600; letter-spacing: 1px; margin: 0; }

          /* Print/PDF styles */
          @media print {
            body { background: white; padding: 0; }
            .btn-wrap { display: none; }
            .wrapper { max-width: 100%; box-shadow: none; }
            .header { border-radius: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .footer { border-radius: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .cost-row td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .group-header td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            td.alt { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">

          <div class="btn-wrap">
            <button class="btn" onclick="window.print()">⬇ &nbsp;Download PDF</button>
          </div>

          <div class="header">
            <div class="bubble1"></div>
            <div class="bubble2"></div>
            <p class="brand">Hotpoint Appliances Ltd.</p>
            <h1>Travel Requisition Summary</h1>
            <div class="divider"></div>
          </div>

          <div class="body">

            <p class="section-label">✈ &nbsp;Travel Details</p>
            <table class="data-table">
              <tbody>
                ${row("Employee", employeeName, true)}
                ${row("Submitter Email", emailAddress)}
                ${row("Department", department, true)}
                ${row("Designation", designation)}
                ${row("Destination", destination, true)}
                ${row("Travel Category", travelCategory)}
                ${row("Business Justification", businessJustification, true)}
                ${row("Mode of Transport", modeOfTransport)}
                ${row("Per Diem Policy", perDiemPolicy, true)}
                ${row("Approval Tier", approvalTier)}
                ${row("Cost Centre", costCentre, true)}
                ${row("Within Budget", withinBudget)}
                ${row("Travel Dates", formattedDepartureDate + " → " + formattedReturnDate, true)}
                <tr class="cost-row">
                  <td class="label cost-label no-border">Estimated Cost</td>
                  <td class="val cost-val no-border">KES ${estimatedCost}</td>
                </tr>
              </tbody>
            </table>

            <p class="section-label">✓ &nbsp;Approval Progress</p>
            <table class="approval-table">
              <tbody>
                ${groupHeader("HOD")}
                ${statusRow("Status", hodApprovalStatus, true)}
                ${row("Approver", hodApprover)}
                ${row("Email", hodEmail, true)}
                ${commentRow("Comments", hodComments)}
                ${groupHeader("HR")}
                ${statusRow("Status", hrApprovalStatus, true)}
                ${row("Approver", hrApprover)}
                ${row("Email", hrEmail, true)}
                ${commentRow("Comments", hrComments)}
                ${groupHeader("Director")}
                ${statusRow("Status", directorApprovalStatus, true)}
                ${row("Approver", directorApprover)}
                ${row("Email", directorEmail, true)}
                ${commentRow("Comments", directorComments, true)}
              </tbody>
            </table>

          </div>

          <div class="footer">
            <p>This is an automated document.</p>
            <p class="copy">&copy; ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
          </div>

        </div>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setTitle(`Travel Requisition - ${employeeName}`)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function row(label, value, isAlt = false) {
  const alt = isAlt ? " alt" : "";
  return `
    <tr>
      <td class="label${alt}">${label}</td>
      <td class="val${alt}">${value || "N/A"}</td>
    </tr>`;
}

function statusRow(label, value, isAlt = false) {
  const alt = isAlt ? " alt" : "";
  const lower = (value || "").toLowerCase();
  let badgeClass = "pending";
  if (lower.includes("approved")) badgeClass = "approved";
  if (lower.includes("declined")) badgeClass = "declined";
  return `
    <tr>
      <td class="label${alt}">${label}</td>
      <td class="val${alt}"><span class="badge ${badgeClass}">${value || "Pending"}</span></td>
    </tr>`;
}

function commentRow(label, value, isLast = false) {
  const last = isLast ? " no-border" : "";
  return `
    <tr>
      <td class="label${last}">${label}</td>
      <td class="${last}"><span class="comment">"${value || "None"}"</span></td>
    </tr>`;
}

function groupHeader(label) {
  return `
    <tr class="group-header">
      <td colspan="2">${label}</td>
    </tr>`;
}

function dateFormatter(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
