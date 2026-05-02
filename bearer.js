const { argv } = require("node:process");
let accounts = [];
let url;
parseCLI();
console.log(accounts);
console.log(url);
fetchBearers(accounts);


function parseCLI() {
  for (let i = 2; i <= argv.length; i++) {
    if (argv[i] !== "-url") {
      accounts.push({ email: argv[i], password: argv[i + 1] });
      console.log(i);
      i++;
    } else {
      url = argv[i + 1];
      return;
    }
  }
}

async function fetchBearers(accounts) {
    let bearers = [];
    for (const element of accounts) {
        console.log(`fetching account: ${element.email}...`)
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: element.email, password: element.password })
            });
            const result = await response.json();
            bearers.push(result.token);
            console.log("fetched bearer succesfully")
        } catch (error) {
            console.error(error);
        }
    }
    console.log(bearers);
}

