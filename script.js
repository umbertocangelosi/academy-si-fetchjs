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
  div_utenti.classList.add("container");

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
    cellaEmail.id = "elementoInteresse";
    cellaEmail.textContent = datiUtente.email;

    const cellaButton = riga.insertCell();
    cellaButton.innerHTML =
      "<a href='dettagli_utenti.html" +
      "?email=" +
      datiUtente.email +
      "'> <button class='btn'>Dettagli utente</button>";
  });

  div_utenti.appendChild(tabellaUtenti);
}

async function loginUtente() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/utente/login-user", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: email, password: password,}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // code here //
        if (data.error) {
          alert("Error Password or Username"); 
        } else {
          window.open(
            "target.html"
          ); 
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


async function registrazioneUtente(form) {
  const formData = new FormData(form);
  console.log(formData);

  const nome = formData.get("nome");
  const cognome = formData.get("cognome");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await inviaDatiAlServer(nome, cognome, email, password);
    alert("Dati inviati con successo al server!");
  } catch (error) {
    alert(
      "Si è verificato un errore durante l'invio dei dati al server. Si prega di riprovare più tardi."
    );
  }
}

async function inviaDatiAlServer(nome, cognome, email, password) {
  await fetch("http://localhost:8080/api/utente/registrazione", {
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
  })
    .then(async (response) => await response.json()) // Converte la risposta in JSON
    .then((data) => console.log(data)) // Gestisce i dati della risposta
    .catch((error) => console.error("Errore:", error)); // Gestisce eventuali errori

  console.log(response);
}

async function caricaFileEsterno(idElemento) {
  try {
    const response = await fetch("elenco_utenti.html");
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elementoInteresse = doc.getElementById(idElemento);

    return elementoInteresse.textContent;
  } catch (error) {
    console.error(
      "Si è verificato un errore durante il caricamento del file HTML esterno:",
      error
    );
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
