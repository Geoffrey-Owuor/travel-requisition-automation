// Defining our base link
const webAppUrl = `https://script.google.com/macros/s/AKfycbw6wuuz5KDg1Nfgx4o3TWV8ERsmmfe_-BaFVqFut0OHS-ah-PifZNAsvjn-xD6AFAyvbg/exec?authuser=${0}`;

// DIRECTORS ARRAY
const DIRECTOR_APPROVERS = [
  {
    name: "Lapspot Ify",
    email: "lapspotify2@gmail.com",
    uuid: "1754f097-acf0-479b-a1f9-32a3788a44af",
  },
];

// HR ARRAY
const HR_APPROVERS = [
  {
    name: "Kiwanukaz Kiwanukra",
    email: "kiwanukazkiwanukra@gmail.com",
    uuid: "28023506-dd9a-4d63-a908-f1e785c0a49c",
  },
];

// HOD ARRAY
const HOD_APPROVERS = [
  {
    name: "Nelly Paul",
    email: "nellypaulowuor@gmail.com",
    uuid: "0e37d46e-93c1-4e6d-ae11-3dd07772c3c1",
  },
  {
    name: "Jill Nandaha",
    email: "jill@hotpoint.co.ke",
    uuid: "79196870-675c-40d8-b8a7-fc2718f1d73d",
  },
  {
    name: "Bilha Mmbone",
    email: "bilha@hotpoint.co.ke",
    uuid: "718805b4-a6c8-4112-b8c4-22fb05681122",
  },
];

// Date Formatter
function dateFormatter(dateString) {
  const date = new Date(dateString);
  const dateResult = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return dateResult;
}

// Generate an approvalTier
function generateApprovalTier(estimatedCost, modeOfTravel, travelCategory) {
  let approvalTier;

  if (
    travelCategory === "Local" &&
    modeOfTravel === "Road" &&
    Number(estimatedCost) <= 30000
  ) {
    approvalTier = "Tier 1";
  } else if (
    travelCategory === "International" ||
    Number(estimatedCost) >= 100000
  ) {
    approvalTier = "Tier 3";
  } else {
    approvalTier = "Tier 2";
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

  // Get the hod object from the HOD's array
  const hodObject = HOD_APPROVERS.find(
    (hodApprover) => hodApprover.name === selectedHod,
  );

  // get the hod uuid and email - or fall back to an invalid string
  const hodUuid = hodObject ? hodObject.uuid : "invalid_uuid";
  const hodEmail = hodObject ? hodObject.email : "invalid_email";

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
  const reviewLink = `${webAppUrl}&rowId=${rowId}&token=${hodUuid}&stage=HOD`;

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
