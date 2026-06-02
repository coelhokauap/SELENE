// ==========================================
// SELENE - Sistema de Monitoramento Ambiental Orbital
// Script de Interatividade e Simulação
// ==========================================
// Autores: Anita Palhares | Kauã Coelho | Vitória Kereski
// Funções: DOM Manipulation, Event Handling, BOM Features, Simulation
// ==========================================

// Variáveis globais para gerenciar estado da aplicação
let estadoSimulacao = {
  ativo: false,
  latencia: 0,
  ultimaAtualizacao: null,
  alertasAtivos: 0,
};

// Dados da aplicação carregados do JSON
let dadosSelene = null;

// Objeto com dados regionais para simulação de satélites
const dadosRegionais = {
  "Porto Alegre": {
    alertas: 17,
    temperatura: "31.8 °C",
    umidade: "38%",
    risco: "Moderado",
    latitude: -30.03,
    longitude: -51.23,
  },
  "São Paulo": {
    alertas: 22,
    temperatura: "29.4 °C",
    umidade: "52%",
    risco: "Alto",
    latitude: -23.55,
    longitude: -46.63,
  },
  Manaus: {
    alertas: 12,
    temperatura: "34.6 °C",
    umidade: "78%",
    risco: "Baixo",
    latitude: -3.1,
    longitude: -60.02,
  },
  Curitiba: {
    alertas: 9,
    temperatura: "24.1 °C",
    umidade: "61%",
    risco: "Moderado",
    latitude: -25.42,
    longitude: -49.27,
  },
};

// Funções auxiliares para seleção de elementos
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// ==========================================
// FUNCIONALIDADE: Notificação de Toast
// Descrição: Exibe mensagens temporárias no canto inferior direito
// Simulação BOM: Uso de setTimeout para remover elemento automaticamente
// ==========================================
function toast(texto, duracao = 3000) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = texto;
  el.style.animation = "slideIn 0.3s ease-in-out";
  document.body.append(el);

  // Simulação de latência orbital - BOM setTimeout
  setTimeout(() => {
    el.style.animation = "slideOut 0.3s ease-in-out";
    setTimeout(() => el.remove(), 300);
  }, duracao);
}

// ==========================================
// FUNCIONALIDADE: Carregar dados do JSON
// Descrição: Carrega dados do arquivo dados_selene.json para simulação
// Simulação BOM: Uso de Fetch API com tratamento de latência
// ==========================================
async function carregarDadosSelene() {
  try {
    // Simulando latência de comunicação orbital (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const resposta = await fetch("./dados_selene.json");
    if (!resposta.ok) throw new Error("Erro ao carregar dados");

    dadosSelene = await resposta.json();

    // Atualizar informações na interface com dados reais
    atualizarDashboardComDados();
    atualizarInformacoesOrbitais();

    toast("✓ Dados orbitais sincronizados com sucesso");
    return dadosSelene;
  } catch (erro) {
    console.error("Erro ao carregar dados SELENE:", erro);
    toast("⚠ Erro ao sincronizar dados. Usando dados locais.");
  }
}

// ==========================================
// FUNCIONALIDADE: Atualizar Dashboard com dados JSON
// Descrição: Manipula DOM para exibir dados do arquivo JSON
// Validação: Verifica existência de elementos antes de atualizar
// ==========================================
function atualizarDashboardComDados() {
  if (!dadosSelene) return;

  // Extrair dados climáticos do JSON
  const resumo = dadosSelene.resumo_climatico;
  const validacao = dadosSelene.validacao_orbital;

  // Atualizar temperatura média (Manipulação DOM)
  const tempCard = $(".metric-grid .metric-card:nth-child(3) strong");
  if (tempCard) {
    tempCard.textContent = `${resumo.temp_media.toFixed(1)} °C`;
  }

  // Atualizar umidade (Manipulação DOM)
  const umidadeCard = $(".metric-grid .metric-card:nth-child(4) strong");
  if (umidadeCard) {
    umidadeCard.textContent = `${resumo.umidade_media.toFixed(0)}%`;
  }

  // Atualizar status de sinal orbital
  const statusSinal = $(".hero-panel strong");
  if (statusSinal) {
    statusSinal.textContent = validacao.status_sinal;
    const statusSpan = $(".hero-panel span");
    if (statusSpan)
      statusSpan.textContent = `Eficiência do sinal: ${validacao.eficiencia_sinal.toFixed(1)}%`;
  }
}

