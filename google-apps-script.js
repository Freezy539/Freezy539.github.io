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
  FIRST_REQUEST_NUMBER: 1
};

function setup() {
  const ss = getSpreadsheet_();
  getOrCreateSheet_(ss);
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
    const language = detectLanguage_(data);

    sheet.appendRow([
      requestId,
      receivedAt,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.model || '',
      data.transport || '',
      data.location || '',
      language,
      data.message || ''
    ]);
    sendOwnerEmail_(data, requestId, receivedAt, ss.getUrl());
    sendCustomerAutoReply_(data, requestId);

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
  return SpreadsheetApp.openById('1q0NmdEqdUF7ixl4NLj1cZgSckj5Q5ZG3SPbAecf0ih8');
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
      'Transport',
      'Asukoht',
      'Keel',
      'Sõnum',
  ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
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
      <p><b>Transport:</b> ${escapeHtml_(data.transport)}</p>
      <p><b>Asukoht:</b> ${escapeHtml_(data.location)}</p>
      
      <p><b>Sõnum:</b><br>${escapeHtml_(data.message).replace(/\n/g, '<br>')}</p>
      
      <div style="margin-top:20px;margin-bottom:20px">
        <a href="tel:${escapeHtml_(data.phone)}"
           style="display:inline-block;
                  background:#24160f;
                  color:#ffffff;
                  text-decoration:none;
                  padding:12px 18px;
                  border-radius:10px;
                  font-weight:700;
                  margin-right:10px;">
          📞 Helista kliendile
        </a>
      
        <a href="mailto:${escapeHtml_(data.email)}"
           style="display:inline-block;
                  background:#b98255;
                  color:#ffffff;
                  text-decoration:none;
                  padding:12px 18px;
                  border-radius:10px;
                  font-weight:700;">
          ✉️ Saada e-mail
        </a>
      </div>
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
      'Sauna tüüp: ' + (data.model || '') + '\n' +
      'Transport: ' + (data.transport || '') + '\n' +
      'Asukoht: ' + (data.location || '') + '\n\n' +
      'Sõnum:\n' + (data.message || '')  });
}


function detectLanguage_(data) {
  const text = (
    (data.message || '') + ' ' +
    (data.model || '') + ' ' +
    (data.transport || '') + ' ' +
    (data.location || '')
  ).toLowerCase();

  const scores = {
    et: 0,
    en: 0,
    fi: 0,
    sv: 0
  };

  const words = {
    et: ['tere', 'soovin', 'sauna', 'pakkumist', 'transport', 'asukoht', 'hind', 'värv', 'puit', 'keris', 'võimalik', 'oleks'],
    en: ['hello', 'hi', 'want', 'would', 'like', 'sauna', 'quote', 'price', 'transport', 'delivery', 'location', 'wood', 'color', 'colour'],
    fi: ['hei', 'haluan', 'sauna', 'tarjous', 'hinta', 'kuljetus', 'sijainti', 'puu', 'väri', 'kiuas', 'mahdollista'],
    sv: ['hej', 'vill', 'bastu', 'offert', 'pris', 'transport', 'leverans', 'plats', 'trä', 'färg', 'möjligt']
  };

  Object.keys(words).forEach(lang => {
    words[lang].forEach(word => {
      if (text.includes(word)) scores[lang]++;
    });
  });

  let bestLang = 'et';
  let bestScore = scores.et;

  Object.keys(scores).forEach(lang => {
    if (scores[lang] > bestScore) {
      bestLang = lang;
      bestScore = scores[lang];
    }
  });

  return bestScore === 0 ? 'et' : bestLang;
}

