// SELENE - Sistema de Monitoramento Ambiental Orbital
// Interatividade com DOM, BOM e JavaScript

let estadoSimulacao = {
  ativo: false,
  latencia: 0,
  ultimaAtualizacao: null,
  alertasAtivos: 0,
};
let dadosSelene = null;

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

// Seletores simplificados (BOM - DOM selection)
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Notificação de Toast (BOM - setTimeout)
function toast(txt, dur = 3000) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = txt;
  el.style.animation = "slideIn 0.3s ease-in-out";
  document.body.append(el);
  setTimeout(() => {
    el.style.animation = "slideOut 0.3s ease-in-out";
    setTimeout(() => el.remove(), 300);
  }, dur);
}

// Carregar dados JSON (BOM - Fetch API com latência)
async function carregarDadosSelene() {
  try {
    await new Promise((r) => setTimeout(r, 500));
    const res = await fetch("./dados_selene.json");
    if (!res.ok) throw new Error("Erro ao carregar dados");
    dadosSelene = await res.json();
    atualizarDashboardComDados();
    atualizarInformacoesOrbitais();
    toast("✓ Dados orbitais sincronizados com sucesso");
    return dadosSelene;
  } catch (e) {
    console.error("Erro ao carregar dados SELENE:", e);
    toast("⚠ Erro ao sincronizar dados. Usando dados locais.");
  }
}

// Atualizar Dashboard com dados JSON (DOM manipulation)
function atualizarDashboardComDados() {
  if (!dadosSelene) return;
  const { resumo_climatico: r, validacao_orbital: v } = dadosSelene;
  const mcs = $$(".metric-card strong");
  if (mcs[2]) mcs[2].textContent = `${r.temp_media.toFixed(1)} °C`;
  if (mcs[3]) mcs[3].textContent = `${r.umidade_media.toFixed(0)}%`;
  const sp = $(".hero-panel");
  if (sp) {
    sp.querySelector("strong").textContent = v.status_sinal;
    const s = sp.querySelector("span");
    if (s) s.textContent = `Eficiência: ${v.eficiencia_sinal.toFixed(1)}%`;
  }
}

// Atualizar informações orbitais (DOM manipulation)
function atualizarInformacoesOrbitais() {
  if (!dadosSelene || $("#info-orbitais")) return;
  const { validacao_orbital: v, localizacao: l } = dadosSelene;
  const io = document.createElement("div");
  io.id = "info-orbitais";
  io.className = "info-card";
  io.style.marginTop = "2rem";
  io.innerHTML = `<h3>Informações Orbitais</h3>
    <p><strong>Localização:</strong> ${l.cidade}</p>
    <p><strong>Lat/Lon:</strong> ${l.latitude}° / ${l.longitude}°</p>
    <p><strong>Eficiência:</strong> ${v.eficiencia_sinal.toFixed(2)}%</p>
    <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">${v.status_sinal}</span></p>`;
  $("#acesso")?.parentElement?.insertBefore(io, $("#acesso").nextSibling);
}

// Login e Autenticação (Event listeners, validação, localStorage)
function login() {
  const form = $("#acesso form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim();
    const senha = $("#senha").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("❌ Email inválido");
      return;
    }
    if (senha.length < 6) {
      toast("❌ Senha deve ter mínimo 6 caracteres");
      return;
    }
    toast("🔄 Autenticando usuário...");
    setTimeout(() => {
      const usuarioObj = {
        email,
        dataLogin: new Date().toLocaleString("pt-BR"),
        sessaoId: Math.random().toString(36).substr(2, 9),
      };
      localStorage.setItem("usuarioSelene", JSON.stringify(usuarioObj));
      localStorage.setItem("usuarioEmail", email);
      toast(`✓ Bem-vindo, ${email.split("@")[0].toUpperCase()}!`);
      form.reset();
      iniciarMonitoramento();
    }, 500);
  });
}

// Dashboard interativo por região (DOM manipulation, BOM - setInterval)
function dashboard() {
  const sr = $("#regiao");
  if (!sr) return;
  sr.addEventListener("change", () => {
    const r = sr.value;
    const d = dadosRegionais[r];
    if (!d) return;
    toast("🛰 Sincronizando dados de satélite...");
    setTimeout(() => {
      const m = $$(".metric-card strong");
      if (m[1]) m[1].textContent = d.alertas;
      if (m[2]) m[2].textContent = d.temperatura;
      if (m[3]) m[3].textContent = d.umidade;
      atualizarStatusRisco(d.risco);
      toast(`✓ Região: ${r} (${d.latitude}°, ${d.longitude}°)`);
      estadoSimulacao.ultimaAtualizacao = new Date();
    }, 300);
  });
  sr.dispatchEvent(new Event("change"));
}

