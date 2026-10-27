const role = sessionStorage.getItem("kasRole");
const username = sessionStorage.getItem("kasUsername");

if (!role || !username) {
    window.location.replace("index.html");
}

const bulanSelect = document.getElementById("bulan");
const tahunInput = document.getElementById("tahun");
const tabel = document.getElementById("daftarStatus");

const bulanSekarang = new Date().getMonth();
bulanSelect.selectedIndex = bulanSekarang;
tahunInput.value = new Date().getFullYear();

function kembaliDashboard() {
    window.location.href = "dashboard.html";
}

function periksaPembayaran() {
    const siswa = JSON.parse(
        localStorage.getItem("kasDaftarSiswa") || "[]"
    );

    const pemasukan = JSON.parse(
        localStorage.getItem("kasDaftarPemasukan") || "[]"
    );

    const bulan = bulanSelect.value;
    const tahun = Number(tahunInput.value);

    tabel.replaceChildren();

    if (!Number.isInteger(tahun) || tahun < 2000 || tahun > 2100) {
        document.getElementById("pesanStatus").textContent =
            "Masukkan tahun antara 2000 sampai 2100.";
        return;
    }

    let jumlahSudah = 0;
    let jumlahBelum = 0;

    siswa.forEach((item, index) => {
        const sudah = pemasukan.some(transaksi => {
            return transaksi.nis === item.nis &&
                transaksi.bulan === bulan &&
                transaksi.tanggal.slice(0, 4) === String(tahun);
        });

        const status = sudah ? "Sudah Membayar" : "Belum Membayar";

        if (sudah) {
            jumlahSudah++;
        } else {
            jumlahBelum++;
        }

        const baris = document.createElement("tr");

        [index + 1, item.nis, item.nama, status].forEach(nilai => {
            const sel = document.createElement("td");
            sel.textContent = nilai;
            baris.appendChild(sel);
        });

        tabel.appendChild(baris);
    });

    document.getElementById("sudahBayar").textContent =
        jumlahSudah + " siswa";

    document.getElementById("belumBayar").textContent =
        jumlahBelum + " siswa";

    document.getElementById("pesanStatus").textContent =
        siswa.length === 0
            ? "Belum ada data siswa. Tambahkan siswa terlebih dahulu."
            : "Pemeriksaan pembayaran selesai.";
}

document.getElementById("tombolPeriksa")
    .addEventListener("click", periksaPembayaran);

periksaPembayaran();