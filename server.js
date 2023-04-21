const http = require("http"),
  fs = require("fs");
require("dotenv").config();
// console.log(process.env)

const students = [
  { name: "Sonia", birth: "2019-14-05" },
  { name: "Antoine", birth: "2000-12-05" },
  { name: "Alice", birth: "1990-14-09" },
  { name: "Sophie", birth: "2001-10-02" },
  { name: "Bernard", birth: "1980-21-08" },
];

const HOST = process.env.APP_LOCALHOST || "127.0.0.1",
  PORT = process.env.APP_PORT || 8000;

http
  .createServer((req, res) => {
    const { url } = req;
    if (url === "/assets/css.css") {
      const cssFile = fs.readFileSync("assets/css.css", "utf8");
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
                <li>
                    <p>nom: ${name}</p>
                    <p>anniversaire: ${birth}</p>
                </li>
            `;
        html += infos;
      }
      html += `</ul>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
            <html>
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
  })
  // .listen(PORT);
  .listen(PORT, HOST, () => {
    console.log(`running on http://${HOST}:${PORT}`);
    // console.log(`running on http://127.0.0.1:${PORT}`);
  });