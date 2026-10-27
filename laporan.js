const role = sessionStorage.getItem("kasRole");
const username = sessionStorage.getItem("kasUsername");

if (!role || !username) {
    window.location.replace("index.html");
}

function kembaliDashboard() {
    window.location.href = "dashboard.html";
}

function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}

function bacaData(kunci) {
    try {
        const data = JSON.parse(localStorage.getItem(kunci) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function tampilkanLaporan() {
    const pemasukan = bacaData("kasDaftarPemasukan");
    const pengeluaran = bacaData("kasDaftarPengeluaran");
    const tabel = document.getElementById("riwayatLaporan");

    const totalMasuk = pemasukan.reduce(
        (total, item) => total + Number(item.nominal || 0), 0
    );

    const totalKeluar = pengeluaran.reduce(
        (total, item) => total + Number(item.nominal || 0), 0
    );

    const saldo = totalMasuk - totalKeluar;

    document.getElementById("totalPemasukan").textContent =
        formatRupiah(totalMasuk);

    document.getElementById("totalPengeluaran").textContent =
        formatRupiah(totalKeluar);

    document.getElementById("saldoAkhir").textContent =
        formatRupiah(saldo);

    tabel.replaceChildren();

    const transaksi = [
        ...pemasukan.map(item => ({
            tanggal: item.tanggal,
            jenis: "Pemasukan",
            keterangan: item.nama + " - " + item.bulan,
            nominal: Number(item.nominal || 0)
        })),
        ...pengeluaran.map(item => ({
            tanggal: item.tanggal,
            jenis: "Pengeluaran",
            keterangan: item.kategori + " - " + item.keterangan,
            nominal: Number(item.nominal || 0)
        }))
    ].sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    transaksi.forEach(item => {
        const baris = document.createElement("tr");

        [
            item.tanggal,
            item.jenis,
            item.keterangan,
            formatRupiah(item.nominal)
        ].forEach(nilai => {
            const sel = document.createElement("td");
            sel.textContent = nilai;
            baris.appendChild(sel);
        });

        tabel.appendChild(baris);
    });

    document.getElementById("pesanLaporan").textContent =
        transaksi.length === 0
            ? "Belum ada transaksi yang tercatat."
            : "Jumlah transaksi: " + transaksi.length;
}

document.getElementById("cetakLaporan")
    .addEventListener("click", function() {
        window.print();
    });

tampilkanLaporan();