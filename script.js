async function getDatiDalServer() {
  try {
    const response = await fetch("http://localhost:8080/api/utente/get-all");

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const datiUtente = await response.json();
    return datiUtente;
  } catch (error) {
    // Gestisce eventuali errori
    console.error("Errore durante la chiamata REST:", error);
  }
}

async function creazionetabella() {
  const datiUtente = await getDatiDalServer();

  const div_utenti = document.createElement("div");
  div_utenti.id = "div_utenti";

  document.body.appendChild(div_utenti);

  const tabellaUtenti = document.createElement("table");

  tabellaUtenti.classList.add(
    "table",
    "table-striped",
    "table-bordered",
    "table-hover"
  );

  const intestazioneTabella = tabellaUtenti.createTHead();
  const rigaIntestazione = intestazioneTabella.insertRow();

  const intestazioneNomi = ["Nome", "Cognome", "Email"];

  intestazioneNomi.forEach(function (nome) {
    const cellaIntestazione = document.createElement("th");
    cellaIntestazione.textContent = nome;
    rigaIntestazione.appendChild(cellaIntestazione);
  });

  const corpoTabella = tabellaUtenti.createTBody();

  datiUtente.forEach(function (datiUtente) {
    const riga = corpoTabella.insertRow();

    const cellaNome = riga.insertCell();
    cellaNome.textContent = datiUtente.nome;

    const cellaCognome = riga.insertCell();
    cellaCognome.textContent = datiUtente.cognome;

    const cellaEmail = riga.insertCell();
    cellaEmail.textContent = datiUtente.email;

    const cellaButton = riga.insertCell();
    cellaButton.innerHTML =
      "<a href='dettagli_utente.html" +
      "?email=" +
      datiUtente.email +
      "'> <button class='btn btn-primary'>Dettagli utente</button>";
  });

  div_utenti.appendChild(tabellaUtenti);
}

async function loginUtente() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
      "http://localhost:8080/api/utente/login-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const encodedEmail = encodeURIComponent(email);
      const profiloUtenteURL = "profilo_utente.html";
      window.location.href = profiloUtenteURL + "?email=" + encodedEmail;
    }
  } catch (e) {
    console.error("Errore:", error);
    var loginContainer = document.getElementById("loginInfo");
    loginContainer.innerHTML = "<p>" + error.message + "</p>";
  }
}

async function infoUtente() {
  try {
    dettagliUtente();
  } catch (error) {
    console.error("Errore:", error);
    alert("Errore durante il caricamento dei dati utente");
  }
}

async function registrazioneUtente() {
  try {
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
      "http://localhost:8080/api/utente/registrazione",
      {
        method: "POST", // Metodo HTTP per la richiesta POST
        headers: {
          "Content-Type": "application/json", // Imposta l'intestazione del contenuto come JSON
        },
        body: JSON.stringify({
          nome: nome,
          cognome: cognome,
          password: password,
          email: email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Dati non validi / utente già registrato.");
    } else {
      window.location.href = "login.html"; 
    }
  } catch (error) {
    console.error("Errore:", error);
    var loginContainer = document.getElementById("registerInfo");
    loginContainer.innerHTML = "<p>" + error.message + "</p>";
  }
}

async function getElementByEmail() {
  try {
    const email = await getParamByUrl("email");
    console.log(email);
    const response = await fetch(
      `http://localhost:8080/api/utente/utente?email=${email}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();

    return userData;
  } catch (error) {
    console.error(
      "Si è verificato un errore durante il caricamento del file HTML esterno:",
      error
    );
    alert(
      "Si è verificato un errore durante il caricamento del file HTML esterno:",
      error
    );
  }
}

async function getParamByUrl(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const parametro = urlParams.get(param);
  console.log(parametro);
  return parametro;
}

async function creaTabellaUtente(utente) {
  const corpoTabella = document.getElementById("corpoTabella");

  const riga = corpoTabella.insertRow();
  riga.insertCell().textContent = utente.id;
  riga.insertCell().textContent = utente.nome;
  riga.insertCell().textContent = utente.cognome;
  riga.insertCell().textContent = utente.email;

  const ruoliCella = riga.insertCell();
  if (utente.ruoli && utente.ruoli.length > 0) {
    const ruoli = utente.ruoli.map((ruolo) => ruolo.tipologia).join(", ");
    ruoliCella.textContent = ruoli;
  } else {
    ruoliCella.textContent = "Nessun ruolo";
  }
}

async function dettagliUtente() {
  const userData = await getElementByEmail();
  console.log(userData);
  creaTabellaUtente(userData);
}
