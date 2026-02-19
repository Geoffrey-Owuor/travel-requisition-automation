// This function runs when someone clicks the link in their email
function doGet(e) {
  const rowId = e.parameter.rowId;
  const stage = e.parameter.stage;
  const name = e.parameter.name;
  const email = e.parameter.email;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Our favicon url
  const faviconUrl =
    "https://lh3.googleusercontent.com/u/0/d/1bZv51GB9pJ5S4kfTsP8wj0bMT5J4GV4a#.png";

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // 1. Find the specific status column for the current stage
  // Matches "HOD Approval Status, HR Approval Status" or "Director Approval Status"
  const statusCol = headers.indexOf(`${stage} Approval Status`) + 1;
  const currentStatus = sheet
    .getRange(rowId, statusCol)
    .getValue()
    .toLowerCase();

  // 2. FALLBACK CHECK: If status is not "pending" and "n/a", return the "Already Processed" UI
  if (currentStatus !== "pending" && currentStatus !== "n/a") {
    const fallback = HtmlService.createTemplateFromFile("AlreadyProcessed");
    fallback.status = currentStatus;
    fallback.stage = stage;
    return fallback
      .evaluate()
      .setTitle("Request Already Processed")
      .setFaviconUrl(faviconUrl)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 3. STANDARD PATH: If status is "pending" or "n/a", continue to the Review Portal
  const lastCol = sheet.getLastColumn();
  // Fetching the specific row data (Columns 2 to lastCol)
  const values = sheet.getRange(rowId, 2, 1, lastCol - 1).getValues()[0];

  // format dates
  const departureDate = dateFormatter(values[5]);
  const returnDate = dateFormatter(values[6]);

  const html = HtmlService.createTemplateFromFile("Review");

  // Pass variables (submitted values) to the HTML
  html.rowId = rowId;
  html.stage = stage;
  html.name = name;
  html.email = email;
  html.details = {
    employeeName: values[1],
    department: values[2],
    designation: values[3],
    destination: values[4],
    dates: `${departureDate} to ${returnDate}`,
    travelCategory: values[7],
    businessJustification: values[8],
    requestedModeofTravel: values[9],
    perdiemPolicy: values[10],
    estimatedCost: values[11],
    costCentre: values[12],
    withinBudget: values[13],
    approvalTier: values[14],
  };

  return html
    .evaluate()
    .setTitle(`Review Portal | HAL - ${stage} Approval Stage`)
    .setFaviconUrl(faviconUrl)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// A default emailHtml for alert notifications
const DEFAULT_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #fffbeb; border-bottom: 3px solid #f59e0b; padding: 20px; text-align: center; }
    .header h2 { margin: 0; color: #92400e; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 30px; color: #374151; line-height: 1.6; }
    .alert-box { background-color: #fef2f2; border: 1px solid #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px; color: #b91c1c; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .data-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
    .label { font-weight: 600; color: #6b7280; width: 140px; }
    .value { font-family: 'Courier New', monospace; color: #111827; }
    .footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Exception Alert</h2>
    </div>
    <div class="content">
      <p><strong>System Notification:</strong> An invalid parameter was detected in the <code>processReview</code> workflow.</p>
      
      <div class="alert-box">
        <strong>Error:</strong> Unknown 'stage' parameter received.
      </div>

      <table class="data-table">
        <tr>
          <td class="label">Invalid Value:</td>
          <td class="value" style="color: #dc2626;">Some Values</td>
        </tr>
        <tr>
          <td class="label">Reference No:</td>
          <td class="value">Some Reference Number</td>
        </tr>
        <tr>
          <td class="label">Timestamp:</td>
          <td class="value">${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
        The process was halted to prevent data corruption. Please investigate the payload source.
      </p>
    </div>
    <div class="footer">
      Automated Backend Monitoring System
    </div>
  </div>
</body>
</html>
`;
