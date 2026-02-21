const PDF_WEB_APP_URL = `https://script.google.com/macros/s/AKfycbzgZyrYpsoSyzG6GB4xRG6dYShO95pmXqKUgImQ2YW8fEtnkxrKjflwhbZ02kAmas7lgQ/exec?authuser=${0}`;

function EmailTemplate({
  rowId,
  message,
  title,
  role,
  reviewLink,
  showPdfDownload = false,
}) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const lastCol = sheet.getLastColumn();
  const values = sheet.getRange(rowId, 2, 1, lastCol - 1).getValues()[0];

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

  const buttonStyle = role !== "user" ? "display: block;" : "display: none;";
  const pdfButtonStyle = showPdfDownload
    ? "display: block; margin-top: 14px;"
    : "display: none;";

  const emailHtml = `
    <div style="font-family: 'Georgia', 'Times New Roman', serif; background-color: #f0ece4; padding: 40px 20px; min-height: 100%;">
      <div style="max-width: 620px; margin: 0 auto;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1c1c1e 0%, #2d2a26 60%, #4a3f35 100%); border-radius: 20px 20px 0 0; padding: 40px 36px 32px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(196,160,96,0.12);"></div>
          <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(196,160,96,0.08);"></div>
          <p style="margin: 12px 0 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #c4a060; opacity: 0.9;">Hotpoint Appliances Ltd.</p>
          <h2 style="margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 0.5px; color: #ffffff; font-family: 'Georgia', serif; line-height: 1.3;">${title}</h2>
          <div style="margin-top: 18px; width: 40px; height: 2px; background: linear-gradient(90deg, #c4a060, #e8c97a); margin-left: auto; margin-right: auto; border-radius: 2px;"></div>
        </div>

        <!-- Body -->
        <div style="background-color: #ffffff; padding: 36px 20px; border-left: 1px solid #e8e0d4; border-right: 1px solid #e8e0d4;">
          
          <!-- Message -->
          <div style="background: linear-gradient(135deg, #fdf8f0 0%, #faf5ec 100%); border-left: 3px solid #c4a060; border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 32px;">
            <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #3a3530; margin: 0; line-height: 1.7;">${message}</p>
          </div>

          <!-- Travel Details Table -->
          <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #c4a060; margin: 0 0 12px;">✈ &nbsp;Travel Details</p>
          <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.06); margin-bottom: 28px;">
            <tbody>
              ${travelRow("Employee", employeeName, true)}
              ${travelRow("Submitter Email", emailAddress, false, true)}
              ${travelRow("Department", department, true)}
              ${travelRow("Designation", designation)}
              ${travelRow("Destination", destination, true)}
              ${travelRow("Travel Category", travelCategory)}
              ${travelRow("Business Justification", businessJustification, true)}
              ${travelRow("Mode of Transport", modeOfTransport)}
              ${travelRow("Per Diem Policy", perDiemPolicy, true)}
              ${travelRow("Approval Tier", approvalTier)}
              ${travelRow("Cost Centre", costCentre, true)}
              ${travelRow("Within Budget", withinBudget)}
              ${travelRow("Travel Dates", `${formattedDepartureDate} &rarr; ${formattedReturnDate}`, true)}
              <tr>
                <td style="padding: 13px 18px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6a58; background-color: #fdfaf6; width: 38%; border-bottom: none;">Estimated Cost</td>
                <td style="padding: 13px 18px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2e7d52; background-color: #fdfaf6; border-bottom: none;">KES ${estimatedCost}</td>
              </tr>
            </tbody>
          </table>

          <!-- Approval Progress Table -->
          <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #c4a060; margin: 0 0 12px;">✓ &nbsp;Approval Progress</p>
          <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.06); margin-bottom: 32px;">
            <tbody>
              ${approvalGroupHeader("HOD")}
              ${approvalRow("Status", hodApprovalStatus, true, hodApprovalStatus)}
              ${approvalRow("Approver", hodApprover, false)}
              ${approvalRow("Email", hodEmail, true)}
              ${approvalRow("Comments", hodComments || "None", false, null, true)}
              ${approvalGroupHeader("HR")}
              ${approvalRow("Status", hrApprovalStatus, true, hrApprovalStatus)}
              ${approvalRow("Approver", hrApprover, false)}
              ${approvalRow("Email", hrEmail, true)}
              ${approvalRow("Comments", hrComments || "None", false, null, true)}
              ${approvalGroupHeader("Director")}
              ${approvalRow("Status", directorApprovalStatus, true, directorApprovalStatus)}
              ${approvalRow("Approver", directorApprover, false)}
              ${approvalRow("Email", directorEmail, true)}
              ${approvalRow("Comments", directorComments || "None", false, null, false, true)}
            </tbody>
          </table>

          <!-- CTA Buttons -->
           <div style="text-align: center; margin-top: 10px;">
  
            <!-- Review Requisition (approvers only) -->
            <div style="${buttonStyle}">
              <a href="${reviewLink}" style="display: inline-block; background: linear-gradient(135deg, #1c1c1e 0%, #2d2a26 100%); color: #e8c97a; padding: 16px 44px; text-decoration: none; border-radius: 50px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; box-shadow: 0 6px 24px rgba(28,28,30,0.25);">Review Requisition &rarr;</a>
            </div>

            <!-- Download PDF (everyone) -->
            <div style="${pdfButtonStyle}">
              <a href="${PDF_WEB_APP_URL}&rowId=${rowId}" style="display: inline-block; background: linear-gradient(135deg, #4a3f35 0%, #3a3530 100%); color: #e8c97a; padding: 14px 40px; text-decoration: none; border-radius: 50px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; box-shadow: 0 6px 20px rgba(28,28,30,0.2);">&#11123; &nbsp;Download PDF</a>
            </div>

           </div>

        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #2d2a26 0%, #1c1c1e 100%); border-radius: 0 0 20px 20px; padding: 24px 36px; text-align: center;">
          <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; color: #888077; margin: 0 0 4px; letter-spacing: 0.5px;">This is an automated notification. Please do not reply to this email.</p>
          <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; color: #c4a060; margin: 0; font-weight: 600; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
        </div>

      </div>
    </div>
  `;

  return emailHtml;
}

