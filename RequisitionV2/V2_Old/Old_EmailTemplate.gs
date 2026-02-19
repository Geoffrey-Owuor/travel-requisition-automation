function EmailTemplate({ rowId, message, title, role, reviewLink }) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const lastCol = sheet.getLastColumn();
  const values = sheet.getRange(rowId, 2, 1, lastCol - 1).getValues()[0];

  // Destructuring for clarity
  const [
    emailAddress,
    employeeName,
    department,
    designation,
    destination,
    departureDate,
    returnDate,
    travelCategory,
    businessJustification,
    modeOfTransport,
    perDiemPolicy,
    estimatedCost,
    costCentre,
    withinBudget,
    approvalTier,
    hodApprover,
    hodEmail,
    hodComments,
    hrApprover,
    hrEmail,
    hrComments,
    directorApprover,
    directorEmail,
    directorComments,
    hodApprovalStatus,
    hrApprovalStatus,
    directorApprovalStatus,
  ] = values;

  // Formatted dates
  const formattedDepartureDate = dateFormatter(departureDate);
  const formattedReturnDate = dateFormatter(returnDate);

  // Logic: Only show the button if the role is NOT "user"
  const buttonStyle = role !== "user" ? "display: block;" : "display: none;";

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">${title}</h2>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #2c3e50; margin-bottom: 25px;">${message}</p>
        
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr>
              <th colspan="2" style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #1a1a1a; border-bottom: 2px solid #1a1a1a; font-size: 14px; text-transform: uppercase;">Travel Details</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%; color: #555;">Employee:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${employeeName}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%; color: #555;">Submitter Email:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${emailAddress}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Department:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${department}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Designation:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${designation}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Destination:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${destination}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Travel Category:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${travelCategory}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Business Justification:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 600;">${businessJustification}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Mode of Transport:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 600;">${modeOfTransport}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Per diem Policy:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 600;">${perDiemPolicy}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Approval Tier:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 600;">${approvalTier}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Cost Centre:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 600;">${costCentre}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Within Budget:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 600;">${withinBudget}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Travel Dates:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${formattedDepartureDate} to ${formattedReturnDate}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Estimated Cost:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #28a745; font-weight: 600;">KES ${estimatedCost}</td></tr>
          </tbody>
        </table>

        <br>

        <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr>
              <th colspan="2" style="text-align: left; padding: 12px 15px; background-color: #f8f9fa; color: #1a1a1a; border-bottom: 2px solid #1a1a1a; font-size: 14px; text-transform: uppercase;">Approval Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HOD Status:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${hodApprovalStatus || "N/A"}</td></tr>
             <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HOD Approver:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-style: italic; color: #666;">${hodApprover || "N/A"}</td></tr>
             <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HOD Email:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-style: italic; color: #666;">${hodEmail || "N/A"}</td></tr>
             <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HOD Comments:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-style: italic; color: #666;">${hodComments || "None"}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HR Status:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${hrApprovalStatus || "N/A"}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HR Approver:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-style: italic; color: #666;">${hrApprover || "N/A"}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HR Email:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-style: italic; color: #666;">${hrEmail || "N/A"}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">HR Comments:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-style: italic; color: #666;">${hrComments || "None"}</td></tr>
            <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Director Status:</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${directorApprovalStatus || "N/A"}</td></tr>
            <tr><td style="padding: 10px 15px; font-weight: bold; color: #555;">Director Approver:</td><td style="padding: 10px 15px; font-style: italic; color: #666;">${directorApprover || "N/A"}</td></tr>
            <tr><td style="padding: 10px 15px; font-weight: bold; color: #555;">Director Email:</td><td style="padding: 10px 15px; font-style: italic; color: #666;">${directorEmail || "N/A"}</td></tr>
            <tr><td style="padding: 10px 15px; font-weight: bold; color: #555;">Director Comments:</td><td style="padding: 10px 15px; font-style: italic; color: #666;">${directorComments || "None"}</td></tr>
          </tbody>
        </table>

        <div style="${buttonStyle} margin-top: 35px; text-align: center;">
          <a href="${reviewLink}" style="background-color: #1a1a1a; color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block; font-size: 14px; letter-spacing: 1px;">REVIEW REQUISITION</a>
        </div>
      </div>

      <div style="background-color: #f9f9f9; color: #888; padding: 25px; text-align: center; font-size: 11px;">
        <p style="margin: 0 0 5px 0;">This is an automated email.</p>
        <p style="margin: 0; font-weight: 600;">&copy; ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
      </div>
    </div>
  `;

  return emailHtml;
}