// Atualizar status visual de risco (DOM manipulation)
function atualizarStatusRisco(n) {
  const hp = $(".hero-panel div");
  if (!hp) return;
  hp.className = "";
  const cores = {
    Crítico: "var(--danger)",
    Alto: "var(--warning)",
    Moderado: "var(--success)",
  };
  hp.style.borderLeft = `4px solid ${cores[n] || cores.Moderado}`;
  hp.querySelector("strong").textContent = n;
}

// Registrar Ocorrências (Event listeners, localStorage, validação)
function ocorrencias() {
  const form = $("#monitoramento form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = $("#tipo-ocorrencia").value.trim();
    const desc = $("#descricao-ocorrencia").value.trim();
    if (!tipo || !desc || desc.length < 10) {
      toast("❌ Preencha todos os campos corretamente");
      return;
    }
    const no = {
      id: Date.now(),
      tipo,
      descricao: desc,
      data: new Date().toLocaleString("pt-BR"),
      latitude: dadosRegionais[$("#regiao").value]?.latitude || 0,
      longitude: dadosRegionais[$("#regiao").value]?.longitude || 0,
      status: "Registrada",
    };
    const os = JSON.parse(localStorage.getItem("ocorrenciasSelene")) || [];
    os.push(no);
    if (os.length > 50) os.shift();
    localStorage.setItem("ocorrenciasSelene", JSON.stringify(os));
    toast(`✓ Ocorrência "${tipo}" registrada`);
    form.reset();
    setTimeout(() => toast("🔔 Alerta enviado para a Defesa Civil"), 1500);
  });
}

// Simulação de cenários ambientais (BOM - setInterval, lógica de decisão)
function simulacao() {
  const btn = $$("#simulacao .button.primary")[0];
  if (!btn) return;
  const ic = $("#chuva"),
    iv = $("#vento"),
    cs = $("#cenario");
  btn.addEventListener("click", () => {
    const c = Number(ic.value),
      v = Number(iv.value),
      s = cs.value;
    toast("🔄 Inicializando simulação...");
    estadoSimulacao.ativo = true;
    setTimeout(() => {
      let imp = "Baixo",
        conf = 75,
        area = "5 km²";
      if (s === "Risco de enchente") {
        if (c > 85 && v > 70) {
          imp = "Crítico";
          conf = 95;
          area = "25 km²";
        } else if (c > 70 || v > 60) {
          imp = "Alto";
          conf = 88;
          area = "15 km²";
        } else if (c > 50) {
          imp = "Moderado";
          conf = 82;
          area = "8 km²";
        }
      } else if (s === "Propagação de queimada") {
        if (c < 30 && v > 80) {
          imp = "Crítico";
          conf = 92;
          area = "30 km²";
        } else if (c < 50 && v > 60) {
          imp = "Alto";
          conf = 87;
          area = "18 km²";
        } else if (v > 40) {
          imp = "Moderado";
          conf = 80;
          area = "10 km²";
        }
      } else if (s === "Seca prolongada") {
        if (c < 20 && v > 70) {
          imp = "Crítico";
          conf = 90;
          area = "40 km²";
        } else if (c < 40) {
          imp = "Alto";
          conf = 85;
          area = "22 km²";
        } else if (c < 60) {
          imp = "Moderado";
          conf = 78;
          area = "12 km²";
        }
      }
      const pg = $$(".prediction-grid div");
      if (pg[0]) pg[0].querySelector("strong").textContent = imp;
      if (pg[1]) pg[1].querySelector("strong").textContent = area;
      if (pg[2]) pg[2].querySelector("strong").textContent = `${conf}%`;
      toast(`✓ Simulação: Impacto ${imp}`);
      if (imp === "Crítico") {
        setTimeout(
          () =>
            alert(
              `⚠ ALERTA CRÍTICO!\n\nCenário: ${s}\nImpacto: ${imp}\nÁrea: ${area}\n\nDefesa Civil foi notificada.`,
            ),
          500,
        );
      }
      estadoSimulacao.ativo = false;
    }, 2000);
  });
  ic.addEventListener("input", (e) => {
    const l =
      ic.parentElement.querySelector("label") || document.createElement("span");
    l.textContent = `Chuva acumulada: ${e.target.value}%`;
  });
  iv.addEventListener("input", (e) => {
    const l =
      iv.parentElement.querySelector("label") || document.createElement("span");
    l.textContent = `Intensidade do vento: ${e.target.value}%`;
  });
}

