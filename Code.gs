// DIRECTORS MAPPING
const DIRECTOR_MAP = {
  "Geoffrey Owuor": "geoffrey@hotpoint.co.ke",
  "Jill Nandaha": "jill@hotpoint.co.ke",
  "Bilha Mmbone": "bilha@hotpoint.co.ke",
};

// HR MAPPING
const HR_MAP = {
  "Lapspot Ify": "lapspotify2@gmail.com",
  "Nelly Paul": "nellypaulowuor@gmail.com",
  "Kiwanukaz Kiwanukra": "kiwanukazkiwanukra@gmail.com",
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

  // Getting the director name and hr name from the form response
  const selectedDirector = e.namedValues["Director Approver"][0];
  const selectedHr = e.namedValues["HR Approver"][0];

  // Other form values selected to be put later

  // Get the director email and hr email
  const directorEmail = DIRECTOR_MAP[selectedDirector];
  const hrEmail = HR_MAP[selectedHr];

  // Get the sheet headers
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // 1. Get the columns to edit
  const hrStatusCol = headers.indexOf("HR Approval Status") + 1;
  const hrEmailCol = headers.indexOf("HR Email") + 1;
  const directorStatusCol = headers.indexOf("Director Approval Status") + 1;
  const directorEmailCol = headers.indexOf("Director Email") + 1;

  // 2. Update the sheet with the initial values
  sheet.getRange(rowId, hrStatusCol).setValue("pending");
  sheet.getRange(rowId, hrEmailCol).setValue(hrEmail);
  sheet.getRange(rowId, directorStatusCol).setValue("pending");
  sheet.getRange(rowId, directorEmailCol).setValue(directorEmail);

  // Generating the user email html template
  const userHtmlBody = EmailTemplate(
    rowId,
    "Your travel requisition has been submitted successfully, below are the details.",
    "Travel Requisition Update",
    "None",
    "user",
  );

  // Generate the hr email template
  const hrHtmlBody = EmailTemplate(
    rowId,
    "A new travel requisition has been submitted and requires your approval.",
    "New Travel Requisition: Action Required",
    "HR", //stage
    "HR", //role
  );

  // Send email to hr
  MailApp.sendEmail({
    to: hrEmail,
    subject: "Action Required: Travel Requisition Review",
    htmlBody: hrHtmlBody,
  });

  // Send email to the user
  MailApp.sendEmail({
    to: userEmail,
    subject: "Travel Requisition Update",
    htmlBody: userHtmlBody,
  });
}
