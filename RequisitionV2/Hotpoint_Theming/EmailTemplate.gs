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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f3f3; padding: 40px 20px; min-height: 100%;">
      <div style="max-width: 620px; margin: 0 auto;">

        <div style="background: linear-gradient(135deg, #a31d1d 0%, #7a1515 100%); border-radius: 20px 20px 0 0; padding: 40px 36px 32px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
          <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.03);"></div>
          <p style="margin: 12px 0 8px; font-size: 10px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #f2d7d5; opacity: 0.9;">Hotpoint Appliances Ltd.</p>
          <h2 style="margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 0.5px; color: #ffffff; font-family: 'Georgia', serif; line-height: 1.3;">${title}</h2>
          <div style="margin-top: 18px; width: 40px; height: 2px; background: #ffffff; opacity: 0.3; margin-left: auto; margin-right: auto; border-radius: 2px;"></div>
        </div>

        <div style="background-color: #ffffff; padding: 36px 20px; border-left: 1px solid #f2d7d5; border-right: 1px solid #f2d7d5;">
          
          <div style="background: #fff5f5; border-left: 3px solid #a31d1d; border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 32px;">
            <p style="font-size: 15px; color: #453535; margin: 0; line-height: 1.7;">${message}</p>
          </div>

          <p style="font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #a31d1d; margin: 0 0 12px;">Travel Details</p>
          <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(163,29,29,0.05); margin-bottom: 28px;">
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
                <td style="padding: 13px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8c7474; background-color: #fffafa; width: 38%; border-bottom: none;">Estimated Cost</td>
                <td style="padding: 13px 18px; font-size: 16px; font-weight: 700; color: #a31d1d; background-color: #fffafa; border-bottom: none;">KES ${estimatedCost}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #a31d1d; margin: 0 0 12px;">Approval Progress</p>
          <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(163,29,29,0.05); margin-bottom: 32px;">
            <tbody>
              ${approvalGroupHeader("Head of Department")}
              ${approvalRow("Status", hodApprovalStatus, true, hodApprovalStatus)}
              ${approvalRow("Approver", hodApprover, false)}
              ${approvalRow("Email", hodEmail, true, null, false, false, true)}
              ${approvalRow("Comments", hodComments || "None", false, null, true)}
              
              ${
                /* Show HR section for Tier 2 and Tier 3 */
                approvalTier === "Tier 2" || approvalTier === "Tier 3"
                  ? `
                ${approvalGroupHeader("Human Resources")}
                ${approvalRow("Status", hrApprovalStatus, true, hrApprovalStatus)}
                ${approvalRow("Approver", hrApprover, false)}
                ${approvalRow("Email", hrEmail, true, null, false, false, true)}
                ${approvalRow("Comments", hrComments || "None", false, null, true)}
              `
                  : ""
              }

              ${
                /* Show Director section ONLY for Tier 3 */
                approvalTier === "Tier 3"
                  ? `
                  ${approvalGroupHeader("Executive Director")}
                  ${approvalRow("Status", directorApprovalStatus, true, directorApprovalStatus)}
                  ${approvalRow("Approver", directorApprover, false)}
                  ${approvalRow("Email", directorEmail, true, null, false, false, true)}
                  ${approvalRow("Comments", directorComments || "None", false, null, true, true)}
                `
                  : ""
              }
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 10px;">
            <div style="${buttonStyle}">
              <a href="${reviewLink}" style="display: inline-block; background: #a31d1d; color: #ffffff; padding: 16px 44px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 6px 24px rgba(163,29,29,0.2);">Review Requisition &rarr;</a>
            </div>
            <div style="${pdfButtonStyle}">
              <a href="${PDF_WEB_APP_URL}&rowId=${rowId}" style="display: inline-block; background: #2c1a1a; color: #f2d7d5; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">Download Summary PDF</a>
            </div>
          </div>
        </div>

        <div style="background: #2c1a1a; border-radius: 0 0 20px 20px; padding: 24px 36px; text-align: center;">
          <p style="font-size: 10px; color: #8c7474; margin: 0 0 4px; letter-spacing: 0.5px;">This is an automated notification. Please do not reply.</p>
          <p style="font-size: 10px; color: #f2d7d5; margin: 0; font-weight: 600; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} Hotpoint Appliances Ltd.</p>
        </div>

      </div>
    </div>
  `;

  return emailHtml;
}

// --- Helper Functions Updated for Crimson Theme ---

function travelRow(label, value, isAlt = false, truncate = false) {
  const bg = isAlt ? "#fffafa" : "#ffffff";
  const valueTdExtra = truncate
    ? "max-width: 0; width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    : "";

  return `
    <tr>
      <td style="padding: 13px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8c7474; background-color: ${bg}; width: 38%; border-bottom: 1px solid #f9f0f0;">${label}</td>
      <td style="${valueTdExtra} padding: 13px 18px; font-size: 14px; color: #2c1a1a; background-color: ${bg}; border-bottom: 1px solid #f9f0f0;">${value || "N/A"}</td>
    </tr>`;
}

function approvalGroupHeader(label) {
  return `
    <tr>
      <td colspan="2" style="padding: 10px 18px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; background: #453535;">${label}</td>
    </tr>`;
}

function approvalRow(
  label,
  value,
  isAlt = false,
  statusVal = null,
  isComment = false,
  isLast = false,
  truncate = false,
) {
  const bg = isAlt ? "#fffafa" : "#ffffff";
  const borderBottom = isLast ? "none" : "1px solid #f9f0f0";
  const displayVal = value || "N/A";
  const truncateStyle = truncate
    ? "max-width: 0; width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    : "";

  let valueHtml;
  if (statusVal) {
    const lower = (statusVal || "").toLowerCase();
    let bColor = "#856404";
    let bBg = "#fff3cd"; // Pending
    if (lower.includes("approved")) {
      bColor = "#155724";
      bBg = "#d4edda";
    }
    if (lower.includes("declined")) {
      bColor = "#721c24";
      bBg = "#f8d7da";
    }

    valueHtml = `<span style="display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; color: ${bColor}; background-color: ${bBg}; border: 1px solid rgba(0,0,0,0.05);">${displayVal}</span>`;
  } else if (isComment) {
    valueHtml = `<span style="font-family: 'Georgia', serif; font-size: 13px; font-style: italic; color: #6e5a5a;">"${displayVal}"</span>`;
  } else {
    valueHtml = `<span style="font-size: 14px; color: #2c1a1a;">${displayVal}</span>`;
  }

  return `
    <tr>
      <td style="padding: 12px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8c7474; background-color: ${bg}; width: 38%; border-bottom: ${borderBottom};">${label}</td>
      <td style="${truncateStyle} padding: 12px 18px; background-color: ${bg}; border-bottom: ${borderBottom};">${valueHtml}</td>
    </tr>`;
}
