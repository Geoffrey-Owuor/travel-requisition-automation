const PDF_WEB_APP_URL = `https://script.google.com/macros/s/AKfycbzgZyrYpsoSyzG6GB4xRG6dYShO95pmXqKUgImQ2YW8fEtnkxrKjflwhbZ02kAmas7lgQ/exec?authuser=${0}`;

// --- NEW COLOR PALETTE DEFINITIONS FOR HOTPOINT ---
const COLORS = {
  primaryRed: "#C8102E", // Deep Hotpoint Red
  richBlack: "#1A1A1A", // Main dark header/footer background
  darkText: "#333333", // Standard body text
  lightGrayBg: "#F4F4F4", // Outer background outer
  white: "#FFFFFF",
  tableHeaderBg: "#FAFAFA", // Alternating row color
  borderColor: "#E0E0E0", // Subtle gray borders
  accentGray: "#757575", // Secondary label text
};

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

  // Ensure buttons are visible depending on role
  const buttonContainerStyle =
    role !== "user" || showPdfDownload
      ? "text-align: center; margin-top: 25px; padding-bottom: 20px;"
      : "display: none;";
  const reviewButtonStyle =
    role !== "user" ? "display: inline-block; margin: 10px;" : "display: none;";
  const pdfButtonStyle = showPdfDownload
    ? "display: inline-block; margin: 10px;"
    : "display: none;";

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${COLORS.lightGrayBg}; padding: 40px 20px; min-height: 100%;">
      <div style="max-width: 620px; margin: 0 auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">

        <div style="background: linear-gradient(135deg, ${COLORS.primaryRed} 0%, ${COLORS.richBlack} 80%); border-radius: 8px 8px 0 0; padding: 40px 36px 32px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.1);"></div>
          <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(0,0,0,0.2);"></div>

          <p style="margin: 12px 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${COLORS.white}; opacity: 0.8;">Hotpoint Appliances Ltd.</p>
          <h2 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; color: ${COLORS.white}; line-height: 1.3;">${title}</h2>
          <div style="margin-top: 18px; width: 50px; height: 3px; background-color: ${COLORS.primaryRed}; margin-left: auto; margin-right: auto;"></div>
        </div>

        <div style="background-color: ${COLORS.white}; padding: 36px 25px; border-left: 1px solid ${COLORS.borderColor}; border-right: 1px solid ${COLORS.borderColor};">

          <div style="background-color: ${COLORS.tableHeaderBg}; border-left: 4px solid ${COLORS.primaryRed}; border-radius: 4px; padding: 16px 20px; margin-bottom: 32px;">
            <p style="font-size: 15px; color: ${COLORS.darkText}; margin: 0; line-height: 1.7;">${message}</p>
          </div>

          <p style="font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${COLORS.primaryRed}; margin: 0 0 15px; border-bottom: 2px solid ${COLORS.borderColor}; padding-bottom: 8px;">✈ &nbsp;Travel Details</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px;">
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
                <td style="padding: 15px 18px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: ${COLORS.white}; background-color: ${COLORS.primaryRed}; width: 35%; border-bottom: none;">Estimated Cost</td>
                <td style="padding: 15px 18px; font-size: 18px; font-weight: 700; color: ${COLORS.white}; background-color: ${COLORS.primaryRed}; border-bottom: none;">KES ${estimatedCost}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${COLORS.primaryRed}; margin: 0 0 15px; border-bottom: 2px solid ${COLORS.borderColor}; padding-bottom: 8px;">✓ &nbsp;Approval Progress</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid ${COLORS.borderColor};">
            <tbody>
              ${approvalGroupHeader("HOD")}
              ${approvalRow("Status", hodApprovalStatus, true, hodApprovalStatus)}
              ${approvalRow("Approver", hodApprover, false)}
              ${approvalRow("Email", hodEmail, true, null, false, false, true)}
              ${approvalRow("Comments", hodComments || "None", false, null, true)}
              ${approvalGroupHeader("HR")}
              ${approvalRow("Status", hrApprovalStatus, true, hrApprovalStatus)}
              ${approvalRow("Approver", hrApprover, false)}
              ${approvalRow("Email", hrEmail, true, null, false, false, true)}
              ${approvalRow("Comments", hrComments || "None", false, null, true)}
              ${approvalGroupHeader("Director")}
              ${approvalRow("Status", directorApprovalStatus, true, directorApprovalStatus)}
              ${approvalRow("Approver", directorApprover, false)}
              ${approvalRow("Email", directorEmail, true, null, false, false, true)}
              ${approvalRow("Comments", directorComments || "None", false, null, false, true)}
            </tbody>
          </table>

           <div style="${buttonContainerStyle}">

             <div style="${reviewButtonStyle}">
               <a href="${reviewLink}" style="display: inline-block; background-color: ${COLORS.primaryRed}; color: ${COLORS.white}; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Review Requisition &rarr;</a>
             </div>

             <div style="${pdfButtonStyle}">
               <a href="${PDF_WEB_APP_URL}&rowId=${rowId}" style="display: inline-block; background-color: ${COLORS.richBlack}; color: ${COLORS.white}; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">&#11123; &nbsp;Download PDF</a>
             </div>

            </div>

        </div>

        <div style="background: ${COLORS.richBlack}; border-radius: 0 0 8px 8px; padding: 24px 36px; text-align: center;">
          <p style="font-size: 11px; color: #999999; margin: 0 0 8px; letter-spacing: 0.5px;">This is an automated notification. Please do not reply to this email.</p>
          <p style="font-size: 11px; color: ${COLORS.white}; margin: 0; font-weight: 600; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
        </div>

      </div>
    </div>
  `;

  return emailHtml;
}

// Helper: alternating travel detail rows (Cleaner gray/white alternation)
function travelRow(label, value, isAlt = false, truncate = false) {
  // Use light gray for alt rows instead of beige
  const bg = isAlt ? COLORS.tableHeaderBg : COLORS.white;
  const valueTdExtra = truncate
    ? "max-width: 0; width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    : "";

  return `
    <tr>
      <td style="padding: 12px 15px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${COLORS.accentGray}; background-color: ${bg}; width: 35%; border-bottom: 1px solid ${COLORS.borderColor};">${label}</td>
      <td style="${valueTdExtra} padding: 12px 15px; font-size: 14px; color: ${COLORS.darkText}; background-color: ${bg}; border-bottom: 1px solid ${COLORS.borderColor};"><strong>${value || "N/A"}</strong></td>
    </tr>`;
}

// Helper: approval section group header (Solid Black header)
function approvalGroupHeader(label) {
  return `
    <tr>
      <td colspan="2" style="padding: 10px 15px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.white}; background-color: ${COLORS.richBlack};">${label}</td>
    </tr>`;
}

// Helper: approval detail row
function approvalRow(
  label,
  value,
  isAlt = false,
  statusVal = null,
  isComment = false,
  isLast = false,
  truncate = false,
) {
  const bg = isAlt ? COLORS.tableHeaderBg : COLORS.white;
  const borderBottom = isLast ? "none" : `1px solid ${COLORS.borderColor}`;
  const displayVal = value || "N/A";
  const truncateStyle = truncate
    ? "max-width: 0; width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    : "";

  let valueHtml;
  if (statusVal) {
    const lower = (statusVal || "").toLowerCase();
    // Keep standard status colors as they are functional, but ensure they pop against white
    let badgeColor = "#d97706"; // pending — amber/orange
    let badgeBg = "#fffbeb";
    if (lower.includes("approved")) {
      badgeColor = "#166534"; // Green
      badgeBg = "#dcfce7";
    }
    if (lower.includes("declined")) {
      badgeColor = "#991b1b"; // Red
      badgeBg = "#fee2e2";
    }
    valueHtml = `<span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: ${badgeColor}; background-color: ${badgeBg}; text-transform: uppercase;">${displayVal}</span>`;
  } else if (isComment) {
    valueHtml = `<span style="font-style: italic; color: ${COLORS.accentGray};">${displayVal}</span>`;
  } else {
    valueHtml = `<span style="font-size: 14px; color: ${COLORS.darkText};">${displayVal}</span>`;
  }

  return `
    <tr>
      <td style="padding: 10px 15px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${COLORS.accentGray}; background-color: ${bg}; width: 35%; border-bottom: ${borderBottom};">${label}</td>
      <td style="${truncateStyle} padding: 10px 15px; background-color: ${bg}; border-bottom: ${borderBottom};">${valueHtml}</td>
    </tr>`;
}
