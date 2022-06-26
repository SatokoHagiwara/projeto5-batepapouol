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