// ==========================================
// FUNCIONALIDADE: Atualizar informações orbitais
// Descrição: Exibe informações de validação orbital na interface
// Dados: Usa informações de altura e eficiência do satélite
// ==========================================
function atualizarInformacoesOrbitais() {
  if (!dadosSelene) return;

  const validacao = dadosSelene.validacao_orbital;
  const localizacao = dadosSelene.localizacao;

  // Criar elemento informativo com dados orbitais
  const infoOrbitais = document.createElement("div");
  infoOrbitais.className = "info-card";
  infoOrbitais.style.marginTop = "2rem";
  infoOrbitais.innerHTML = `
    <h3>Informações Orbitais</h3>
    <p><strong>Localização:</strong> ${localizacao.cidade}</p>
    <p><strong>Latitude/Longitude:</strong> ${localizacao.latitude}° / ${localizacao.longitude}°</p>
    <p><strong>Eficiência do Sinal:</strong> ${validacao.eficiencia_sinal.toFixed(2)}%</p>
    <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">${validacao.status_sinal}</span></p>
  `;

  // Inserir no primeiro local disponível (após acesso)
  const acesso = $("#acesso");
  if (acesso && !$("#info-orbitais")) {
    infoOrbitais.id = "info-orbitais";
    acesso.parentElement.insertBefore(infoOrbitais, acesso.nextSibling);
  }
}

// ==========================================
// FUNCIONALIDADE: Login e Autenticação
// Descrição: Valida credenciais e controla acesso à plataforma
// Validação: Email obrigatório, senha mínima de 6 caracteres
// BOM: LocalStorage para persistência de sessão
// ==========================================
function login() {
  const formulario = $("#acesso form");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = $("#email").value.trim();
    const senha = $("#senha").value.trim();

    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      toast("❌ Email inválido. Use formato: usuario@exemplo.com");
      return;
    }

    // Validação de senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      toast("❌ Senha deve ter no mínimo 6 caracteres");
      return;
    }

    // Simulação de autenticação com latência de rede (500ms)
    toast("🔄 Autenticando usuário...");

    setTimeout(() => {
      // Armazenar dados do usuário em LocalStorage (BOM)
      const usuarioObj = {
        email: email,
        dataLogin: new Date().toLocaleString("pt-BR"),
        sessaoId: Math.random().toString(36).substr(2, 9),
      };

      localStorage.setItem("usuarioSelene", JSON.stringify(usuarioObj));
      localStorage.setItem("usuarioEmail", email);

      // Extrair nome do email
      const nomeUsuario = email.split("@")[0].toUpperCase();
      toast(`✓ Bem-vindo ao SELENE, ${nomeUsuario}!`);

      // Limpar formulário
      formulario.reset();

      // Iniciar simulação de monitoramento
      iniciarMonitoramento();
    }, 500);
  });
}

// ==========================================
// FUNCIONALIDADE: Dashboard interativo por região
// Descrição: Atualiza métricas dinamicamente conforme seleção de região
// Manipulação DOM: Altera valores de múltiplos elementos
// BOM: Simula atualização de dados de satélite em tempo real
// ==========================================
function dashboard() {
  const selectRegiao = $("#regiao");
  if (!selectRegiao) return;

  // Event listener para mudança de região
  selectRegiao.addEventListener("change", () => {
    const regiaoSelecionada = selectRegiao.value;
    const dados = dadosRegionais[regiaoSelecionada];

    if (!dados) return;

    // Simulação de latência de comunicação orbital (300ms)
    toast("🛰 Sincronizando dados de satélite...");

    setTimeout(() => {
      // Atualizar métricas na tela (Manipulação DOM)
      const metricas = $$(".metric-card");

      if (metricas[1])
        metricas[1].querySelector("strong").textContent = dados.alertas;
      if (metricas[2])
        metricas[2].querySelector("strong").textContent = dados.temperatura;
      if (metricas[3])
        metricas[3].querySelector("strong").textContent = dados.umidade;

      // Alterar status visual baseado no nível de risco
      atualizarStatusRisco(dados.risco);

      toast(
        `✓ Região alterada para ${regiaoSelecionada} (${dados.latitude}°, ${dados.longitude}°)`,
      );

      // Atualizar timestamp da última sincronização
      estadoSimulacao.ultimaAtualizacao = new Date();
    }, 300);
  });

  // Atualizar dados inicialmente
  selectRegiao.dispatchEvent(new Event("change"));
}

