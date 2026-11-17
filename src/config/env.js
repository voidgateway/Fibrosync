// Centraliza a leitura das variáveis de ambiente.
// Os scripts do package.json carregam o .env automaticamente (se existir).

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
};

module.exports = env;
