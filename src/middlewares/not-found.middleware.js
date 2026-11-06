const path = require('node:path');
const { VIEWS_DIR } = require('../config/paths');

const NOT_FOUND_PAGE = path.join(VIEWS_DIR, '404', 'index.html');

// Navegador (pede HTML) recebe a página 404; chamadas de API recebem JSON.
function notFound(req, res) {
  res.status(404);

  if (req.accepts(['html', 'json']) === 'html') {
    return res.sendFile(NOT_FOUND_PAGE);
  }

  return res.json({ error: 'Recurso não encontrado' });
}

module.exports = notFound;
