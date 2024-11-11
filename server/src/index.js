require('dotenv').config();
require('colors');

// Constants
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const express = require('express');
const ip = require('ip');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const connectDB = require('./database/db-config');

const {
  responseMiddleware,
  unauthorizedMiddleware,
  securityMiddleware,
} = require('./middlewares');

const chatbotRoutes = require('./modules/chatbot/chatbot-routes');
const interfaceRoutes = require('./modules/interfaces/interface-routes');
const swaggerRoutes = require('./doc/swagger-config');


app.use(express.static(`${__dirname}/views`));
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(responseMiddleware);
app.use(unauthorizedMiddleware);
securityMiddleware(app);


// Routes
app.use('/api', [chatbotRoutes, interfaceRoutes, swaggerRoutes]);

// catch 404
app.use((req, res) =>
  res.parseReturn({
    status: 404,
    errors: [
      {
        message: `Invalid Route, Access http://${ip.address()}:${PORT}/docs`,
      },
    ],
  })
);

app.use((err, req, res) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  return res.status(status).json(error);
});

const startServer = async () => {
  server.listen(PORT, () => {
    console.log(
      `Server is running at port ${PORT}, see more about the application on: http://${ip.address()}:${PORT}/docs`
        .bgMagenta
    );
  });
};

(async () => {
  await connectDB();
  await startServer();
})();

module.exports = app;