// ==========================================
// FUNCIONALIDADE: Atualizar status visual de risco
// Descrição: Muda cores e classes CSS baseado no nível de risco
// Manipulação DOM: Altera classes CSS dinamicamente
// ==========================================
function atualizarStatusRisco(nivel) {
  const heroPanel = $(".hero-panel div");
  if (!heroPanel) return;

  // Remover classes antigas
  heroPanel.className = "";

  // Adicionar nova classe baseada no risco
  if (nivel === "Crítico") {
    heroPanel.style.borderLeft = "4px solid var(--danger)";
    heroPanel.querySelector("strong").textContent = "Crítico";
  } else if (nivel === "Alto") {
    heroPanel.style.borderLeft = "4px solid var(--warning)";
    heroPanel.querySelector("strong").textContent = "Alto";
  } else {
    heroPanel.style.borderLeft = "4px solid var(--success)";
    heroPanel.querySelector("strong").textContent = "Moderado";
  }
}

// ==========================================
// FUNCIONALIDADE: Registrar Ocorrências
// Descrição: Permite registro de eventos ambientais
// Validação: Campos obrigatórios e trimming de espaços
// BOM: LocalStorage para persistência de dados
// ==========================================
function ocorrencias() {
  const formulario = $("#monitoramento form");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const tipo = $("#tipo-ocorrencia").value.trim();
    const descricao = $("#descricao-ocorrencia").value.trim();

    // Validações
    if (!tipo || !descricao) {
      toast("❌ Preencha todos os campos obrigatórios");
      return;
    }

    if (descricao.length < 10) {
      toast("❌ Descrição deve ter no mínimo 10 caracteres");
      return;
    }

    // Criar objeto de ocorrência
    const novaOcorrencia = {
      id: Date.now(),
      tipo: tipo,
      descricao: descricao,
      data: new Date().toLocaleString("pt-BR"),
      latitude: dadosRegionais[$("#regiao").value]?.latitude || 0,
      longitude: dadosRegionais[$("#regiao").value]?.longitude || 0,
      status: "Registrada",
    };

    // Recuperar ocorrências anterior e adicionar nova
    const ocorrenciasSalvas =
      JSON.parse(localStorage.getItem("ocorrenciasSelene")) || [];
    ocorrenciasSalvas.push(novaOcorrencia);

    // Limitar a 50 ocorrências no histórico
    if (ocorrenciasSalvas.length > 50) {
      ocorrenciasSalvas.shift();
    }

    localStorage.setItem(
      "ocorrenciasSelene",
      JSON.stringify(ocorrenciasSalvas),
    );

    // Feedback visual
    toast(`✓ Ocorrência "${tipo}" registrada com sucesso`);
    formulario.reset();

    // Simular processamento com latência
    setTimeout(() => {
      toast("🔔 Alerta enviado para a Defesa Civil");
    }, 1500);
  });
}

