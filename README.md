# Travel Requisition Automation

This Google Apps Script project automates the travel requisition process, allowing employees to submit travel requests via a Google Form, which are then routed for approval by HR and a Director. The system provides email notifications and a web-based interface for reviewers to approve or decline requests.

## Table of Contents

- [Overview](#overview)
- [Workflow](#workflow)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Overview

The Travel Requisition Automation system streamlines the approval process by eliminating manual email threads and paper forms. It uses a Google Sheet as a database and a deployed Google Apps Script Web App for the approval interface.

## Workflow

1.  **Submission**: An employee fills out a Google Form for a travel requisition.
2.  **HR Review**: An email is sent to the designated HR approver. They click a link to review the request.
    - **Approve**: Request moves to the Director stage.
    - **Decline**: Process ends, and the employee is notified.
3.  **Director Review**: If HR approves, an email is sent to the selected Director.
    - **Approve**: Request is fully approved, and the employee is notified.
    - **Decline**: Process ends, and the employee/HR are notified.
4.  **Notifications**: At each step, relevant parties (Employee, HR, Director) receive email updates with the current status.

## Features

- **Automated Email Notifications**: Real-time updates for all actions.
- **Web-Based Approval Interface**: A clean, responsive UI for approvers to review details and leave comments.
- **Multi-Stage Approval**: Supports sequential approval (HR -> Director).
- **Status Tracking**: Updates the Google Sheet with approval status and comments.
- **Secure Access**: Approvers can only act on requests via the generated secure links.

## Project Structure

- **`Code.gs`**: Contains the core logic, including the `onFormSubmit` trigger and configuration maps (`DIRECTOR_MAP`, `HR_MAP`).
- **`WebApp.gs`**: Handles the Web App GET requests (`doGet`) and processes reviews (`processReview`).
- **`EmailTemplate.gs`**: Generates HTML email bodies for notifications, including dynamic data from the sheet.
- **`Review.html`**: The HTML template for the approval interface.
- **`AlreadyProcessed.html`**: A fallback page shown if a request has already been acted upon.

## Setup & Installation

To set up this project, follow these steps:

1.  **Create a Google Form**:
    - Create a form with fields matching the script's expectations (e.g., Employee Name, Department, Purpose, Destination, Travel Dates, Budget, Director Approver, HR Approver).
    - Ideally, use dropdowns for "Director Approver" and "HR Approver" to match the keys in the configuration maps.

2.  **Link to Google Sheet**:
    - Connect the form to a new Google Sheet.
    - Open the Sheet.

3.  **Open Script Editor**:
    - In the Sheet, go to **Extensions** > **Apps Script**.

4.  **Copy Files**:
    - Copy the contents of `Code.gs`, `WebApp.gs`, `EmailTemplate.gs`, `Review.html`, and `AlreadyProcessed.html` into the script editor.
    - Ensure file names match exactly.

5.  **Deploy as Web App**:
    - Click **Deploy** > **New deployment**.
    - Select **Type**: **Web app**.
    - **Execute as**: `Me` (your account).
    - **Who has access**: `Anyone with Google Account` or `Anyone` (depending on your organization's policy).
    - Click **Deploy**.
    - **Copy the Web App URL**.

6.  **Update Script URL**:
    - Open `EmailTemplate.gs`.
    - Replace the `webAppUrl` variable with your new Web App URL from step 5.
    - Save the file.
    - _Note: You may need to deploy again (Manage deployments > Edit > New version) to update the code with the correct URL._

7.  **Set Up Triggers**:
    - In the Apps Script editor, go to **Triggers** (alarm clock icon).
    - Click **+ Add Trigger**.
    - **Function to run**: `onFormSubmit`.
    - **Event source**: `From spreadsheet`.
    - **Event type**: `On form submit`.
    - Save.

## Configuration

### Approver Mappings

In `Code.gs`, update the `DIRECTOR_MAP` and `HR_MAP` objects with the actual names and email addresses of your approvers.

```javascript
// Example in Code.gs
const DIRECTOR_MAP = {
  "Director Name 1": "director1@example.com",
  "Director Name 2": "director2@example.com",
};

const HR_MAP = {
  "HR Name 1": "hr1@example.com",
};
```

Ensure the names in the keys match exactly with the options in your Google Form dropdowns.

### Column Configuration

The script relies on specific column names in the Google Sheet. Ensure your sheet headers (Row 1) match what the script expects or update the script logic in `onFormSubmit` (in `Code.gs`) and `processReview` (in `WebApp.gs`) to match your form.

Key columns expected:

- `Email Address` (automatically collected or manual entry)
- `Director Approver`
- `HR Approver`
- `HR Approval Status` (Created by script)
- `HR Email` (Created by script)
- `Director Approval Status` (Created by script)
- `Director Email` (Created by script)
- `HR Comments` (Created by script)
- `Director Comments` (Created by script)

## Usage

1.  **Requester**: Submits the Google Form.
2.  **System**:
    - Detects submission.
    - Looks up approver emails.
    - Sets initial status to "pending".
    - Sends email to HR.
3.  **Approver (HR/Director)**:
    - Clicks "REVIEW REQUISITION" in the email.
    - Views the details in the web app.
    - Adds comments (optional).
    - Clicks **Approve** or **Decline**.
    - Only one action is allowed per stage.

## Troubleshooting

- **Permissions**: Ensure the script is deployed as "Execute as: Me" so it has permission to send emails and edit the sheet.
- **Triggers**: If emails aren't sending, check the Triggers execution log in the Apps Script dashboard for errors.
- **Column Names**: If the script fails to update status, verify that the column names in the Sheet match the headers expected in the code.

N/B: Most of this documentation is AI-generated.
