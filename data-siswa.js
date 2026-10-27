const role = sessionStorage.getItem("kasRole");

if (!role) {
  window.location.replace("index.html");
} else {
  const formSiswa = document.getElementById("formSiswa");
  const studentForm = document.getElementById("studentForm");
  const daftarSiswa = document.getElementById("daftarSiswa");
  const pesan = document.getElementById("pesan");
  const jumlahSiswa = document.getElementById("jumlahSiswa");

  let siswa = [];

  try {
    siswa = JSON.parse(
      localStorage.getItem("kasDaftarSiswa") || "[]"
    );

    if (!Array.isArray(siswa)) siswa = [];
  } catch (error) {
    siswa = [];
  }

  function simpanSiswa() {
    localStorage.setItem("kasDaftarSiswa", JSON.stringify(siswa));
  }

  function tampilkanSiswa() {
    daftarSiswa.innerHTML = "";

    siswa.forEach((item, index) => {
      const baris = document.createElement("tr");

      [index + 1, item.nis, item.nama, item.kelas].forEach(nilai => {
        const kolom = document.createElement("td");
        kolom.textContent = nilai ?? "";
        baris.appendChild(kolom);
      });

      const kolomAksi = document.createElement("td");

      if (role === "bendahara") {
        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";

        tombolHapus.addEventListener("click", () => {
          if (confirm("Yakin ingin menghapus data siswa ini?")) {
            siswa.splice(index, 1);
            simpanSiswa();
            tampilkanSiswa();
          }
        });

        kolomAksi.appendChild(tombolHapus);
      } else {
        kolomAksi.textContent = "Lihat saja";
      }

      baris.appendChild(kolomAksi);
      daftarSiswa.appendChild(baris);
    });

    if (jumlahSiswa) {
      jumlahSiswa.textContent = siswa.length + " siswa";
    }
  }

  if (role !== "bendahara" && formSiswa) {
    formSiswa.style.display = "none";
  }

  if (studentForm && role === "bendahara") {
    studentForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const nis = document.getElementById("nis").value.trim();
      const nama = document.getElementById("nama").value.trim();
      const kelas = document.getElementById("kelas").value.trim();

      if (!nis || !nama || !kelas) {
        if (pesan) pesan.textContent = "Semua data harus diisi.";
        return;
      }

      if (siswa.some(item => String(item.nis) === nis)) {
        if (pesan) pesan.textContent = "NIS sudah terdaftar.";
        return;
      }

      siswa.push({ nis, nama, kelas });
      simpanSiswa();
      tampilkanSiswa();
      studentForm.reset();

      if (pesan) pesan.textContent = "Data siswa berhasil disimpan.";
    });
  }

  tampilkanSiswa();
}