// Helper: alternating travel detail rows
function travelRow(label, value, isAlt = false, truncate = false) {
  const bg = isAlt ? "#fdfaf6" : "#ffffff";
  const valueTdExtra = truncate
    ? "max-width: 0; width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    : "";

  return `
    <tr>
      <td style="padding: 13px 18px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6a58; background-color: ${bg}; width: 38%; border-bottom: 1px solid #f0ebe2;">${label}</td>
      <td style="${valueTdExtra} padding: 13px 18px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #2c2825; background-color: ${bg}; border-bottom: 1px solid #f0ebe2;">${value || "N/A"}</td>
    </tr>`;
}
// Helper: approval section group header
function approvalGroupHeader(label) {
  return `
    <tr>
      <td colspan="2" style="padding: 10px 18px 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; background: linear-gradient(90deg, #3a3530, #4a3f35);">${label}</td>
    </tr>`;
}

// Helper: approval detail row with optional status badge and last-row flag
function approvalRow(
  label,
  value,
  isAlt = false,
  statusVal = null,
  isComment = false,
  isLast = false,
) {
  const bg = isAlt ? "#fdfaf6" : "#ffffff";
  const borderBottom = isLast ? "none" : "1px solid #f0ebe2";
  const displayVal = value || "N/A";

  let valueHtml;
  if (statusVal) {
    const lower = (statusVal || "").toLowerCase();
    let badgeColor = "#f59e0b"; // pending — amber
    let badgeBg = "#fffbeb";
    if (lower.includes("approved")) {
      badgeColor = "#2e7d52";
      badgeBg = "#f0faf5";
    }
    if (lower.includes("declined")) {
      badgeColor = "#c0392b";
      badgeBg = "#fff5f5";
    }
    valueHtml = `<span style="display: inline-block; padding: 4px 12px; border-radius: 50px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: ${badgeColor}; background-color: ${badgeBg}; border: 1px solid ${badgeColor}30;">${displayVal}</span>`;
  } else if (isComment) {
    valueHtml = `<span style="font-family: 'Georgia', serif; font-size: 13px; font-style: italic; color: #7a6a58;">"${displayVal}"</span>`;
  } else {
    valueHtml = `<span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #2c2825;">${displayVal}</span>`;
  }

  return `
    <tr>
      <td style="padding: 12px 18px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6a58; background-color: ${bg}; width: 38%; border-bottom: ${borderBottom};">${label}</td>
      <td style="padding: 12px 18px; background-color: ${bg}; border-bottom: ${borderBottom};">${valueHtml}</td>
    </tr>`;
}
