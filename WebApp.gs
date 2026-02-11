// This function runs when someone clicks the link in their email
function doGet(e) {
  const rowId = e.parameter.rowId;
  const stage = e.parameter.stage;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // 1. Find the specific status column for the current stage
  // Matches "HR Approval Status" or "Director Approval Status"
  const statusCol = headers.indexOf(`${stage} Approval Status`) + 1;
  const currentStatus = sheet
    .getRange(rowId, statusCol)
    .getValue()
    .toLowerCase();

  // 2. FALLBACK CHECK: If status is not "pending", return the "Already Processed" UI
  if (currentStatus !== "pending") {
    const fallback = HtmlService.createTemplateFromFile("AlreadyProcessed");
    fallback.status = currentStatus;
    fallback.stage = stage;
    return fallback
      .evaluate()
      .setTitle("Request Already Processed")
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 3. STANDARD PATH: If status is "pending", continue to the Review Portal
  const lastCol = sheet.getLastColumn();
  // Fetching the specific row data (Columns 2 to lastCol)
  const values = sheet.getRange(rowId, 2, 1, lastCol - 1).getValues()[0];

  // format dates
  const departureDate = dateFormatter(values[6]);
  const returnDate = dateFormatter(values[7]);

  const html = HtmlService.createTemplateFromFile("Review");

  // Pass variables to the HTML
  html.rowId = rowId;
  html.stage = stage;
  html.details = {
    employeeName: values[1],
    department: values[2],
    purpose: values[4],
    destination: values[5],
    dates: `${departureDate} to ${returnDate}`,
    budget: values[9],
  };

  return html
    .evaluate()
    .setTitle("Review Portal | Hotpoint Appliances Ltd")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// This function is called by the HTML page.
// It updates the sheet and decides if the request moves to the Director or finishes.

function processReview(rowId, status, comment, stage) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Find the right columns
  const statusCol = headers.indexOf(`${stage} Approval Status`) + 1;
  const commentCol = headers.indexOf(`${stage} Comments`) + 1;
  const userEmailCol = headers.indexOf("Email Address") + 1 || 2; // Safer than hardcoding 2
  const hrEmailCol = headers.indexOf("HR Email") + 1;
  const directorEmailCol = headers.indexOf("Director Email") + 1;
  const directorNameCol = headers.indexOf("Director Approver") + 1;

  // 1. Update the Sheet
  sheet.getRange(rowId, statusCol).setValue(status);
  sheet.getRange(rowId, commentCol).setValue(comment);

  // 2. Fetch data for emails
  const userEmail = sheet.getRange(rowId, userEmailCol).getValue();
  const hrEmail = sheet.getRange(rowId, hrEmailCol).getValue();
  const directorEmail = sheet.getRange(rowId, directorEmailCol).getValue();
  const directorName = sheet.getRange(rowId, directorNameCol).getValue();

  // 3. Logic Flow
  if (stage === "HR" && status === "Approved") {
    // Stage: HR Approved -> Notify Director, HR, and User
    const directorBody = EmailTemplate(
      rowId,
      "HR has approved this request. It now requires your final review.",
      "Director Action Required",
      "Director",
      "Director",
    );

    const hrBody = EmailTemplate(
      rowId,
      "You have approved this requisition. It has been forwarded to the Director.",
      "Update: Forwarded to Director",
      "None",
      "user",
    );

    const userBody = EmailTemplate(
      rowId,
      "Your travel requisition has been approved by HR and is now with the Director for final approval.",
      "Update: HR Approved",
      "None",
      "user",
    );

    MailApp.sendEmail({
      to: directorEmail,
      subject: "Action Required: Travel Requisition",
      htmlBody: directorBody,
    });

    MailApp.sendEmail({
      to: hrEmail,
      subject: "Requisition Forwarded",
      htmlBody: hrBody,
    });

    MailApp.sendEmail({
      to: userEmail,
      subject: "Requisition Update: HR Approved",
      htmlBody: userBody,
    });
  } else {
    // Stage: HR Declined OR Director Decision
    const finalMsg =
      status === "Approved"
        ? "Your travel requisition has been fully approved. You may proceed with your arrangements."
        : `Your travel requisition was declined at the ${stage} stage.`;

    const userHtmlBody = EmailTemplate(
      rowId,
      finalMsg,
      "Travel Requisition Final Update",
      "None",
      "user",
    );

    const approversHtmlBody = EmailTemplate(
      rowId,
      "The requisition update has been recorded successfully.",
      "Travel Requisition Processed",
      "None",
      "user",
    );

    MailApp.sendEmail({
      to: userEmail,
      subject: "Final Update: Travel Requisition",
      htmlBody: userHtmlBody,
    });

    if (stage === "HR") {
      // HR Declined
      MailApp.sendEmail({
        to: hrEmail,
        subject: "Requisition Declined",
        htmlBody: approversHtmlBody,
      });
    } else {
      // Director made the final call
      const hrStatusMsg = `Travel requisition has been ${status} by ${directorName}.`;

      const hrHtmlBody = EmailTemplate(
        rowId,
        hrStatusMsg,
        `Requisition ${status} by Director`,
        "None",
        "user",
      );

      MailApp.sendEmail({
        to: directorEmail,
        subject: "Decision Recorded",
        htmlBody: approversHtmlBody,
      });

      MailApp.sendEmail({
        to: hrEmail,
        subject: `Final Decision: ${status} by Director`,
        htmlBody: hrHtmlBody,
      });
    }
  }
  return "Success";
}
