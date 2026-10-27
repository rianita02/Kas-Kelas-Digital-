const role = sessionStorage.getItem("kasRole");
const username = sessionStorage.getItem("kasUsername");

if (!role || !username) {
    window.location.replace("index.html");
} else {
    const roleNames = {
        bendahara: "Bendahara",
        siswa: "Siswa",
        walikelas: "Wali Kelas"
    };

    document.getElementById("welcome").textContent =
        `Halo, ${username}! Peran: ${roleNames[role] || "Pengguna"}`;
}

document.getElementById("logoutButton").addEventListener("click", function() {
    sessionStorage.removeItem("kasRole");
    sessionStorage.removeItem("kasUsername");
    window.location.replace("index.html");
});