// ==========================================
// FUNCIONALIDADE: Simulação de cenários ambientais
// Descrição: Simula diferentes cenários com base em parâmetros
// Lógica: Estruturas de decisão para determinar resultado
// BOM: Uso de setInterval para atualizar valores em tempo real
// ==========================================
function simulacao() {
  const botaoSimular = $$("#simulacao .button.primary")[0];
  if (!botaoSimular) return;

  const inputChuva = $("#chuva");
  const inputVento = $("#vento");
  const selectCenario = $("#cenario");

  botaoSimular.addEventListener("click", () => {
    const chuva = Number(inputChuva.value);
    const vento = Number(inputVento.value);
    const cenario = selectCenario.value;

    // Simular processamento com latência de 2 segundos
    toast("🔄 Inicializando simulação orbital...");
    estadoSimulacao.ativo = true;

    setTimeout(() => {
      // Calcular resultado baseado em lógica de risco
      let impacto = "Baixo";
      let confianca = 75;
      let areaVulneravel = "5 km²";

      // Estruturas de decisão para cenários
      if (cenario === "Risco de enchente") {
        if (chuva > 85 && vento > 70) {
          impacto = "Crítico";
          confianca = 95;
          areaVulneravel = "25 km²";
        } else if (chuva > 70 || vento > 60) {
          impacto = "Alto";
          confianca = 88;
          areaVulneravel = "15 km²";
        } else if (chuva > 50) {
          impacto = "Moderado";
          confianca = 82;
          areaVulneravel = "8 km²";
        }
      } else if (cenario === "Propagação de queimada") {
        if (chuva < 30 && vento > 80) {
          impacto = "Crítico";
          confianca = 92;
          areaVulneravel = "30 km²";
        } else if (chuva < 50 && vento > 60) {
          impacto = "Alto";
          confianca = 87;
          areaVulneravel = "18 km²";
        } else if (vento > 40) {
          impacto = "Moderado";
          confianca = 80;
          areaVulneravel = "10 km²";
        }
      } else if (cenario === "Seca prolongada") {
        if (chuva < 20 && vento > 70) {
          impacto = "Crítico";
          confianca = 90;
          areaVulneravel = "40 km²";
        } else if (chuva < 40) {
          impacto = "Alto";
          confianca = 85;
          areaVulneravel = "22 km²";
        } else if (chuva < 60) {
          impacto = "Moderado";
          confianca = 78;
          areaVulneravel = "12 km²";
        }
      }

      // Atualizar elementos da tela com resultado (Manipulação DOM)
      const predictionGrid = $$(".prediction-grid div");
      if (predictionGrid[0])
        predictionGrid[0].querySelector("strong").textContent = impacto;
      if (predictionGrid[1])
        predictionGrid[1].querySelector("strong").textContent = areaVulneravel;
      if (predictionGrid[2])
        predictionGrid[2].querySelector("strong").textContent = `${confianca}%`;

      toast(`✓ Simulação concluída: Impacto ${impacto}`);

      // Emitir alerta crítico se necessário (BOM window.alert)
      if (impacto === "Crítico") {
        setTimeout(() => {
          alert(
            `⚠ ALERTA CRÍTICO!\n\nCenário: ${cenario}\nImpacto: ${impacto}\nÁrea: ${areaVulneravel}\n\nDefesa Civil foi notificada.`,
          );
        }, 500);
      }

      estadoSimulacao.ativo = false;
    }, 2000);
  });

  // Atualizar valores em tempo real conforme user mexe nos sliders
  inputChuva.addEventListener("input", (e) => {
    const labelChuva =
      inputChuva.parentElement.querySelector("label") ||
      document.createElement("span");
    labelChuva.textContent = `Chuva acumulada: ${e.target.value}%`;
  });

  inputVento.addEventListener("input", (e) => {
    const labelVento =
      inputVento.parentElement.querySelector("label") ||
      document.createElement("span");
    labelVento.textContent = `Intensidade do vento: ${e.target.value}%`;
  });
}

// ==========================================
// FUNCIONALIDADE: Relatórios e Exportação
// Descrição: Permite exportação e compartilhamento de dados
// BOM: Acesso a clipboard e console para debug
// ==========================================
function relatorios() {
  const botoes = $$(".action-row button");

  if (botoes[0]) {
    // Botão Exportar PDF
    botoes[0].addEventListener("click", () => {
      toast("📄 Processando relatório PDF...");

      setTimeout(() => {
        const conteudo = {
          titulo: "Relatório SELENE",
          data: new Date().toLocaleString("pt-BR"),
          regiao: $("#regiao").value,
          metricas: {
            alertas: $$(".metric-card strong")[1]?.textContent,
            temperatura: $$(".metric-card strong")[2]?.textContent,
            umidade: $$(".metric-card strong")[3]?.textContent,
          },
        };

        console.log("Relatório exportado:", conteudo);
        toast("✓ Relatório PDF exportado com sucesso");
      }, 1000);
    });
  }

  if (botoes[1]) {
    // Botão Compartilhar
    botoes[1].addEventListener("click", async () => {
      try {
        const urlAtual = window.location.href;

        // Tentar usar Share API (BOM)
        if (navigator.share) {
          await navigator.share({
            title: "SELENE - Monitoramento Ambiental",
            text: "Confira o monitoramento ambiental em tempo real",
            url: urlAtual,
          });
          toast("✓ Compartilhado com sucesso");
        } else {
          // Fallback: copiar para clipboard
          await navigator.clipboard.writeText(urlAtual);
          toast("✓ Link copiado para área de transferência");
        }
      } catch (erro) {
        console.error("Erro ao compartilhar:", erro);
        toast("⚠ Erro ao compartilhar");
      }
    });
  }
}

