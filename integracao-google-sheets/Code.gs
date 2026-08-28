const SPREADSHEET_ID = "1yFNJewVii1I1wTQ0FZhGb9__wWle6CJjjSsn-b8XNsY";
const SHEET_NAME = "Página1";

function cleanCell(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents || "{}");
    const name = cleanCell(data.nome);
    const phone = cleanCell(data.telefone);
    const profile = cleanCell(data.perfil);
    const course = cleanCell(data.curso);

    if (!name || !phone) {
      throw new Error("Nome e telefone são obrigatórios.");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("A página Página1 não foi encontrada.");
    }

    const nextRow = Math.max(sheet.getLastRow() + 1, 3);
    sheet.getRange(nextRow, 1, 1, 3).setValues([
      [name, phone, [profile, course].filter(Boolean).join(" / ")],
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (error) {}
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online" }))
    .setMimeType(ContentService.MimeType.JSON);
}
