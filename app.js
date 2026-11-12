
const STORAGE_KEY = "wa_report_history_v1";

function getReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function saveReport() {
  const number = document.getElementById("number").value.trim();
  const category = document.getElementById("category").value;
  const reason = document.getElementById("reason").value.trim();

  if (!/^\+?[0-9\s-]{8,20}$/.test(number)) {
    alert("Masukkan nomor WhatsApp yang valid.");
    return;
  }

  if (!category || reason.length < 10) {
    alert("Pilih kategori dan tulis alasan minimal 10 karakter.");
    return;
  }

  const reports = getReports();

  reports.unshift({
    id: Date.now(),
    number,
    category,
    reason,
    status: "Belum dikirim",
    date: new Date().toLocaleString("id-ID")
  });

  saveReports(reports);

  document.getElementById("number").value = "";
  document.getElementById("category").value = "";
  document.getElementById("reason").value = "";

  renderHistory();
  alert("Laporan berhasil disimpan di perangkat.");
}

function renderHistory() {
  const reports = getReports();
  const container = document.getElementById("history");

  document.getElementById("total").textContent = reports.length;

  if (!reports.length) {
    container.innerHTML =
      '<p class="empty">Belum ada riwayat laporan.</p>';
    return;
  }

  container.innerHTML = reports.map(report => `
    <div class="report-item">
      <h4>${escapeHTML(report.category)}</h4>
      <p>Nomor: ${escapeHTML(report.number)}</p>
      <p>Alasan: ${escapeHTML(report.reason)}</p>
      <p>Status: ${escapeHTML(report.status)}</p>
      <p>Tanggal: ${escapeHTML(report.date)}</p>
      <button onclick="deleteReport(${report.id})">
        HAPUS ITEM
      </button>
    </div>
  `).join("");
}

function deleteReport(id) {
  if (!confirm("Hapus riwayat ini?")) return;

  const reports = getReports().filter(report => report.id !== id);

  saveReports(reports);
  renderHistory();
}

function clearHistory() {
  if (!confirm("Yakin hapus seluruh riwayat?")) return;

  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

function officialReport() {
  window.open(
    "https://www.whatsapp.com/contact/",
    "_blank",
    "noopener,noreferrer"
  );
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

renderHistory();
