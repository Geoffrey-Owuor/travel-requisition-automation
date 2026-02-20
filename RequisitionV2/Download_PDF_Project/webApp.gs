// Our global constants
const SPREADSHEET_ID = "11IQpitHKfNSx4dZSk9mcIOjOKVCknE3GrR0anNuezFc";
const SHEET_NAME = "Form Resopnses 1";
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
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0ece4; padding: 40px 20px; }

          .wrapper { max-width: 680px; margin: 0 auto; }

          /* Header */
          .header {
            background: linear-gradient(135deg, #1c1c1e 0%, #2d2a26 60%, #4a3f35 100%);
            border-radius: 20px 20px 0 0;
            padding: 40px 36px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header .bubble1 { position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(196,160,96,0.12); }
          .header .bubble2 { position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(196,160,96,0.08); }
          .header .brand { font-size: 10px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #c4a060; margin-bottom: 8px; }
          .header h1 { font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #ffffff; }
          .header .divider { margin: 18px auto 0; width: 40px; height: 2px; background: linear-gradient(90deg, #c4a060, #e8c97a); border-radius: 2px; }

          /* Body */
          .body { background: #ffffff; padding: 36px; border-left: 1px solid #e8e0d4; border-right: 1px solid #e8e0d4; }

          /* Section label */
          .section-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #c4a060; margin: 0 0 12px; }

          /* Tables */
          table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.06); margin-bottom: 32px; }
          td { padding: 13px 18px; border-bottom: 1px solid #f0ebe2; font-size: 13px; }
          td.label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6a58; width: 38%; }
          td.alt { background-color: #fdfaf6; }
          td.no-border { border-bottom: none; }

          /* Badge */
          .badge { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
          .badge.pending { color: #f59e0b; background: #fffbeb; border: 1px solid rgba(245,158,11,0.3); }
          .badge.approved { color: #2e7d52; background: #f0faf5; border: 1px solid rgba(46,125,82,0.3); }
          .badge.declined { color: #c0392b; background: #fff5f5; border: 1px solid rgba(192,57,43,0.3); }

          /* Comment */
          .comment { font-family: Georgia, serif; font-size: 13px; font-style: italic; color: #7a6a58; }

          /* Group header */
          .group-header td { padding: 10px 18px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; background: linear-gradient(90deg, #3a3530, #4a3f35); border-bottom: none; }

          /* Cost */
          .cost { font-size: 15px; font-weight: 700; color: #2e7d52; }

          /* Download button */
          .btn-wrap { text-align: center; margin-top: 8px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #1c1c1e 0%, #2d2a26 100%); color: #e8c97a; padding: 16px 44px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; box-shadow: 0 6px 24px rgba(28,28,30,0.25); cursor: pointer; border: none; }

          /* Footer */
          .footer { background: linear-gradient(135deg, #2d2a26 0%, #1c1c1e 100%); border-radius: 0 0 20px 20px; padding: 24px 36px; text-align: center; }
          .footer p { font-size: 10px; color: #888077; margin-bottom: 4px; letter-spacing: 0.5px; }
          .footer .copy { color: #c4a060; font-weight: 600; letter-spacing: 1px; margin: 0; }

          /* Print/PDF styles */
          @media print {
            body { background: white; padding: 0; }
            .btn-wrap { display: none; }
            .wrapper { max-width: 100%; }
            .header { border-radius: 0; }
            .footer { border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">

          <!-- Header -->
          <div class="header">
            <div class="bubble1"></div>
            <div class="bubble2"></div>
            <p class="brand">Hotpoint Appliances Ltd.</p>
            <h1>Travel Requisition Summary</h1>
            <div class="divider"></div>
          </div>

          <!-- Body -->
          <div class="body">

            <!-- Travel Details -->
            <p class="section-label">✈ &nbsp;Travel Details</p>
            <table>
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
                <tr>
                  <td class="label alt no-border">Estimated Cost</td>
                  <td class="alt no-border cost">KES ${estimatedCost}</td>
                </tr>
              </tbody>
            </table>

            <!-- Approval Progress -->
            <p class="section-label">✓ &nbsp;Approval Progress</p>
            <table>
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

            <!-- Download Button -->
            <div class="btn-wrap">
              <button class="btn" onclick="window.print()">⬇ &nbsp;Download PDF</button>
            </div>

          </div>

          <!-- Footer -->
          <div class="footer">
            <p>This is an automated document. Please do not reply to this email.</p>
            <p class="copy">&copy; ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
          </div>

        </div>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setTitle(`Travel Requisition — ${employeeName}`)
    .setFaviconUrl(faviconUrl)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function row(label, value, isAlt = false) {
  const alt = isAlt ? " alt" : "";
  return `
    <tr>
      <td class="label${alt}">${label}</td>
      <td class="${isAlt ? "alt" : ""}">${value || "N/A"}</td>
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
      <td class="${isAlt ? "alt" : ""}"><span class="badge ${badgeClass}">${value || "Pending"}</span></td>
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
