const http = require("http"),
  fs = require("fs"),
  date = require("dayjs");

require("dotenv").config();
// console.log(process.env)
const HOST = process.env.APP_LOCALHOST || "127.0.0.1",
  PORT = process.env.APP_PORT || 8000;

let students = [
  { name: "Sonia", birth: "2019-14-05" },
  { name: "Antoine", birth: "2000-12-05" },
  { name: "Alice", birth: "1990-14-09" },
  { name: "Sophie", birth: "2001-10-02" },
  { name: "Bernard", birth: "1980-21-08" },
];

http
  .createServer((req, res) => {
    const { url, method } = req;
    if (url === "/assets/css/style.css") {
      const cssFile = fs.readFileSync("assets/css/style.css", "utf8");
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(cssFile);
      res.end();
    } else if (url === "/") {
      const home = fs.readFileSync("./view/home.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(home);
    } else if (url === "/users") {
      let html = `<ul>`;
      for ({ name, birth } of students) {
        let infos = `
                <li class="infos-container">
                <div>
                  <p>nom: ${name}</p>
                  <p>anniversaire: ${birth}</p>    
                </div>
                <p class="delete">[X]</p>
                </li>
            `;
        html += infos;
      }
      html += `</ul>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
            <html>
                <head>
                  <link rel="stylesheet" href="/assets/css/style.css">
                </head>
                <body>
                    ${html}
                    <a href="/">Retour</a>
                </body>
            </html>
        `);
    } else {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`URL invalide`);
    }
    if (method === "POST") {
      let test;
      req.on("data", (data) => {
        console.log("on: ", data);
        test = data;
      });

      req.on("end", () => {
        let infos = {};
        console.log("end: ", test);
        const replacer = new RegExp(/\+/, "g");
        console.log(replacer);

        const name = test.toString().split(/=/).pop().replace(replacer, " ");
        name.split(" ").map((ele, i) => {
          if (i === 0) infos = { ...infos, name: ele };
          else infos = { ...infos, birth: ele };
        });
        students = [...students, infos];
        // console.log(infos);
      });
    }
  })
  // .listen(PORT);
  .listen(PORT, HOST, () => {
    console.log(`running on http://${HOST}:${PORT}`);
    // console.log(`running on http://127.0.0.1:${PORT}`);
  });
