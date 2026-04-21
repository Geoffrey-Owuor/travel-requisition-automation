const SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const SHEET_NAME = "Form Responses 1";
const faviconUrl =
  "https://lh3.googleusercontent.com/u/0/d/YOUR_FAVICON_FILE_ID#.png";

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
    twoWayTransportCost,
    otherCosts,
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
        <title>Travel Summary — ${employeeName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Inter', -apple-system, sans-serif; 
            background-color: #fcfafb; 
            color: #1a0f0f;
            line-height: 1.5;
            padding: 40px 0;
          }

          .wrapper { max-width: 700px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(163,29,29,0.08); overflow: hidden; border: 1px solid #f2eaea; }

          /* Compact Glossy Header */
          .header {
            background: linear-gradient(135deg, #a31d1d 0%, #7a1515 100%);
            padding: 24px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid #f2d7d5;
          }
          .header h1 { color: white; font-size: 20px; font-weight: 700; margin: 0; }
          .header .id-badge { background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 11px; font-weight: 700; }

          .content { padding: 32px 40px; }

          /* Section Titles */
          .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #a31d1d; margin-bottom: 16px; border-bottom: 1px solid #f9e8e8; padding-bottom: 8px; }

          /* Info Grid */
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
          .info-item label { display: block; font-size: 10px; font-weight: 700; color: #8c7474; text-transform: uppercase; margin-bottom: 4px; }
          .info-item span { font-size: 14px; font-weight: 600; color: #1a0f0f; }

          /* Glossy Financial Card */
          .financial-card {
            background: linear-gradient(145deg, #2c1a1a 0%, #1a0f0f 100%);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            border: 1px solid rgba(163,29,29,0.3);
            color: white;
          }
          .financial-card table { width: 100%; border-collapse: collapse; }
          .financial-card td { padding: 8px 0; font-size: 13px; color: #8c7474; }
          .financial-card td.val { text-align: right; color: white; font-weight: 600; }
          .total-row { border-top: 1px solid rgba(255,255,255,0.1); }
          .total-row td { padding-top: 16px; font-size: 15px; font-weight: 700; color: #f2d7d5; }
          .total-row td.val { font-size: 22px; color: white; }

          /* Approval Cards */
          .approval-stack { border: 1px solid #f2eaea; border-radius: 16px; overflow: hidden; margin-bottom: 32px; }
          .approval-item { padding: 16px 20px; border-bottom: 1px solid #f2eaea; background: white; }
          .approval-item:last-child { border-bottom: none; }
          .app-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
          .app-role { font-size: 10px; font-weight: 800; color: #8c7474; text-transform: uppercase; }
          .app-name { font-size: 14px; font-weight: 700; color: #1a0f0f; }
          .badge { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
          .badge.approved { background: #d4edda; color: #155724; }
          .badge.declined { background: #f8d7da; color: #721c24; }
          .badge.pending { background: #fff3cd; color: #856404; }
          .comment-box { margin-top: 10px; font-size: 12px; font-style: italic; color: #6e5a5a; padding: 10px; background: #fdfafa; border-radius: 8px; border: 1px dashed #f2eaea; }

          /* Justification Section */
          .justification { background: #fdf6f6; padding: 20px; border-radius: 16px; border: 1px solid #f9e8e8; margin-bottom: 32px; }
          .justification h4 { font-size: 11px; text-transform: uppercase; color: #a31d1d; margin-bottom: 8px; }
          .justification p { font-size: 13px; color: #4a3a3a; }

          .footer { background: #fdfafa; padding: 24px; text-align: center; border-top: 1px solid #f2eaea; }
          .footer p { font-size: 10px; color: #8c7474; letter-spacing: 0.5px; }

          /* Print Controls */
          .controls { max-width: 700px; margin: 0 auto 20px; text-align: right; }
          .btn-print { background: #a31d1d; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 12px; text-transform: uppercase; }

          @media print {
            body { padding: 0; background: white; }
            .wrapper { box-shadow: none; border: none; max-width: 100%; border-radius: 0; }
            .controls { display: none; }
            .header { border-radius: 0; -webkit-print-color-adjust: exact; }
            .financial-card { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="controls">
          <button class="btn-print" onclick="window.print()">Print to PDF / Save</button>
        </div>

        <div class="wrapper">
          <div class="header">
            <div>
              <p style="color: #f2d7d5; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Your Company Ltd.</p>
              <h1>Travel Requisition Report</h1>
            </div>
            <div class="id-badge">REQ #${rowId}</div>
          </div>

          <div class="content">
            <h3 class="section-title">Employee & Journey Details</h3>
            <div class="info-grid">
              <div class="info-item"><label>Full Name</label><span>${employeeName}</span></div>
              <div class="info-item"><label>Email</label><span>${emailAddress}</span></div>
              <div class="info-item"><label>Designation</label><span>${designation}</span></div>
              <div class="info-item"><label>Department</label><span>${department}</span></div>
              <div class="info-item"><label>Cost Centre</label><span>${costCentre}</span></div>
              <div class="info-item"><label>Destination</label><span>${destination}</span></div>
              <div class="info-item"><label>Category</label><span>${travelCategory}</span></div>
              <div class="info-item"><label>Dates</label><span>${formattedDepartureDate} to ${formattedReturnDate}</span></div>
              <div class="info-item"><label>Transport Mode</label><span>${modeOfTransport}</span></div>
            </div>

            <div class="justification">
              <h4>Business Justification</h4>
              <p>${businessJustification || "No justification provided."}</p>
            </div>

            <h3 class="section-title">Financial Breakdown</h3>
            <div class="financial-card">
              <table>
                <tr><td>Two-Way Transport Cost</td><td class="val">KES ${twoWayTransportCost}</td></tr>
                <tr><td>Other / Miscellaneous Costs</td><td class="val">KES ${otherCosts}</td></tr>
                <tr><td>Per Diem Entitlement</td><td class="val">KES ${perDiemPolicy}</td></tr>
                <tr class="total-row">
                  <td>Total Estimated Cost</td>
                  <td class="val">KES ${estimatedCost}</td>
                </tr>
              </table>
              <p style="font-size: 10px; color: #8c7474; margin-top: 15px; text-align: center;">Within Budget: <strong>${withinBudget}</strong> | Tier: <strong>${approvalTier}</strong></p>
            </div>

            <h3 class="section-title">Workflow & Approval Log</h3>
            <div class="approval-stack">
              ${approvalItem("Head of Department", hodApprover, hodEmail, hodApprovalStatus, hodComments)}
              ${approvalTier === "Tier 2" || approvalTier === "Tier 3" ? approvalItem("Human Resources", hrApprover, hrEmail, hrApprovalStatus, hrComments) : ""}
              ${approvalTier === "Tier 3" ? approvalItem("Executive Director", directorApprover, directorEmail, directorApprovalStatus, directorComments) : ""}
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString("en-GB")} | Travel Requisition</p>
            <p style="margin-top: 5px; font-weight: 700;">&copy; Your Company Ltd.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setTitle(`Summary - ${employeeName}`)
    .setFaviconUrl(faviconUrl)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** * HELPER: Card-based Approval Item
 */
function approvalItem(role, name, email, status, comments) {
  const lower = (status || "Pending").toLowerCase();
  let badgeClass = "pending";
  if (lower.includes("approved")) badgeClass = "approved";
  if (lower.includes("declined")) badgeClass = "declined";

  return `
    <div class="approval-item">
      <div class="app-header">
        <div>
          <div class="app-role">${role}</div>
          <div class="app-name">${name || "Awaiting Action..."}</div>
          <div class="app-name">${email || "Awaiting Action..."}</div>
        </div>
        <div class="badge ${badgeClass}">${status || "Pending"}</div>
      </div>
      ${comments ? `<div class="comment-box">"${comments}"</div>` : ""}
    </div>
  `;
}

/** * HELPER: Date Formatter
 */
function dateFormatter(date) {
  if (!date || isNaN(new Date(date).getTime())) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
