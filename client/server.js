const express = require("express");
const path = require("path");

const app = express();

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.listen(app.get('port'), () => {
   console.log("Server Started on Port ", app.get('port'));
});
