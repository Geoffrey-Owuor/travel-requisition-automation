function processReview({ rowId, stage, name, email, status, comment }) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Find the right status and comments columns to update
  const statusCol = headers.indexOf(`${stage} Approval Status`) + 1;
  const commentCol = headers.indexOf(`${stage} Comments`) + 1;

  // The user's email column
  const userEmailCol = headers.indexOf("Email Address") + 1;
  const userEmail = sheet.getRange(rowId, userEmailCol).getValue();

  // Approval Tier Data that will determine our logic (how we send emails)
  const approvalTierCol = headers.indexOf("Approval Tier") + 1;

  const approvalTier = sheet.getRange(rowId, approvalTierCol).getValue();

  // Approver columns
  const approverEmailCol = headers.indexOf(`${stage} Email`) + 1;
  const approverNameCol = headers.indexOf(`${stage} Approver`) + 1;

  // 1. Update the Sheet
  sheet.getRange(rowId, statusCol).setValue(status);
  sheet.getRange(rowId, commentCol).setValue(comment);
  sheet.getRange(rowId, approverEmailCol).setValue(email);

  // If stage is not HOD, update the approver Name column
  // HOD name is gotten from form submission data hence we do not need to update it
  if (stage !== "HOD") {
    sheet.getRange(rowId, approverNameCol).setValue(name);
  }

  // The approver emails columns (used for sending follow-up emails)
  // We fetch them after updating the sheets to get the latest values
  const hodEmailCol = headers.indexOf("HOD Email") + 1;
  const hrEmailCol = headers.indexOf("HR Email") + 1;

  const hodEmail = sheet.getRange(rowId, hodEmailCol).getValue();
  const hrEmail = sheet.getRange(rowId, hrEmailCol).getValue();

  // Default function which runs if we have an unknown stage passed to our function
  function notificationMailer() {
    MailApp.sendEmail({
      to: "",
      subject: "An exception occurred",
      htmlBody: DEFAULT_HTML,
    });
  }

  // Determine which function we should run based on the stage
  switch (stage) {
    case "HOD":
      hodApprovalStage({
        rowId,
        userEmail,
        status,
        email,
        name,
        approvalTier,
      });
      break;
    case "HR":
      hrApprovalStage({
        rowId,
        userEmail,
        status,
        email,
        name,
        hodEmail,
        approvalTier,
      });
      break;
    case "Director":
      directorApprovalStage({
        rowId,
        userEmail,
        status,
        email,
        name,
        hrEmail,
        hodEmail,
      });
      break;
    default:
      notificationMailer();
      break;
  }

  //If all goes well return a success message
  return "success";
}
