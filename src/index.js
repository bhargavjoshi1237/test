const app = require('./app.js');

app.listen(5000, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${5000}`);
  /* eslint-enable no-console */
});
