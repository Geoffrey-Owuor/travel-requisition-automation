// 1. The Director approval stage function
function directorApprovalStage({
  rowId,
  userEmail,
  status,
  email,
  name,
  hrEmail,
  hodEmail,
}) {
  // Director declined the request, notify Director, HR, HOD and the submitter - END
  if (status === "Declined") {
    // Generate user email html
    const userHtmlBody = EmailTemplate({
      rowId: rowId,
      message:
        "Your travel requisition has been declined at the Director Approval Stage.",
      title: `Final Update: Travel Requisition Declined By ${name}`,
      role: "user",
    });

    // Generate hod and hr email html
    const hodHrHtmlBody = EmailTemplate({
      rowId: rowId,
      message:
        "This travel requisition has been declined at the Director Approval Stage.",
      title: `Final Update: Travel Requisition Declined By ${name}`,
      role: "user",
    });

    //Generate the director email html
    const directorHtmlBody = EmailTemplate({
      rowId: rowId,
      message: "You have declined this travel requisition.",
      title: "Final Update: Travel Requisition Declined",
      role: "user",
    });

    // send the emails
    MailApp.sendEmail({
      to: email,
      subject: "Final Update: Travel Requisition Declined",
      htmlBody: directorHtmlBody,
    });

    MailApp.sendEmail({
      to: [hodEmail, hrEmail],
      subject: `Final Update: Travel Requisition Declined By ${name}`,
      htmlBody: hodHrHtmlBody,
    });

    MailApp.sendEmail({
      to: userEmail,
      subject: `Final Update: Travel Requisition Declined By ${name}`,
      htmlBody: userHtmlBody,
    });
  }

  //Director approved the request - the flow ends here (We notify involved parties of the approval)
  if (status === "Approved") {
    // Generate user email html
    const userHtmlBody = EmailTemplate({
      rowId: rowId,
      message: `Your travel requisition has been approved by ${name}.`,
      title: `Final Update: Travel Requisition Approved By ${name}.`,
      role: "user",
    });

    // Generate hod and hr email html
    const hodHrHtmlBody = EmailTemplate({
      rowId: rowId,
      message: `This travel requisition has been approved by ${name}.`,
      title: `Final Update: Travel Requisition Approved By ${name}.`,
      role: "user",
    });

    // Generate director email html
    const directorHtmlBody = EmailTemplate({
      rowId: rowId,
      message: "You have approved this travel requisition.",
      title: "Final Update: Travel Requisition Approved",
      role: "user",
    });

    // send the emails
    MailApp.sendEmail({
      to: email,
      subject: "Final Update: Travel Requisition Approved",
      htmlBody: directorHtmlBody,
    });

    MailApp.sendEmail({
      to: [hrEmail, hodEmail],
      subject: `Final Update: Travel Requisition Approved By ${name}`,
      htmlBody: hodHrHtmlBody,
    });

    MailApp.sendEmail({
      to: userEmail,
      subject: `Final Update: Travel Requisition Approved By ${name}`,
      htmlBody: userHtmlBody,
    });
  }
}
