const standingsEl = document.getElementById("standings1");
const standingsConst = document.getElementById("standings2");
const head = document.getElementById("head");

const stand = localStorage.getItem("stand8");
console.log(stand);

getDriversStandings();

createSeason();

async function getDriversStandings() {
  let constructors;
  const res = await fetch(
    `http://ergast.com/api/f1/${stand}/driverStandings.json`
  );
  const resConst = await fetch(
    `http://ergast.com/api/f1/${stand}/constructorStandings.json`
  );
  const data = await res.json();
  const dataConst = await resConst.json();
  let drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  if (stand > 1957) {
    constructors =
      dataConst.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  }
  drivers.forEach((driver, i) => {
    const standings = document.createElement("tr");
    standings.id = "stand";
    standings.innerHTML = `<td>${i + 1}</td><td>${driver.Driver.givenName} ${
      driver.Driver.familyName
    } <img src="img/${driver.Driver.nationality}.jpg"/></td>
    <td>${driver.Constructors[0].name}</td><td>${driver.points}</td><td>${
      driver.wins
    }</td>`;
    standingsEl.appendChild(standings);
  });
  if (constructors) {
    constructors.forEach((constructor, i) => {
      const standings = document.createElement("tr");
      standings.innerHTML = `<td>${i + 1}</td><td>${
        constructor.Constructor.name
      }</td><td>${constructor.points}</td><td>${constructor.wins}</td<`;
      standingsConst.appendChild(standings);
    });
  }
}

function createSeason() {
  const h1 = document.createElement("h1");
  h1.innerHTML = `Welcome to standings for season ${stand}`;
  head.appendChild(h1);
}
