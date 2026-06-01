/*
  OutDoorSauna päringuvorm: Google Sheets + Gmail + automaatvastus

  KUIDAS KASUTADA:
  1) Mine https://script.google.com ja loo uus projekt.
  2) Kleebi see kood Code.gs faili.
  3) Vajuta Run > setup. Luba õigused.
  4) Ava loodud Google Sheet Drive'is. Link ilmub Executions/logidesse.
  5) Deploy > New deployment > Web app.
     Execute as: Me
     Who has access: Anyone
  6) Kopeeri Web App URL ja pane script.js failis GOOGLE_SCRIPT_URL väärtuseks.

  NB! Kiri tuleb Gmailis tehniliselt sinu Google konto alt, sest Google ei luba veebilehel
  suvalise kliendi e-maili aadressilt kirju saata. Kliendi e-mail läheb Reply-To väljale.
*/

const CONFIG = {
  TO_EMAIL: 'kethontaevere1@gmail.com',
  COMPANY_NAME: 'OutDoorSauna',
  COMPANY_PHONE: '+372 56999913',
  INSTAGRAM_URL: 'https://www.instagram.com/outdoorsaunaeu/',
  TIKTOK_URL: 'https://www.tiktok.com/@outdoorsaunaeu',
  SITE_URL: 'https://freezy539.github.io',
  SHEET_NAME: 'Päringud',
  STATS_SHEET_NAME: 'Statistika',
  FIRST_REQUEST_NUMBER: 1
};

