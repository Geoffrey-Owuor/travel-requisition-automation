// 2. The HR approval stage function
function hrApprovalStage({
  rowId,
  userEmail,
  status,
  email,
  name,
  hodEmail,
  approvalTier,
}) {
  // HR declined the request, notify HR, HOD and the submitter - END
  if (status === "Declined") {
    // Generate user email html
    const userHtmlBody = EmailTemplate({
      rowId: rowId,
      message:
        "Your travel requisition has been declined at the HR Approval Stage.",
      title: `Final Update: Travel Requisition Declined By ${name}`,
      role: "user",
    });

    // Generate hod email html
    const hodHtmlBody = EmailTemplate({
      rowId: rowId,
      message:
        "This travel requisition has been declined at the HR Approval Stage.",
      title: `Final Update: Travel Requisition Declined By ${name}`,
      role: "user",
    });

    //Generate the hr email html
    const hrHtmlBody = EmailTemplate({
      rowId: rowId,
      message: "You have declined this travel requisition.",
      title: "Final Update: Travel Requisition Declined",
      role: "user",
    });

    // send the emails
    MailApp.sendEmail({
      to: email,
      subject: "Final Update: Travel Requisition Declined",
      htmlBody: hrHtmlBody,
    });

    MailApp.sendEmail({
      to: hodEmail,
      subject: `Final Update: Travel Requisition Declined By ${name}`,
      htmlBody: hodHtmlBody,
    });

    MailApp.sendEmail({
      to: userEmail,
      subject: `Final Update: Travel Requisition Declined By ${name}`,
      htmlBody: userHtmlBody,
    });
  }

  //HR approved the request - decide whether the flow ends here or is passed to the director
  if (status === "Approved") {
    // The requisition ends at the HR stage
    if (approvalTier === "Tier 2") {
      // Generate user email html
      const userHtmlBody = EmailTemplate({
        rowId: rowId,
        message: `Your travel requisition has been approved by ${name}.`,
        title: `Final Update: Travel Requisition Approved By ${name}`,
        role: "user",
        showPdfDownload: true,
      });

      // Generate the hod email html
      const hodHtmlBody = EmailTemplate({
        rowId: rowId,
        message: `This travel requisition has been approved by ${name}.`,
        title: `Final Update: Travel Requisition Approved By ${name}`,
        role: "user",
        showPdfDownload: true,
      });

      // Generate hr email html
      const hrHtmlBody = EmailTemplate({
        rowId: rowId,
        message: "You have approved this travel requisition.",
        title: "Final Update: Travel Requisition Approved",
        role: "user",
        showPdfDownload: true,
      });

      // send the emails
      MailApp.sendEmail({
        to: email,
        subject: "Final Update: Travel Requisition Approved",
        htmlBody: hrHtmlBody,
      });

      MailApp.sendEmail({
        to: hodEmail,
        subject: `Final Update: Travel Requisition Approved By ${name}`,
        htmlBody: hodHtmlBody,
      });

      MailApp.sendEmail({
        to: userEmail,
        subject: `Final Update: Travel Requisition Approved By ${name}`,
        htmlBody: userHtmlBody,
      });
    } else {
      // The requisition requires the next approval - Director Approval
      // Send emails to the required directors
      DIRECTOR_APPROVERS.forEach((directorApprover) => {
        //  Generate a reviewLink
        const reviewLink = `${webAppUrl}&rowId=${rowId}&token=${directorApprover.uuid}&stage=Director`;

        // Generate a Director email html
        const directorHtmlBody = EmailTemplate({
          rowId: rowId,
          message:
            "A new travel requisition has been submitted and requires your approval",
          title: "Action Required: New Travel Requisition",
          role: "Director",
          reviewLink: reviewLink,
        });

        // Send email to the Director Approver
        MailApp.sendEmail({
          to: directorApprover.email,
          subject: "Action Required: New Travel Requisition",
          htmlBody: directorHtmlBody,
        });
      });

      // Lets notify the involved parties (HR, the hod and the submitter)

      // Generate user email html
      const userHtmlBody = EmailTemplate({
        rowId: rowId,
        message: `Your travel requisition has been approved by ${name} and has been forwaded to Director Approval for the next approval`,
        title: `Update: Travel Requisition Approved By ${name}.`,
        role: "user",
      });

      // Generate hod email html
      const hodHtmlBody = EmailTemplate({
        rowId: rowId,
        message: `This travel requisition has been approved by ${name} and has been forwaded to Director Approval for the next approval`,
        title: `Update: Travel Requisition Approved By ${name}.`,
        role: "user",
      });

      // Generate hr email html
      const hrHtmlBody = EmailTemplate({
        rowId: rowId,
        message:
          "You have approved this travel requisition. It has been forwarded to Director Approval for the next approval",
        title: "Update: Travel Requisition Approved",
        role: "user",
      });

      // send the emails
      MailApp.sendEmail({
        to: email,
        subject: "Update: Travel Requisition Approved",
        htmlBody: hrHtmlBody,
      });

      MailApp.sendEmail({
        to: hodEmail,
        subject: `Update: Travel Requisition Approved By ${name}`,
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
