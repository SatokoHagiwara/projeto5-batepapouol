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
function userError(error) {
  const errorUserName = document.querySelector(".login-screen p");

  errorUserName.classList.remove("hide");
}

function startIntervals(params) {
  setInterval(userStatus, 5000);
  setInterval(loadPage, 3000);
  setInterval(loadParticipants, 10000);
}
function loadPage() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/messages"
  );

  if (loadFirstTime === 0) {
    loadParticipants();
    loadFirstTime++;
  }

  promise.then(renderMessages);
}
function renderMessages(response) {
  const messages = response.data;
  const messageBox = document.querySelector(".messages");

  messageBox.innerHTML = "";

  for (let i = 0; i < messages.length; i++) {
    let message = messages[i];
    if (message.type === "status") {
      messageBox.innerHTML += `
                  <li class="status" data-identifier="message">
                      <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> ${message.text}</p>
                  </li>`;
    } else if (message.type === "message") {
      messageBox.innerHTML += `
                  <li class="message" data-identifier="message">
                      <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> para </span> <span class="bold">${message.to}</span>: ${message.text}</p>
                  </li>`;
    } else if (
      message.type === "private_message" &&
      (message.to === userName || message.from === userName)
    ) {
      messageBox.innerHTML += `
                  <li class="private-message" data-identifier="message">
                      <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> reservadamente para <span class="bold">${message.to}</span>: ${message.text}</p>
                  </li>`;
    }
  }
  const lastMessage = document.querySelector(".messages li:last-child");
  lastMessage.scrollIntoView();
}
function userStatus() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/status",
    { name: userName }
  );

  promise.catch((error) => console.log(error.response));
}
