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
function sendMessage() {
  let messageInput = document.querySelector(".message-text");
  let message = {};

  if (visibility === "message") {
    message = {
      from: userName,
      to: participantName,
      text: messageInput.value,
      type: "message",
    };
  } else {
    message = {
      from: userName,
      to: participantName,
      text: messageInput.value,
      type: "private_message",
    };
  }

  messageInput.value = "";
  resetPrivateInfo();
  resetVisibility();

  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/messages",
    message
  );

  promise.then(loadPage);
  promise.catch((error) => window.location.reload());
}
function sendEnter(event, input) {
  let key = event.keyCode;

  if (key === 13) {
    if (input.classList[0] === "message-text") sendMessage();
    else verifyUserName();
  }
}
function showParticipants() {
  const participants = document.querySelector("aside");

  participants.classList.toggle("hide");
}
function loadParticipants() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/participants"
  );

  promise.then(listParticipants);
}
function listParticipants(response) {
  const participants = response.data;
  const ulParticipants = document.querySelector(".participants-list");

  ulParticipants.innerHTML = `
            <li class="participant selected" onclick="selectParticipant(this)" data-identifier="participant">
                <span class="person">
                    <ion-icon  name="people" ></ion-icon>
                    <p class="personName">Todos</p>
                </span>
                <span class="check show">
                <ion-icon name="checkmark"></ion-icon>
                </span>
            </li>`;

  for (let i = 0; i < participants.length; i++) {
    const participant = participants[i];

    ulParticipants.innerHTML += `
                <li class="participant" onclick="selectParticipant(this)" data-identifier="participant">
                    <span class="person">
                        <ion-icon  name="people" ></ion-icon>
                        <p class="personName">${participant.name}</p>
                        </span>
                    <span class="check">
                        <ion-icon name="checkmark"></ion-icon>
                    </span>
                </li>`;
  }
}
function selectParticipant(element) {
  const participantSelected = document.querySelector(".participant.selected");
  participantName = element.querySelector(".personName").innerHTML;
  const checkElement = element.querySelector(".check");

  if (participantSelected !== null) {
    participantSelected.classList.remove("selected");
    checkElement.classList.remove("show");
  }
  element.classList.toggle("selected");
  checkElement.classList.toggle("show");

  changeInput();
}
