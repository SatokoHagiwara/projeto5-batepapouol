let userName;
let participantName = "Todos";
let visibility = "message";
let loadFirstTime = 0;

function verifyUserName() {
  const userNameInput = document.querySelector(".login-screen input");

  userName = userNameInput.value;

  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    { name: userName }
  );

  promise.then(hideLoginScreen);
  promise.catch(userError);
}
function hideLoginScreen(response) {
  const login = document.querySelector(".login");
  const screen = document.querySelector(".login-screen");

  login.innerHTML = `
          <img src="images/spinner.gif" alt="Gif de carregamento">
          <p style="font-size: 18px">Entrando...</p>
      `;

  setTimeout(() => {
    screen.classList.add("hide");
  }, 3000);
  loadPage();
  startIntervals();
}