// Relatórios e Exportação (BOM - clipboard, navigator.share)
function relatorios() {
  const btns = $$(".action-row button");
  if (btns[0]) {
    btns[0].addEventListener("click", () => {
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
        toast("✓ Relatório PDF exportado");
      }, 1000);
    });
  }
  if (btns[1]) {
    btns[1].addEventListener("click", async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: "SELENE - Monitoramento Ambiental",
            text: "Confira o monitoramento em tempo real",
            url: window.location.href,
          });
          toast("✓ Compartilhado com sucesso");
        } else {
          await navigator.clipboard.writeText(window.location.href);
          toast("✓ Link copiado");
        }
      } catch (e) {
        console.error("Erro ao compartilhar:", e);
        toast("⚠ Erro ao compartilhar");
      }
    });
  }
}

// Preferências de Notificação (BOM - Notification API, localStorage)
function preferencias() {
  const checks = $$(".toggle-list input[type='checkbox']");
  const prefs = JSON.parse(localStorage.getItem("preferenciasSelene")) || {};
  checks.forEach((cb, i) => {
    cb.checked = prefs[`pref_${i}`] ?? cb.checked;
    cb.addEventListener("change", () => {
      prefs[`pref_${i}`] = cb.checked;
      localStorage.setItem("preferenciasSelene", JSON.stringify(prefs));
      toast("✓ Preferências atualizadas");
      if (i === 0 && cb.checked && "Notification" in window) {
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

// Monitoramento em tempo real (BOM - setInterval)
function iniciarMonitoramento() {
  if (!localStorage.getItem("usuarioEmail")) return;
  const interval = setInterval(() => {
    const agora = new Date();
    const min = Math.floor((agora - estadoSimulacao.ultimaAtualizacao) / 60000);
    const ua = $(".hero-panel div:nth-child(2) strong");
    if (ua) ua.textContent = min > 0 ? `${min} min` : "agora";
    if (min % 2 === 0 && min > 0) {
      const r = $("#regiao").value;
      const d = dadosRegionais[r];
      if (d) {
        const var_ = Math.random() * 5 - 2.5;
        const tv = (parseInt(d.temperatura) + var_).toFixed(1);
        const tc = $$(".metric-card strong")[2];
        if (tc) tc.textContent = `${tv} °C`;
      }
    }
  }, 30000);
  window.addEventListener("beforeunload", () => clearInterval(interval));
}

// Mapa interativo (Event listeners, DOM manipulation)
function mapaInterativo() {
  const pontos = $$(".map-point");
  const nomes = {
    fire: "Queimada",
    flood: "Enchente",
    drought: "Seca",
    slide: "Deslizamento",
  };
  pontos.forEach((p) => {
    p.style.cursor = "pointer";
    p.addEventListener("click", () =>
      toast(`📍 ${nomes[p.classList[1]]} detectada`),
    );
    p.addEventListener("mouseenter", () => (p.style.transform = "scale(1.2)"));
    p.addEventListener("mouseleave", () => (p.style.transform = "scale(1)"));
  });
}

// Sincronização periódica de dados (BOM - setInterval)
function sincronizacaoPeriodica() {
  setInterval(() => {
    if (localStorage.getItem("usuarioEmail")) carregarDadosSelene();
  }, 300000);
}

// Inicialização (Event listeners - DOMContentLoaded)
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await carregarDadosSelene();
    login();
    dashboard();
    ocorrencias();
    simulacao();
    relatorios();
    preferencias();
    mapaInterativo();
    sincronizacaoPeriodica();
    toast("✓ SELENE inicializado e pronto para monitoramento");
  } catch (e) {
    console.error("Erro durante inicialização:", e);
    toast("❌ Erro ao inicializar SELENE");
  }
});

// Tratamento de erros global
window.addEventListener("error", (e) => {
  console.error("Erro global:", e.error);
  toast("⚠ Erro na aplicação: veja console para detalhes");
});