function getAutoReplyText_(lang) {
  const texts = {
    et: {
      subject: 'Aitäh päringu eest – ' + CONFIG.COMPANY_NAME,
      received: 'Päring vastu võetud',
      hello: 'Tere',
      intro: 'Aitäh päringu eest. Teie päring on edukalt vastu võetud ning vaatame selle esimesel võimalusel üle.',
      summary: 'Kokkuvõte',
      saunaType: 'Sauna tüüp:',
      message: 'Teie sõnum:',
      follow: 'Jälgi meid',
      replyInfo: 'Kui soovite midagi lisada, vastake lihtsalt sellele kirjale.'
    },
    en: {
      subject: 'Thank you for your request – ' + CONFIG.COMPANY_NAME,
      received: 'Request received',
      hello: 'Hello',
      intro: 'Thank you for your request. We have received it successfully and will review it as soon as possible.',
      summary: 'Summary',
      saunaType: 'Sauna type:',
      message: 'Your message:',
      follow: 'Follow us',
      replyInfo: 'If you would like to add anything, simply reply to this email.'
    },
    fi: {
      subject: 'Kiitos yhteydenotostasi – ' + CONFIG.COMPANY_NAME,
      received: 'Pyyntö vastaanotettu',
      hello: 'Hei',
      intro: 'Kiitos yhteydenotostasi. Olemme vastaanottaneet pyyntösi ja palaamme asiaan mahdollisimman pian.',
      summary: 'Yhteenveto',
      saunaType: 'Saunan tyyppi:',
      message: 'Viestisi:',
      follow: 'Seuraa meitä',
      replyInfo: 'Jos haluatte lisätä jotain, voitte vastata suoraan tähän sähköpostiin.'
    },
    sv: {
      subject: 'Tack för din förfrågan – ' + CONFIG.COMPANY_NAME,
      received: 'Förfrågan mottagen',
      hello: 'Hej',
      intro: 'Tack för din förfrågan. Vi har tagit emot den och återkommer så snart som möjligt.',
      summary: 'Sammanfattning',
      saunaType: 'Bastutyp:',
      message: 'Ditt meddelande:',
      follow: 'Följ oss',
      replyInfo: 'Om du vill lägga till något kan du bara svara på detta e-postmeddelande.'
    }
  };

  return texts[lang] || texts.et;
}


function sendCustomerAutoReply_(data, requestId) {
  const lang = detectLanguage_(data);
  const t = getAutoReplyText_(lang);

  const subject = t.subject;

  const htmlBody = `
    <div style="margin:0;padding:0;background:#f3eee8;font-family:Arial,Helvetica,sans-serif;color:#2b1b12">
      <div style="max-width:660px;margin:0 auto;padding:38px 14px">
        <div style="background:#24160f;border-radius:24px 24px 0 0;padding:32px 32px 30px;color:#ffffff;border-bottom:4px solid #b98255">
          <p style="margin:0 0 12px;color:#d8b18d;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${t.received}</p>
          <h1 style="margin:0;font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-.3px">${CONFIG.COMPANY_NAME}</h1>
        </div>

        <div style="background:#ffffff;border-left:1px solid #eaded0;border-right:1px solid #eaded0;padding:30px 32px 28px;box-shadow:0 18px 45px rgba(38,24,16,.10)">
          <h2 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#2b1b12">${t.hello}, ${escapeHtml_(data.name)}!</h2>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.65;color:#4b382b">${t.intro}</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#6b5544">${t.replyInfo}</p>

          <div style="background:#fbf8f4;border:1px solid #eaded0;border-radius:18px;padding:20px 20px 18px;margin:24px 0">
            <p style="margin:0 0 14px;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#9a6b45">${t.summary}</p>
            <p style="margin:0 0 10px;font-size:15px;color:#4b382b"><b style="color:#2b1b12">${t.saunaType}</b> ${escapeHtml_(data.model)}</p>
            <p style="margin:0;font-size:15px;line-height:1.65;color:#4b382b"><b style="color:#2b1b12">${t.message}</b><br>${escapeHtml_(data.message).replace(/\n/g, '<br>')}</p>
          </div>
        </div>

        <div style="background:#fbf8f4;border:1px solid #eaded0;border-top:0;border-radius:0 0 24px 24px;padding:24px 32px 30px;text-align:center;box-shadow:0 18px 45px rgba(38,24,16,.10)">
          <p style="margin:0 0 14px;color:#6f5543;font-size:14px;font-weight:700;letter-spacing:.3px">${t.follow}</p>
          <a href="${CONFIG.INSTAGRAM_URL}" style="display:inline-block;background:#24160f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;margin:5px;font-size:14px;font-weight:800;letter-spacing:.2px">Instagram</a>
          <a href="${CONFIG.TIKTOK_URL}" style="display:inline-block;background:#24160f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;margin:5px;font-size:14px;font-weight:800;letter-spacing:.2px">TikTok</a>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody,
    body:
      t.hello + ', ' + (data.name || '') + '!\n\n' +
      t.intro + '\n\n' +
      t.summary + '\n' +
      t.saunaType + ' ' + (data.model || '') + '\n\n' +
      t.message + '\n' + (data.message || '')
  });
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

function doGet(e) {
  return ContentService
    .createTextOutput('OutDoorSauna päringusüsteem töötab. Vorm saadab andmed POST päringuga.')
    .setMimeType(ContentService.MimeType.TEXT);
}