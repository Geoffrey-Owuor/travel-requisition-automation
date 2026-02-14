// This function runs when someone clicks the link in their email
function doGet(e) {
  const rowId = e.parameter.rowId;
  const stage = e.parameter.stage;
  const name = e.parameter.name;
  const email = e.parameter.email;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // 1. Find the specific status column for the current stage
  // Matches "HOD Approval Status, HR Approval Status" or "Director Approval Status"
  const statusCol = headers.indexOf(`${stage} Approval Status`) + 1;
  const currentStatus = sheet
    .getRange(rowId, statusCol)
    .getValue()
    .toLowerCase();

  // 2. FALLBACK CHECK: If status is not "pending" or "n/a", return the "Already Processed" UI
  if (currentStatus !== "pending" || currentStatus !== "n/a") {
    const fallback = HtmlService.createTemplateFromFile("AlreadyProcessed");
    fallback.status = currentStatus;
    fallback.stage = stage;
    return fallback
      .evaluate()
      .setTitle("Request Already Processed")
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
    approvalTier: values[11],
    estimatedCost: values[12],
    costCentre: values[13],
    withinBudget: values[14],
  };

  return html
    .evaluate()
    .setTitle(`Review Portal | HAL - ${stage} Approval Stage`)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
