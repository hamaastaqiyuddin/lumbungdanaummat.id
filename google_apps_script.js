var SHEET_NAME = "Ramadhan Planner"; // Sesuaikan dengan nama tab di Google Sheet Anda

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = doc.getSheetByName(SHEET_NAME);

        // Jika sheet tidak ditemukan, buat baru atau gunakan yang aktif
        if (!sheet) {
            sheet = doc.getActiveSheet();
        }

        // Persiapkan Header jika sheet masih kosong
        if (sheet.getLastRow() === 0) {
            var headers = ["Timestamp", "Nama", "WhatsApp", "Email", "Infaq"];
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
            sheet.setFrozenRows(1);
        }

        // Ambil data dari parameter (FormData)
        // App.jsx mengirim: name, wa, email, infaq
        var timestamp = new Date();
        var name = e.parameter.name || "";
        var wa = e.parameter.wa || "";
        var email = e.parameter.email || "";
        var infaq = e.parameter.infaq || "";

        // Format Infaq agar mudah dibaca (opsional, tapi bagus untuk spreadsheet)
        // Biarkan raw atau format sesuai selera. Kita simpan raw dulu.

        // Susun baris baru
        var newRow = [timestamp, name, wa, email, infaq];

        // Simpan ke sheet
        sheet.appendRow(newRow);

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function setup() {
    // Jalankan fungsi ini sekali (Run -> setup) untuk inisialisasi sheet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);
    if (!sheet) {
        // Jika belum ada, gunakan active sheet dan rename jika perlu, atau biarkan user manual
        sheet = doc.getActiveSheet();
    }

    if (sheet.getLastRow() === 0) {
        var headers = ["Timestamp", "Nama", "WhatsApp", "Email", "Infaq"];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.setFrozenRows(1);
    }
}
