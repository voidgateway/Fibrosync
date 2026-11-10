const app = require('./app');
const env = require('./config/env');

app.listen(env.PORT, () => {
  console.log(`Fibrosync rodando em http://localhost:${env.PORT}`);
});