// ==========================================
// FUNCIONALIDADE: Preferências de Notificação
// Descrição: Gerencia preferências do usuário para alertas
// Validação: Persiste preferências em LocalStorage
// BOM: Acesso a navegador para notificações push
// ==========================================
function preferencias() {
  const checkboxes = $$(".toggle-list input[type='checkbox']");

  // Recuperar preferências salvas
  const preferenciasArmazenadas =
    JSON.parse(localStorage.getItem("preferenciasSelene")) || {};

  checkboxes.forEach((checkbox, indice) => {
    // Restaurar estado anterior
    checkbox.checked =
      preferenciasArmazenadas[`pref_${indice}`] ?? checkbox.checked;

    // Salvar preferência ao alterar
    checkbox.addEventListener("change", () => {
      preferenciasArmazenadas[`pref_${indice}`] = checkbox.checked;
      localStorage.setItem(
        "preferenciasSelene",
        JSON.stringify(preferenciasArmazenadas),
      );

      toast("✓ Preferências atualizadas");

      // Se receber alertas críticos estiver marcado, solicitar permissão
      if (indice === 0 && checkbox.checked && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("SELENE Ativado", {
            body: "Você receberá notificações críticas",
            icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%234f7cff'/><text x='50' y='60' text-anchor='middle' font-size='60' fill='white' font-weight='bold'>SE</text></svg>",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    });
  });
}

// ==========================================
// FUNCIONALIDADE: Monitoramento em tempo real
// Descrição: Inicia simulação contínua de monitoramento
// BOM: setInterval para atualizações periódicas
// ==========================================
function iniciarMonitoramento() {
  // Verificar se usuário está logado
  const usuarioLogado = localStorage.getItem("usuarioEmail");
  if (!usuarioLogado) return;

  // Atualizar status de última verificação a cada 30 segundos
  const intervaloMonitoramento = setInterval(() => {
    const agora = new Date();
    const minutos = Math.floor(
      (agora - estadoSimulacao.ultimaAtualizacao) / 60000,
    );

    // Atualizar timestamp no painel hero
    const ultimaAtualizado = $(".hero-panel div:nth-child(2) strong");
    if (ultimaAtualizado) {
      ultimaAtualizado.textContent = minutos > 0 ? `${minutos} min` : "agora";
    }

    // Simular chegada de novos dados a cada 2 minutos
    if (minutos % 2 === 0 && minutos > 0) {
      const regiao = $("#regiao").value;
      const dados = dadosRegionais[regiao];

      if (dados) {
        // Simular variação nos dados
        const variacao = Math.random() * 5 - 2.5;
        const tempInt = parseInt(dados.temperatura);
        const tempVariada = (tempInt + variacao).toFixed(1);

        const tempCard = $$(".metric-card strong")[2];
        if (tempCard) tempCard.textContent = `${tempVariada} °C`;
      }
    }
  }, 30000);

  // Limpar intervalo quando página é descarregada
  window.addEventListener("beforeunload", () =>
    clearInterval(intervaloMonitoramento),
  );
}

// ==========================================
// FUNCIONALIDADE: Mapa interativo
// Descrição: Adiciona interatividade aos pontos do mapa
// Manipulação DOM: Eventos de hover em pontos
// ==========================================
function mapaInterativo() {
  const pontos = $$(".map-point");

  pontos.forEach((ponto) => {
    ponto.style.cursor = "pointer";

    ponto.addEventListener("click", (evento) => {
      const tipo = ponto.classList[1]; // fire, flood, drought, slide
      const nomes = {
        fire: "Queimada",
        flood: "Enchente",
        drought: "Seca",
        slide: "Deslizamento",
      };

      toast(`📍 ${nomes[tipo]} detectada nesta região`);
    });

    ponto.addEventListener("mouseenter", () => {
      ponto.style.transform = "scale(1.2)";
    });

    ponto.addEventListener("mouseleave", () => {
      ponto.style.transform = "scale(1)";
    });
  });
}

// ==========================================
// FUNCIONALIDADE: Sincronização periódica de dados
// Descrição: Sincroniza dados com servidor simulado a intervalos
// BOM: setInterval para atualizações regulares
// ==========================================
function sincronizacaoPeriodica() {
  // Sincronizar dados a cada 5 minutos
  setInterval(() => {
    const usuarioLogado = localStorage.getItem("usuarioEmail");
    if (usuarioLogado) {
      carregarDadosSelene();
    }
  }, 300000);
}

// ==========================================
// INICIALIZAÇÃO: Evento DOMContentLoaded
// Descrição: Executa todas as funções quando página carrega
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Carregar dados do JSON primeiro
    await carregarDadosSelene();

    // Inicializar módulos de interatividade
    login();
    dashboard();
    ocorrencias();
    simulacao();
    relatorios();
    preferencias();
    mapaInterativo();
    sincronizacaoPeriodica();

    toast("✓ SELENE inicializado e pronto para monitoramento");
  } catch (erro) {
    console.error("Erro durante inicialização:", erro);
    toast("❌ Erro ao inicializar SELENE");
  }
});

// ==========================================
// TRATAMENTO DE ERROS GLOBAL
// Descrição: Captura erros não tratados
// ==========================================
window.addEventListener("error", (evento) => {
  console.error("Erro global:", evento.error);
  toast("⚠ Erro na aplicação: veja console para detalhes");
});
