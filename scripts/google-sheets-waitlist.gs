/**
 * FREE waitlist storage — Google Sheets + optional email ping.
 *
 * Setup (5 min, $0):
 * 1. New Google Sheet → name a tab "Waitlist" with headers in row 1:
 *    Timestamp | Email | Company | Role | Source
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Set NOTIFY_EMAIL below to your inbox (or leave blank)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL → Vercel env WAITLIST_WEBHOOK_URL = that URL
 * 6. Redeploy molar.it on Vercel
 *
 * Each signup appends a row. You can sort, filter, export CSV anytime.
 */

const NOTIFY_EMAIL = 'pratik@molar.it'; // set '' to disable email alerts

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Waitlist')
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const row = [
      data.createdAt || new Date().toISOString(),
      data.email || '',
      data.company || '',
      data.role || '',
      data.source || '',
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL && data.email) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: '[Molar waitlist] ' + (data.source || 'signup') + ' — ' + data.email,
        body: [
          'New waitlist signup',
          '',
          'Email: ' + data.email,
          'Company: ' + (data.company || '—'),
          'Role: ' + (data.role || '—'),
          'Source: ' + (data.source || '—'),
          'Time: ' + row[0],
        ].join('\n'),
      });
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, code) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  // Apps Script web apps don't set HTTP status codes easily; body carries ok/error.
  return out;
}
