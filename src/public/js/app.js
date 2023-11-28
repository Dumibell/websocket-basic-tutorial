const socket = io();

//room 만들기
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const backendDone = (msg) => {
  console.log(`The backend says: ${msg}`);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");

  //send 대신 emit을 씀.
  // 1. 첫번째 인자 - 이벤트 이름
  // 2. 두번째 인자부터~~  - 아무거나 쌉가능.JSON 객체를 그대로 보낼 수도 있고, 서버에서 실행시킬 함수를 저장할 수도 있음. (websocket을 사용할 때는 string만 전달할 수 있어서 object를 string으로 변환하는 과정이 필요햇삼)
  // 3. 마지막 인자 - 끝날 때 실행되는 function
  socket.emit("enter_room", { payload: input.value }, backendDone);
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
