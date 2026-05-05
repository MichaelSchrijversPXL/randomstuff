const { argv } = require("node:process");

let accounts = [];
let url;
let register = false;

parseCLI();
console.log(accounts);
console.log(url);
fetchBearers(accounts, url);

function parseCLI() {
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "-url") {
      url = argv[i + 1];
      i++; // skip the url value
    } else if (argv[i] === "-register") {
      register = true;
      console.log("registering unregistered toggled");
    } else {
      accounts.push({ email: argv[i], password: argv[i + 1] });
      i++;
    }
  }

  console.log(`${url}/token`);
}


async function fetchBearers(accounts, url) {
  let bearers = [];
  for (const element of accounts) {
    console.log(`fetching account: ${element.email}...`)
    try {
      let response = await authUser(element, url);
      if (response.status === 401) {
        await registerUser(element, url);
        response = await authUser(element, url);
      }
      const result = await response.json();
      bearers.push(result.token);
      console.log("fetched bearer succesfully")
    } catch (error) {
      console.error(error);
    }
  }
  console.log(bearers);
}

async function authUser(account, url) {
  const response = await fetch(`${url}/token`, {
    method: "POST",
    headers: {
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: account.email, password: account.password })
  });
  return response;
}

async function registerUser(account, url) {
  let username = account.email.split("@");
  username = username[0];
  try {
    const response = await fetch(`${url}/register`, {
      method: "post",
      headers: {
        'accept': 'text/plain',
        'content-type': 'application/json',
      },

      body: JSON.stringify({ email: account.email, username: username, password: account.password, birthdate: "2024-10-03" })
    });
    if (!response.ok) {
      let result = await response.json();
      console.log(result);
    } else {
      console.log(`user:${username} created`)
    }

  } catch (error) {
    console.log(error)
  }

}