function setup() {
  const ss = getSpreadsheet_();
  getOrCreateSheet_(ss);
  updateStats_(ss);
  Logger.log('Google Sheet valmis: ' + ss.getUrl());
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    validate_(data);

    const ss = getSpreadsheet_();
    const sheet = getOrCreateSheet_(ss);
    const requestNumber = getNextRequestNumber_(sheet);
    const requestId = 'Päring #' + requestNumber;
    const now = new Date();

    const weekdays = [
      'Pühapäev',
      'Esmaspäev',
      'Teisipäev',
      'Kolmapäev',
      'Neljapäev',
      'Reede',
      'Laupäev'
    ];

    const months = [
      'Jaanuar',
      'Veebruar',
      'Märts',
      'Aprill',
      'Mai',
      'Juuni',
      'Juuli',
      'August',
      'September',
      'Oktoober',
      'November',
      'Detsember'
    ];

    const receivedAt = `${weekdays[now.getDay()]} I ${now.getDate()}. ${months[now.getMonth()]} I ${now.getFullYear()} I ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    sheet.appendRow([
      requestId,
      receivedAt,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.model || '',
      data.message || '',
      'Uus',
      data.source || '',
      data.createdAt || ''
    ]);

    sendOwnerEmail_(data, requestId, receivedAt, ss.getUrl());
    sendCustomerAutoReply_(data, requestId);
    updateStats_(ss);

    return json_({ ok: true, requestId: requestId });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function validate_(data) {
  if (!data.name) throw new Error('Nimi puudub.');
  if (!data.email) throw new Error('E-mail puudub.');
  if (!data.phone) throw new Error('Telefon puudub.');
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty('SPREADSHEET_ID');

  if (existingId) {
    return SpreadsheetApp.openById(existingId);
  }

  const ss = SpreadsheetApp.create('OutDoorSauna päringud');
  props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}

function getOrCreateSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Päringu nr',
      'Aeg',
      'Nimi',
      'E-mail',
      'Telefon',
      'Sauna tüüp',
      'Sõnum',
      'Staatus',
      'Lehe URL',
      'Brauseri aeg'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 10);
  }
  return sheet;
}

function getNextRequestNumber_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return CONFIG.FIRST_REQUEST_NUMBER;

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const numbers = values
    .map(v => String(v).match(/#(\d+)/))
    .filter(Boolean)
    .map(m => Number(m[1]));

  if (!numbers.length) return CONFIG.FIRST_REQUEST_NUMBER;
  return Math.max(...numbers) + 1;
}

function sendOwnerEmail_(data, requestId, receivedAt, sheetUrl) {
  const subject = requestId + ' – uus sauna päring';
  const htmlBody = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222">
      <h2 style="margin:0 0 12px">${requestId}</h2>
      <p><b>Aeg:</b> ${receivedAt}</p>
      <p><b>Nimi:</b> ${escapeHtml_(data.name)}</p>
      <p><b>E-mail:</b> ${escapeHtml_(data.email)}</p>
      <p><b>Telefon:</b> ${escapeHtml_(data.phone)}</p>
      <p><b>Sauna tüüp:</b> ${escapeHtml_(data.model)}</p>
      <p><b>Sõnum:</b><br>${escapeHtml_(data.message).replace(/\n/g, '<br>')}</p>
      <p><a href="${sheetUrl}">Ava Google Sheets tabel</a></p>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.TO_EMAIL,
    subject: subject,
    replyTo: data.email || '',
    htmlBody: htmlBody,
    body:
      requestId + '\n\n' +
      'Nimi: ' + (data.name || '') + '\n' +
      'E-mail: ' + (data.email || '') + '\n' +
      'Telefon: ' + (data.phone || '') + '\n' +
      'Sauna tüüp: ' + (data.model || '') + '\n\n' +
      'Sõnum:\n' + (data.message || '') + '\n\n' +
      'Google Sheet: ' + sheetUrl
  });
}

function sendCustomerAutoReply_(data, requestId) {
  const subject = 'Aitäh päringu eest – ' + CONFIG.COMPANY_NAME + ' / Thank you for your request';
  const htmlBody = `
    <div style="margin:0;padding:0;background:#f3eee8;font-family:Arial,Helvetica,sans-serif;color:#2b1b12">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">
        Aitäh päringu eest. Teie päring on edukalt vastu võetud.
      </div>

      <div style="max-width:660px;margin:0 auto;padding:38px 14px">
        <div style="background:#24160f;border-radius:24px 24px 0 0;padding:32px 32px 30px;color:#ffffff;border-bottom:4px solid #b98255">
          <p style="margin:0 0 12px;color:#d8b18d;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Päring vastu võetud</p>
          <h1 style="margin:0;font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-.3px">${CONFIG.COMPANY_NAME}</h1>
          <p style="margin:13px 0 0;color:#ead8c6;font-size:14px;line-height:1.5">Aitäh, et võtsite meiega ühendust. Vastame esimesel võimalusel.</p>
        </div>

        <div style="background:#ffffff;border-left:1px solid #eaded0;border-right:1px solid #eaded0;padding:30px 32px 28px;box-shadow:0 18px 45px rgba(38,24,16,.10)">
          <h2 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#2b1b12">Tere, ${escapeHtml_(data.name)}!</h2>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.65;color:#4b382b">Aitäh päringu eest. Teie päring on edukalt vastu võetud ning vaatame selle esimesel võimalusel üle.</p>

          <div style="background:#fbf8f4;border:1px solid #eaded0;border-radius:18px;padding:20px 20px 18px;margin:24px 0">
            <p style="margin:0 0 14px;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#9a6b45">Päringu kokkuvõte</p>
            <p style="margin:0 0 10px;font-size:15px;color:#4b382b"><b style="color:#2b1b12">Päringu number:</b> ${requestId}</p>
            <p style="margin:0 0 10px;font-size:15px;color:#4b382b"><b style="color:#2b1b12">Sauna tüüp:</b> ${escapeHtml_(data.model)}</p>
            <p style="margin:0;font-size:15px;line-height:1.65;color:#4b382b"><b style="color:#2b1b12">Teie sõnum:</b><br>${escapeHtml_(data.message).replace(/\n/g, '<br>')}</p>
          </div>

          <div style="height:1px;background:#eaded0;margin:28px 0"></div>

          <h2 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#2b1b12">Hello, ${escapeHtml_(data.name)}!</h2>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#4b382b">Thank you for your request. We have received it successfully and will review it as soon as possible.</p>
          <p style="margin:0;font-size:15px;color:#4b382b"><b style="color:#2b1b12">Sauna type:</b> ${escapeHtml_(data.model)}</p>
        </div>

        <div style="background:#fbf8f4;border:1px solid #eaded0;border-top:0;border-radius:0 0 24px 24px;padding:24px 32px 30px;text-align:center;box-shadow:0 18px 45px rgba(38,24,16,.10)">
          <p style="margin:0 0 14px;color:#6f5543;font-size:14px;font-weight:700;letter-spacing:.3px">Jälgi meid / Follow us</p>
          <a href="${CONFIG.INSTAGRAM_URL}" style="display:inline-block;background:#24160f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;margin:5px;font-size:14px;font-weight:800;letter-spacing:.2px">Instagram</a>
          <a href="${CONFIG.TIKTOK_URL}" style="display:inline-block;background:#24160f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;margin:5px;font-size:14px;font-weight:800;letter-spacing:.2px">TikTok</a>
          <p style="margin:22px 0 0;color:#6b5a4c;font-size:14px;line-height:1.65">${CONFIG.COMPANY_NAME}<br>Telefon: ${CONFIG.COMPANY_PHONE}</p>
        </div>
      </div>
    </div>
  `;
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody,
    body:
      'Tere, ' + (data.name || '') + '!\n\n' +
      'Aitäh päringu eest. Teie päring on edukalt vastu võetud.\n' +
      requestId + '\n\n' +
      'Hello, ' + (data.name || '') + '!\n\n' +
      'Thank you for your request. We have received it successfully.\n\n' +
      CONFIG.COMPANY_NAME + '\nTelefon: ' + CONFIG.COMPANY_PHONE
  });
}

function updateStats_(ss) {
  const sheet = getOrCreateSheet_(ss);
  let stats = ss.getSheetByName(CONFIG.STATS_SHEET_NAME);
  if (!stats) stats = ss.insertSheet(CONFIG.STATS_SHEET_NAME);

  const lastRow = sheet.getLastRow();
  const total = Math.max(0, lastRow - 1);
  let newCount = 0;
  let answeredCount = 0;
  let doneCount = 0;

  if (total > 0) {
    const statuses = sheet.getRange(2, 8, total, 1).getValues().flat();
    newCount = statuses.filter(v => String(v).toLowerCase() === 'uus').length;
    answeredCount = statuses.filter(v => String(v).toLowerCase() === 'vastatud').length;
    doneCount = statuses.filter(v => String(v).toLowerCase() === 'tehtud').length;
  }

  stats.clear();
  stats.appendRow(['Näitaja', 'Väärtus']);
  stats.appendRow(['Päringuid kokku', total]);
  stats.appendRow(['Uued', newCount]);
  stats.appendRow(['Vastatud', answeredCount]);
  stats.appendRow(['Tehtud', doneCount]);
  stats.appendRow(['Viimati uuendatud', new Date()]);
  stats.getRange(1, 1, 1, 2).setFontWeight('bold');
  stats.autoResizeColumns(1, 2);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
