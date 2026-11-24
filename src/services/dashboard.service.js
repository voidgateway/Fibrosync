const pacientesService = require('./pacientes.service');
const registrosRepository = require('../repositories/registros.repository');
const climaRepository = require('../repositories/clima.repository');

// regras de negócio do dashboard: transforma os registros brutos do
// paciente nos números e mensagens que a tela só precisa exibir.

const PERIODOS_VALIDOS = [7, 30, 90];

// diferença mínima de média (0 a 10) para considerar que a disposição mudou
const LIMIAR_TENDENCIA = 0.5;

const TEXTO_PERIODO = {
  7: 'nesta semana',
  30: 'neste mês',
  90: 'nos últimos 3 meses',
};

// "2026-11-10" -> soma/subtrai dias sem depender do fuso do servidor
function somarDias(data, dias) {
  const resultado = new Date(`${data}T00:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
}

// data local do servidor no formato do mock (AAAA-MM-DD)
function dataLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function media(valores) {
  if (valores.length === 0) return null;
  const soma = valores.reduce((total, valor) => total + valor, 0);
  return Math.round((soma / valores.length) * 10) / 10;
}

// registros com data entre inicio e fim (inclusive)
function filtrarPeriodo(registros, inicio, fim) {
  return registros.filter((registro) => registro.data >= inicio && registro.data <= fim);
}

function resumirDor(registros) {
  if (registros.length === 0) {
    return { recente: null, media: null, pico: null };
  }

  const ultimo = registros.at(-1);
  const pico = registros.reduce((maior, registro) => (registro.dor > maior.dor ? registro : maior));

  return {
    recente: { valor: ultimo.dor, data: ultimo.data },
    media: media(registros.map((registro) => registro.dor)),
    pico: { valor: pico.dor, data: pico.data },
  };
}

// último registro real: é ele que alimenta risco e relatórios
function montarContexto(registros) {
  const ultimo = registros.at(-1);
  if (!ultimo) return null;

  return {
    data: ultimo.data,
    dor: ultimo.dor,
    disposicao: ultimo.disposicao,
    observacao: ultimo.observacao || '',
  };
}

// regiões mais citadas no período, com a intensidade média de cada uma
function areasMaisCitadas(registros, limite = 3) {
  const porRegiao = new Map();

  registros.forEach((registro) => {
    registro.areas.forEach(({ regiao, intensidade }) => {
      const intensidades = porRegiao.get(regiao) || [];
      intensidades.push(intensidade);
      porRegiao.set(regiao, intensidades);
    });
  });

  return [...porRegiao]
    .map(([regiao, intensidades]) => ({
      regiao,
      citacoes: intensidades.length,
      intensidadeMedia: media(intensidades),
    }))
    .sort((a, b) => b.citacoes - a.citacoes || b.intensidadeMedia - a.intensidadeMedia)
    .slice(0, limite);
}

// carga de sintomas: média dos sinais independentes de cada dia,
// e depois a média desses dias
function cargaDeSintomas(registros) {
  if (registros.length === 0) return null;

  const cargasDiarias = registros.map((registro) => media(Object.values(registro.sintomas)));

  return {
    media: media(cargasDiarias),
    ultimoDia: registros.at(-1).data,
  };
}

function alertaDoClima(clima) {
  if (clima.pressao.variacao <= -3) {
    return 'Queda de pressão pode deixar o corpo mais sensível hoje.';
  }

  if (clima.temperatura < 18) {
    return 'O frio pode aumentar a rigidez muscular hoje.';
  }

  return 'Sem alertas do clima para hoje.';
}

function insightDisposicao(atual, anterior, dias) {
  const mediaAtual = media(atual.map((registro) => registro.disposicao));
  const mediaAnterior = media(anterior.map((registro) => registro.disposicao));
  const quando = TEXTO_PERIODO[dias];

  if (mediaAtual === null || mediaAnterior === null) {
    return {
      tendencia: 'sem-dados',
      titulo: 'Sua disposição',
      mensagem: 'Continue registrando para acompanharmos a sua disposição.',
    };
  }

  const diferenca = mediaAtual - mediaAnterior;

  if (diferenca >= LIMIAR_TENDENCIA) {
    return {
      tendencia: 'melhorou',
      titulo: 'Sua disposição melhorou',
      mensagem: `Sua disposição está melhor ${quando}, continue assim!`,
    };
  }

  if (diferenca <= -LIMIAR_TENDENCIA) {
    return {
      tendencia: 'piorou',
      titulo: 'Sua disposição caiu',
      mensagem: `Sua disposição está mais baixa ${quando}. Respeite seus limites e descanse.`,
    };
  }

  return {
    tendencia: 'estavel',
    titulo: 'Sua disposição está estável',
    mensagem: `Sua disposição se manteve ${quando}.`,
  };
}

function insightDor(clima, areas) {
  const local = areas.length > 0 ? areas[0].regiao.toLowerCase() : 'nas articulações';
  const alvo = areas.length > 0 ? `à dor em ${local}` : `à dor ${local}`;

  if (clima.temperatura < 18) {
    return { tipo: 'frio', mensagem: `A baixa temperatura pode estar relacionada ${alvo}.` };
  }

  if (clima.pressao.variacao <= -3) {
    return { tipo: 'pressao', mensagem: `A queda de pressão pode estar relacionada ${alvo}.` };
  }

  if (clima.temperatura >= 30) {
    return { tipo: 'calor', mensagem: `O calor intenso pode estar relacionado ${alvo}.` };
  }

  return {
    tipo: 'neutro',
    mensagem: 'Continue registrando para descobrirmos o que influencia a sua dor.',
  };
}

function periodoValido(dias) {
  return PERIODOS_VALIDOS.includes(dias);
}

// resumo do dashboard do paciente, ou null se o paciente não existir.
// "hoje" é parâmetro para os testes não dependerem da data atual.
function montarResumo(pacienteId, dias, hoje = new Date()) {
  const paciente = pacientesService.buscarPorId(pacienteId);
  if (!paciente) return null;

  const fim = dataLocal(hoje);
  const inicio = somarDias(fim, -(dias - 1));
  const inicioAnterior = somarDias(inicio, -dias);

  const registros = registrosRepository.listarPorPaciente(pacienteId);
  const doPeriodo = filtrarPeriodo(registros, inicio, fim);
  const doPeriodoAnterior = filtrarPeriodo(registros, inicioAnterior, somarDias(inicio, -1));

  const clima = climaRepository.buscarAtual();
  const areas = areasMaisCitadas(doPeriodo);

  return {
    paciente: { id: paciente.id, nome: paciente.nome },
    periodo: { dias, inicio, fim, registros: doPeriodo.length },
    dor: resumirDor(doPeriodo),
    contexto: montarContexto(doPeriodo),
    areas,
    cargaSintomas: cargaDeSintomas(doPeriodo),
    clima: {
      temperatura: clima.temperatura,
      condicao: clima.condicao,
      alerta: alertaDoClima(clima),
    },
    insights: {
      disposicao: insightDisposicao(doPeriodo, doPeriodoAnterior, dias),
      dor: insightDor(clima, areas),
    },
  };
}

module.exports = { montarResumo, periodoValido, PERIODOS_VALIDOS };
