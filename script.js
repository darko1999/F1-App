const seasonsEl = document.getElementById("t1");
const tracksEl = document.getElementById("tracks");
const teamsEl = document.getElementById("teams");
const tabItems = document.querySelectorAll(".tab-item");
const tabContentItems = document.querySelectorAll(".tab-content-item");
const driversEl = document.getElementById("drivers");
const searchTerm = document.getElementById("search-term");
const tracksBtn = document.querySelectorAll(".track-sort");

let seasonsArr = [];
let tracksArr = [];
let teamsArr = [];
let teamsNat = [];
let natArr = [];
let teamSet = [];
let driversArr = [];

getSeasons();
getTracks();
getTeams();
getDrivers();

async function getSeasons() {
  const res = await fetch("http://ergast.com/api/f1/seasons.json?limit=71");

  const data = await res.json();
  const seasons = data.MRData.SeasonTable.Seasons;
  for (let i = 0; i < seasons.length; i++) {
    seasonsArr.push(seasons[i].season);
  }
  createSeasons(seasonsArr);
  createDriversStandings();
}

async function getTracks() {
  const res = await fetch("http://ergast.com/api/f1/circuits.json?limit=76");
  const data = await res.json();
  const tracks = data.MRData.CircuitTable.Circuits;
  for (let i = 0; i < tracks.length; i++) {
    tracksArr.push({ id: tracks[i].circuitId, name: tracks[i].circuitName });
  }
  console.log(tracksArr);
  createTracks();
}

async function getTeams() {
  const res = await fetch(
    "http://ergast.com/api/f1/constructors.json?limit=211"
  );
  const data = await res.json();
  const teams = data.MRData.ConstructorTable.Constructors;
  for (let i = 0; i < teams.length; i++) {
    teamsArr.push({ name: teams[i].name, nat: teams[i].nationality });
    natArr.push(teams[i].nationality);
  }
  teamSet = Array.from(new Set(natArr));

  createTeams(teamsArr);
  createOptions();
}

async function getDrivers() {
  const res = await fetch("http://ergast.com/api/f1/drivers.json?limit=848");
  const data = await res.json();
  const drivers = data.MRData.DriverTable.Drivers;

  for (let i = 0; i < drivers.length; i++) {
    driversArr.push({
      name: drivers[i].givenName,
      surname: drivers[i].familyName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
      dob: drivers[i].dateOfBirth,
    });
  }
  console.log(driversArr);

  createDrivers(driversArr);
}

async function getDriversBySearch(term) {
  const resp = await fetch(
    `http://ergast.com/api/f1/drivers/${term}.json?limit=848`
  );
  const respData = await resp.json();
  const drivers = respData.MRData.DriverTable.Drivers;
  return drivers;
}

function selectItem() {
  removeShow();
  removeBorder(tabItems);
  console.log(this.id);
  const tabContentItem = document.querySelector(`#${this.id}-content`);
  tabContentItem.classList.add("show");
  this.classList.add("tab-border");
}

tabItems.forEach((item) => item.addEventListener("click", selectItem));

function removeShow() {
  tabContentItems.forEach((item) => item.classList.remove("show"));
}

function removeBorder(btns) {
  btns.forEach((item) => item.classList.remove("tab-border"));
}

function removeTracks() {
  const ids = document.querySelectorAll("#track");
  ids.forEach((id) => id.remove());
}

function removeTeams() {
  const ids = document.querySelectorAll("#team");
  ids.forEach((id) => id.remove());
  const imgs = document.querySelectorAll("#teamImg");
  imgs.forEach((img) => img.remove());
}

function removeDrivers() {
  const ids = document.querySelectorAll("#driver");
  ids.forEach((id) => id.remove());
}

function createSeasons() {
  seasonsArr.forEach((season) => {
    let div = document.createElement("div");
    div.id = "season";
    div.innerText = season;
    seasonsEl.appendChild(div);
  });
}

function createDriversStandings() {
  seasonsEl.childNodes.forEach((div) =>
    div.addEventListener("click", () => {
      window.document.location = "standings.html";
      localStorage.setItem("stand8", div.innerHTML);
    })
  );
}

function createTracks() {
  for (let i = 0; i < tracksArr.length; i++) {
    let li = document.createElement("div");
    li.id = "track";
    li.innerHTML = tracksArr[i].id;
    li.addEventListener("mouseenter", () => {
      li.innerText = tracksArr[i].name;
      li.style.color = "red";
      li.style.textTransform = "uppercase";
    });
    li.addEventListener("mouseleave", () => {
      li.innerText = tracksArr[i].id;
      li.style.color = "orange";
      li.style.textTransform = "lowercase";
    });

    tracksEl.appendChild(li);
  }
}

function createTeams(arr) {
  for (let i = 0; i < arr.length; i++) {
    let img = document.createElement("img");
    img.src = `./img/${arr[i].nat}.jpg`;
    img.id = "teamImg";
    let div = document.createElement("div");
    div.id = "team";
    div.innerHTML = `${arr[i].name}<img src="${img.src}">`;
    teamsEl.appendChild(div);
  }
}
function createDrivers(arr) {
  arr.forEach((e) => {
    let td = document.createElement("tr");
    td.id = "driver";
    td.innerHTML = `<td>${e.name}</td><td>${e.surname}</td><td>${e.dob}</td>`;
    driversEl.appendChild(td);
  });
}

function createOptions() {
  const select = document.getElementById("aa");
  teamSet.forEach((team) => {
    let opt = document.createElement("option");
    opt.value = team;
    opt.innerHTML = team;
    select.appendChild(opt);
  });
}

function sortTracks(val) {
  removeTracks();
  removeBorder(tracksBtn);
  if (val === "desc") {
    tracksArr.sort((a, b) => b.id.localeCompare(a.id));
    tracksBtn[1].classList.add("tab-border");
  } else if (val === "asc") {
    tracksArr.sort((a, b) => a.id.localeCompare(b.id));
    tracksBtn[0].classList.add("tab-border");
  }
  createTracks();
  console.log(tracksArr);
}

function sortTeamNat(value) {
  removeTeams();
  console.log(value);
  if (value != "default") {
    const arr = teamsArr.filter((val) => {
      if (val.nat === value) {
        return true;
      }
    });
    createTeams(arr);
    console.log(arr);
  } else {
    createTeams(teamsArr);
    console.log(teamsArr);
  }
}

function sortDriversAge(value, type) {
  removeDrivers();
  console.log(value);
  switch (value) {
    case "old":
      driversArr.sort((a, b) => a.dob > b.dob);
      break;
    case "young":
      driversArr.sort((a, b) => b.dob > a.dob);
      break;

    case "asc":
      driversArr.sort(
        (a, b) => a.surname.toLowerCase() > b.surname.toLowerCase()
      );
      break;
    case "desc":
      driversArr.sort(
        (a, b) => b.surname.toLowerCase() > a.surname.toLowerCase()
      );
      break;
  }
  createDrivers(driversArr);
}

function sortFunction(a, b) {
  return b - a;
}

console.log(teamsArr);

console.log(natArr);

searchTerm.addEventListener("keyup", async () => {
  let td, txtValue, txtValuen;
  let tr = driversEl.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    tdn = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      txtValuen = tdn.textContent || td.innerText;
      if (txtValue.toLowerCase().indexOf(searchTerm.value) === 0) {
        tr[i].style.display = "";
      } else if (tdn) {
        if (txtValuen.toLowerCase().indexOf(searchTerm.value) === 0) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
});

let string = "Étancelin";
const str = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
console.log(str);
