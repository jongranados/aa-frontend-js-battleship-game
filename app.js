const http = require("http");
const { readFileSync } = require("fs");
const path = require("path");

// create http server
const server = http.createServer((req, res) => {
  console.log(`Incoming Request - Method: ${req.method} | URL: ${req.url}`);

  // process the body of the request
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // when the request is finished processing the entire body,
  req.on("end", () => {

    // parse the request body
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }

    // serve html homepage
    if (req.method === "GET" && req.url === "/") {
      const resBody = readFileSync("./index.html");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(resBody);
      return;
    }

    // serve static assets
    const ext = path.extname(req.url);
    if (req.method === "GET" && ext) {
      try {
        const resBody = readFileSync('.' + req.url);
        res.statusCode = 200;
        if (ext === ".jpg" || ext === ".jpeg") {
          res.setHeader("Content-Type", "image/jpeg");
        } else if (ext === ".css") {
          res.setHeader("Content-Type", "text/css");
        } else if (ext === ".js") {
          res.setHeader("Content-Type", "text/javascript");
        }
        res.end(resBody);
        return;
      } catch {
        console.error(
          "Cannot find asset",
          path.basename(req.url),
          "in assets folder"
        );
      }
    }

    // catch all - 404 error
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    const resBody = "Page Not Found";
    res.write(resBody);
    res.end();
  });
});

// Set the port to 5000
const port = 5000;

// Tell the port to listen for requests on localhost:5000
server.listen(port, () => console.log("Server is running on port", port));
