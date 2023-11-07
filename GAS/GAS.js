/**
 * Handles POST requests.
 * @param {Object} e - The event object containing the request data.
 * @returns {Object} - The response object.
 */
function doPost(e) {
  try {
    // Parse the incoming JSON request body to extract data.
    var requestData = JSON.parse(e.postData.contents);
    var email_address = requestData.email_address;
    var slide_viewed = requestData.slide_viewed;
    
    // Get the active Google Sheet and the usage_report sheet.
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usageReportSheet = ss.getSheetByName('usage_report');
    if (!usageReportSheet) throw new Error("usage_report sheet not found.");

    // Auto-Generation of record_id.
    var lastRow = usageReportSheet.getLastRow();
    var record_id = lastRow === 0 ? 1 : usageReportSheet.getRange(lastRow, 1).getValue() + 1;

    // Auto-population of date_and_time with the current date and time.
    var date_and_time = new Date();

    // Append the new row with the data.
    usageReportSheet.appendRow([record_id, date_and_time, email_address, slide_viewed]);
    
    // Return success response.
    return ContentService.createTextOutput(JSON.stringify({ result: 'Success' }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Error Handling:
    Logger.log(error.toString());
    return ContentService.createTextOutput(JSON.stringify({ result: 'Error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}