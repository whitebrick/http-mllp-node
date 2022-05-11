require("dotenv").config();
const mllp = require("./index.js");
const express = require("express");
const httpServer = express();

httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP server listening on port ${process.env.HTTP_PORT}`);
});

httpServer.get("/", (req, res) => {
  res.json({
    status: `HTTP server listening for POST on port ${process.env.HTTP_PORT}`,
  });
});

var mllpServer = new mllp.MLLPServer(
  process.env.MLLP_HOST,
  process.env.MLLP_PORT
);

let er7Msg = null;
httpServer.use(express.text());
httpServer.post("/", (req, res) => {

  console.log("\n\n\n== Gateway: HTTP POST received");

  if (!req.headers["forward-to"] || !req.headers["forward-to"].startsWith("mllp://")) {
    console.log("- ERROR: Forward-To header not found, returning 400");
    res.json({
      error:"Forward-To must be set in Header and begin with 'mllp://'"
    }).status(400);
    return
  }
  const forwardToSplit = req.headers["forward-to"].split(":");
  const remoteMllpHost = forwardToSplit[1].substring(2);
  const remoteMllpPort = parseInt(forwardToSplit[2]);

  console.log(
    `- Found Forward-To header - host: ${remoteMllpHost} | port: ${remoteMllpPort}`
  );

  er7Msg = req.body;
  console.log(
    `- Forwarding request body to mllp://${remoteMllpHost}:${remoteMllpPort}\n`
  );
  console.log(er7Msg);
  mllpServer.send(
    remoteMllpHost,
    remoteMllpPort,
    er7Msg,
    function (err, ackData) {
      console.log("- MLLP response error: " + err);
      console.log("- MLLP response ackData:");
      console.log(ackData);
      const payload = {};
      if(err) payload.error = err;
      if(ackData) payload.er7 = ackData;
      console.log("\nResponding to HTTP request:");
      console.log(JSON.stringify(payload));
      res.json(payload);
    }
  );
});
