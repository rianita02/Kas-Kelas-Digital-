const role = sessionStorage.getItem("kasRole");
const username = sessionStorage.getItem("kasUsername");

if (!role || !username) {
    window.location.replace("index.html");
}

const kunciPengeluaran = "kasDaftarPengeluaran";

function ambilPengeluaran() {
    return JSON.parse(localStorage.getItem(kunciPengeluaran) || "[]");
}

function simpanPengeluaran(data) {
    localStorage.setItem(kunciPengeluaran, JSON.stringify(data));
}

function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}

function tampilkanPengeluaran() {
    const data = ambilPengeluaran();
    const tabel = document.getElementById("riwayatPengeluaran");
    const form = document.getElementById("formPengeluaran");

    document.getElementById("totalPengeluaran").textContent =
        formatRupiah(
            data.reduce((total, item) => total + item.nominal, 0)
        );

    form.style.display = role === "bendahara" ? "block" : "none";
    tabel.replaceChildren();

    data.forEach((item, index) => {
        const baris = document.createElement("tr");

        [
            item.tanggal,
            item.kategori,
            formatRupiah(item.nominal),
            item.keterangan || "-"
        ].forEach(nilai => {
            const sel = document.createElement("td");
            sel.textContent = nilai;
            baris.appendChild(sel);
        });

        const aksi = document.createElement("td");

        if (role === "bendahara") {
            const tombol = document.createElement("button");
            tombol.textContent = "Hapus";
            tombol.className = "action-button delete-button";

            tombol.addEventListener("click", () => {
                if (confirm("Hapus catatan pengeluaran ini?")) {
                    const terbaru = ambilPengeluaran();
                    terbaru.splice(index, 1);
                    simpanPengeluaran(terbaru);
                    tampilkanPengeluaran();
                }
            });

            aksi.appendChild(tombol);
        } else {
            aksi.textContent = "Lihat saja";
        }

        baris.appendChild(aksi);
        tabel.appendChild(baris);
    });
}

document.getElementById("expenseForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        if (role !== "bendahara") {
            alert("Hanya bendahara yang boleh mencatat pengeluaran.");
            return;
        }

        const tanggal = document.getElementById("tanggal").value;
        const kategori = document.getElementById("kategori").value;
        const nominal = Number(document.getElementById("nominal").value);
        const keterangan = document.getElementById("keterangan").value.trim();
        const pesan = document.getElementById("pesanPengeluaran");

        if (!Number.isSafeInteger(nominal) || nominal <= 0) {
            pesan.textContent = "Nominal harus berupa bilangan positif.";
            pesan.style.color = "red";
            return;
        }

        const pemasukan = JSON.parse(
            localStorage.getItem("kasDaftarPemasukan") || "[]"
        );

        const pengeluaran = ambilPengeluaran();

        const totalPemasukan = pemasukan.reduce(
            (total, item) => total + item.nominal, 0
        );

        const totalPengeluaran = pengeluaran.reduce(
            (total, item) => total + item.nominal, 0
        );

        if (nominal > totalPemasukan - totalPengeluaran) {
            pesan.textContent = "Saldo kas tidak mencukupi!";
            pesan.style.color = "red";
            return;
        }

        pengeluaran.push({
            tanggal,
            kategori,
            nominal,
            keterangan
        });

        simpanPengeluaran(pengeluaran);
        this.reset();

        pesan.textContent = "Pengeluaran berhasil dicatat!";
        pesan.style.color = "green";

        tampilkanPengeluaran();
    });

function kembaliDashboard() {
    window.location.href = "dashboard.html";
}

tampilkanPengeluaran();

const roleAksesPengeluaran = sessionStorage.getItem("kasRole");

if (
  roleAksesPengeluaran !== "bendahara" &&
  roleAksesPengeluaran !== null
) {
  document.querySelectorAll(
    '#formPengeluaran, form button[type="submit"]'
  ).forEach(function (elemen) {
    elemen.disabled = true;
  });
}