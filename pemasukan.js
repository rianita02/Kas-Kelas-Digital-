const role = sessionStorage.getItem("kasRole");
const username = sessionStorage.getItem("kasUsername");

if (!role || !username) {
    window.location.replace("index.html");
}

const kunciPemasukan = "kasDaftarPemasukan";

function ambilPemasukan() {
    return JSON.parse(localStorage.getItem(kunciPemasukan) || "[]");
}

function rupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}

function simpanPemasukan(data) {
    localStorage.setItem(kunciPemasukan, JSON.stringify(data));
}

function tampilkanPemasukan() {
    const data = ambilPemasukan();
    const tabel = document.getElementById("riwayatPemasukan");
    const form = document.getElementById("formPemasukan");

    document.getElementById("totalPemasukan").textContent =
        rupiah(data.reduce((total, item) => total + item.nominal, 0));

    form.style.display = role === "bendahara" ? "block" : "none";
    tabel.replaceChildren();

    data.forEach((item, index) => {
        const baris = document.createElement("tr");

        [
            item.tanggal,
            item.nis,
            item.nama,
            item.bulan,
            rupiah(item.nominal),
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
                if (confirm("Hapus catatan pembayaran ini?")) {
                    const terbaru = ambilPemasukan();
                    terbaru.splice(index, 1);
                    simpanPemasukan(terbaru);
                    tampilkanPemasukan();
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

document.getElementById("paymentForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        if (role !== "bendahara") {
            alert("Hanya bendahara yang boleh mencatat pembayaran.");
            return;
        }

        const nis = document.getElementById("nis").value.trim();
        const nama = document.getElementById("namaSiswa").value.trim();
        const tanggal = document.getElementById("tanggal").value;
        const bulan = document.getElementById("bulan").value;
        const nominal = Number(document.getElementById("nominal").value);
        const keterangan = document.getElementById("keterangan").value.trim();
        const pesan = document.getElementById("pesanPemasukan");

        if (!Number.isSafeInteger(nominal) || nominal <= 0) {
            pesan.textContent = "Nominal harus berupa bilangan positif.";
            pesan.style.color = "red";
            return;
        }

        const siswa = JSON.parse(localStorage.getItem("kasDaftarSiswa") || "[]");

        if (!siswa.some(item => item.nis === nis && item.nama === nama)) {
            pesan.textContent =
                "NIS dan nama harus cocok dengan data siswa yang terdaftar.";
            pesan.style.color = "red";
            return;
        }

        const data = ambilPemasukan();

        const sudahBayar = data.some(item =>
            item.nis === nis && item.bulan === bulan &&
            item.tanggal.slice(0, 4) === tanggal.slice(0, 4)
        );

        if (sudahBayar) {
            pesan.textContent =
                "Pembayaran siswa untuk bulan dan tahun tersebut sudah tercatat.";
            pesan.style.color = "red";
            return;
        }

        data.push({
            nis,
            nama,
            tanggal,
            bulan,
            nominal,
            keterangan
        });

        simpanPemasukan(data);
        this.reset();

        pesan.textContent = "Pembayaran berhasil dicatat!";
        pesan.style.color = "green";

        tampilkanPemasukan();
    });

function kembaliDashboard() {
    window.location.href = "dashboard.html";
}

tampilkanPemasukan();

const roleAksesPemasukan = sessionStorage.getItem("kasRole");

if (
  roleAksesPemasukan !== "bendahara" &&
  roleAksesPemasukan !== null
) {
  document.querySelectorAll(
    '#formPemasukan, form button[type="submit"]'
  ).forEach(function (elemen) {
    elemen.disabled = true;
  });
}