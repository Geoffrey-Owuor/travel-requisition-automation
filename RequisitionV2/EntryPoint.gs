// Defining our base link
const webAppUrl = `https://script.google.com/macros/s/AKfycbw6wuuz5KDg1Nfgx4o3TWV8ERsmmfe_-BaFVqFut0OHS-ah-PifZNAsvjn-xD6AFAyvbg/exec?authuser=${0}`;

// DIRECTORS ARRAY
const DIRECTOR_APPROVERS = [
  {
    Name: "Lapspot Ify",
    Email: "lapspotify2@gmail.com",
  },
];

// HR ARRAY
const HR_APPROVERS = [
  {
    Name: "Kiwanukaz Kiwanukra",
    Email: "kiwanukazkiwanukra@gmail.com",
  },
];

// HOD MAPPING
const HOD_MAP = {
  "Nelly Paul": "nellypaulowuor@gmail.com",
  "Jill Nandaha": "jill@hotpoint.co.ke",
  "Bilha Mmbone": "bilha@hotpoint.co.ke",
};

// Date Formatter
function dateFormatter(dateString) {
  const date = new Date(dateString);
  const dateResult = date.toLocaleDateString();

  return dateResult;
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

  // Get the hod email
  const hodEmail = HOD_MAP[selectedHod];

  // Get the sheet headers
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // 1. Get the columns to edit
  const hodStatusCol = headers.indexOf("HOD Approval Status") + 1;
  const hrStatusCol = headers.indexOf("HR Approval Status") + 1;
  const directorStatusCol = headers.indexOf("Director Approval Status") + 1;

  // 2. Update the sheet with the initial values
  sheet.getRange(rowId, hodStatusCol).setValue("Pending");
  sheet.getRange(rowId, hrStatusCol).setValue("N/A");
  sheet.getRange(rowId, directorStatusCol).setValue("N/A");

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
