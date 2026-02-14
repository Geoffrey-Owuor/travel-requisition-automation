// 1. The HOD approval stage function
function hodApprovalStage({
  rowId,
  userEmail,
  status,
  email,
  name,
  travelCategory,
  modeOfTravel,
  approvalTier,
}) {
  // HOD declined the request, notify the HOD and the submitter - END
  if (status === "Declined") {
    // Generate user email html
    const userHtmlBody = EmailTemplate({
      rowId: rowId,
      message:
        "Your travel requisition has been declined at the HOD Approval Stage.",
      title: `Final Update: Travel Requisition Declined By ${name}`,
      role: "user",
    });

    // Generate hod email html
    const hodHtmlBody = EmailTemplate({
      rowId: rowId,
      message: "You have declined this travel requisition.",
      title: "Final Update: Travel Requisition Declined",
      role: "user",
    });

    // send the emails
    MailApp.sendEmail({
      to: email,
      subject: "Final Update: Travel Requisition Declined",
      htmlBody: hodHtmlBody,
    });

    MailApp.sendEmail({
      to: userEmail,
      subject: `Final Update: Travel Requisition Declined By ${name}`,
      htmlBody: userHtmlBody,
    });
  }

  //HOD approved the request - decide whether the flow ends here or is passed to HR
  if (status === "Approved") {
    if (
      travelCategory === "Local" &&
      modeOfTravel === "Road" &&
      approvalTier === "Tier 1"
    ) {
      // Generate user email html
      const userHtmlBody = EmailTemplate({
        rowId: rowId,
        message: `Your travel requisition has been approved by ${name}.`,
        title: `Final Update: Travel Requisition Approved By ${name}`,
        role: "user",
      });

      // Generate hod email html
      const hodHtmlBody = EmailTemplate({
        rowId: rowId,
        message: "You have approved this travel requisition.",
        title: "Final Update: Travel Requisition Approved",
        role: "user",
      });

      // send the emails
      MailApp.sendEmail({
        to: email,
        subject: "Final Update: Travel Requisition Approved",
        htmlBody: hodHtmlBody,
      });

      MailApp.sendEmail({
        to: userEmail,
        subject: `Final Update: Travel Requisition Approved By ${name}`,
        htmlBody: userHtmlBody,
      });
    } else {
      // The requisition requires the next approval - HR Approval
      // Send emails to the required hr approvers
      HR_APPROVERS.forEach((hrApprover) => {
        //  Generate a reviewLink
        const reviewLink = `${webAppUrl}&rowId=${rowId}&email=${hrApprover.Email}&name=${encodeURIComponent(hrApprover.Name)}&stage=HR`;

        // Generate an HR email html
        const hrHtmlBody = EmailTemplate({
          rowId: rowId,
          message:
            "A new travel requisition has been submitted and requires your approval",
          title: "Action Required: New Travel Requisition",
          role: "HR",
          reviewLink: reviewLink,
        });

        // Send email to the hr Approver
        MailApp.sendEmail({
          to: hrApprover.Email,
          subject: "Action Required: New Travel Requisition",
          htmlBody: hrHtmlBody,
        });
      });

      // Lets notify the involved parties (The hod and the submitter)

      // Generate user email html
      const userHtmlBody = EmailTemplate({
        rowId: rowId,
        message: `Your travel requisition has been approved by ${name} and has been forwaded to HR for the next approval`,
        title: `Update: Travel Requisition Approved By ${name}.`,
        role: "user",
      });

      // Generate hod email html
      const hodHtmlBody = EmailTemplate({
        rowId: rowId,
        message:
          "You have approved this travel requisition. It has been forwarded to HR for the next approval",
        title: "Update: Travel Requisition Approved",
        role: "user",
      });

      // send the emails
      MailApp.sendEmail({
        to: email,
        subject: "Update: Travel Requisition Approved",
        htmlBody: hodHtmlBody,
      });

      MailApp.sendEmail({
        to: userEmail,
        subject: `Update: Travel Requisition Approved By ${name}`,
        htmlBody: userHtmlBody,
      });
    }
  }
}
