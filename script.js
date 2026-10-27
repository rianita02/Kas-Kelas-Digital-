const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const allowedAccounts = {
        bendahara: {
            username: "bendahara",
            password: "bendahara123"
        },
        siswa: {
            username: "siswa",
            password: "siswa123"
        },
        walikelas: {
            username: "walikelas",
            password: "wali123"
        }
    };

    const account = allowedAccounts[role];

    if (
        account &&
        username === account.username &&
        password === account.password
    ) {
        sessionStorage.setItem("kasRole", role);
        sessionStorage.setItem("kasUsername", username);

        window.location.href = "dashboard.html";
    } else {
        message.textContent =
            "Nama pengguna, kata sandi, atau peran salah!";
        message.style.color = "red";
    }
});