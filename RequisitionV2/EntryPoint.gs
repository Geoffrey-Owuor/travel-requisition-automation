// Defining our base link
const webAppUrl = `https://script.google.com/macros/s/YOUR_V2_DEPLOYMENT_ID/exec?authuser=${0}`;

// DIRECTORS ARRAY
const DIRECTOR_APPROVERS = [
  {
    Name: "Approver Name 1",
    Email: "approver1@example.com",
  },
];

// HR ARRAY
const HR_APPROVERS = [
  {
    Name: "Approver Name 3",
    Email: "approver3@example.com",
  },
];

// HOD MAPPING
const HOD_MAP = {
  "Approver Name 2": "approver2@example.com",
  "Director Name 2": "director2@example.com",
  "Director Name 3": "director3@example.com",
};

// Date Formatter
function dateFormatter(dateString) {
  const date = new Date(dateString);
  const dateResult = date.toLocaleDateString();

  return dateResult;
}

// Generate an approvalTier
function generateApprovalTier(estimatedCost, modeOfTravel, travelCategory) {
  let approvalTier;

  if (
    travelCategory === "Local" &&
    modeOfTravel === "Road" &&
    Number(estimatedCost) < 30000
  ) {
    approvalTier = "Tier 1";
  } else if (
    travelCategory === "Local" &&
    (modeOfTravel === "Air" ||
      (Number(estimatedCost) > 30000 && Number(estimatedCost) < 100000))
  ) {
    approvalTier = "Tier 2";
  } else {
    approvalTier = "Tier 3";
  }

  return approvalTier;
}

// The onFormSubmit Function
function onFormSubmit(e) {
  // General sheet initialization
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rowId = sheet.getLastRow();

  // get the user's email address
  const userEmail = sheet.getRange(rowId, 2).getValue();

  // Getting the hod name from the submitted form
  const selectedHod = e.namedValues["HOD Approver"][0];

  // Get the values that will determine the approval tier
  const estimatedCost = e.namedValues["Total Estimated Cost"][0];
  const modeOfTravel = e.namedValues["Requested Mode of Travel"][0];
  const travelCategory = e.namedValues["Travel Category"][0];

  // get the approval tier value
  const approvalTier = generateApprovalTier(
    estimatedCost,
    modeOfTravel,
    travelCategory,
  );

  // Get the hod email
  const hodEmail = HOD_MAP[selectedHod];

  // Get the sheet headers
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // 1. Get the columns to edit
  const hodStatusCol = headers.indexOf("HOD Approval Status") + 1;
  const hrStatusCol = headers.indexOf("HR Approval Status") + 1;
  const directorStatusCol = headers.indexOf("Director Approval Status") + 1;
  const approvalTierCol = headers.indexOf("Approval Tier") + 1;

  // 2. Update the sheet with the initial values
  sheet.getRange(rowId, hodStatusCol).setValue("Pending");
  sheet.getRange(rowId, hrStatusCol).setValue("N/A");
  sheet.getRange(rowId, directorStatusCol).setValue("N/A");
  sheet.getRange(rowId, approvalTierCol).setValue(approvalTier);

  // Generate the HOD approval url
  const reviewLink = `${webAppUrl}&rowId=${rowId}&email=${hodEmail}&name=${encodeURIComponent(selectedHod)}&stage=HOD`;

  // Generating the user email html template
  const userHtmlBody = EmailTemplate({
    rowId: rowId,
    message: "Your travel requisition has been submitted successfully.",
    title: "Update: Travel Requisition Successfully Submitted",
    role: "user",
  });

  // Generate the hod email html template
  const hodHtmlBody = EmailTemplate({
    rowId: rowId,
    message:
      "A new travel requisition has been submitted and requires your approval.",
    title: "Action Required: New Travel Requisition",
    role: "HOD",
    reviewLink: reviewLink,
  });

  // Send email to hod
  MailApp.sendEmail({
    to: hodEmail,
    subject: "Action Required: Travel Requisition Review",
    htmlBody: hodHtmlBody,
  });

  // Send email to the user
  MailApp.sendEmail({
    to: userEmail,
    subject: "Update: Travel Requisition Successfully Submitted",
    htmlBody: userHtmlBody,
  });
}
