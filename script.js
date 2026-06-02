const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
document.addEventListener("DOMContentLoaded", () => {
  login();
  dashboard();
  ocorrencias();
  simulacao();
  relatorios();
  preferencias();
});
function toast(texto) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = texto;
  document.body.append(el);
  setTimeout(() => el.remove(), 3000);
}
function login() {
  $("#acesso form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#email").value;
    localStorage.setItem("usuarioSelene", email);
    toast(`Bem-vindo ao SELENE, ${email}`);
  });
}
function dashboard() {
  const regiao = $("#regiao");
  if (!regiao) return;
  const metricas = $$(".metric-card strong");
  const dados = {
    "Porto Alegre": [17, "31.8 °C", "38%"],
    "São Paulo": [22, "29.4 °C", "52%"],
    Manaus: [12, "34.6 °C", "78%"],
    Curitiba: [9, "24.1 °C", "61%"],
  };
  regiao.addEventListener("change", () => {
    const [alertas, temperatura, umidade] = dados[regiao.value];
    [
      metricas[1].textContent,
      metricas[2].textContent,
      metricas[3].textContent,
    ] = [alertas, temperatura, umidade];
    toast(`Região alterada para ${regiao.value}`);
  });
}
function ocorrencias() {
  const form = $("#monitoramento form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const tipo = $("#tipo-ocorrencia").value.trim();
    const descricao = $("#descricao-ocorrencia").value.trim();
    if (!tipo || !descricao) return toast("Preencha todos os campos.");
    const salvas = JSON.parse(localStorage.getItem("ocorrenciasSelene")) || [];
    salvas.push({ tipo, descricao, data: new Date().toLocaleString() });
    localStorage.setItem("ocorrenciasSelene", JSON.stringify(salvas));
    form.reset();
    toast("Ocorrência registrada com sucesso.");
  });
}
function simulacao() {
  $("#simulacao .button.primary")?.addEventListener("click", () => {
    const chuva = Number($("#chuva").value);
    const vento = Number($("#vento").value);
    const resultado =
      chuva > 85 && vento > 85
        ? "Crítico"
        : chuva > 70 || vento > 70
          ? "Alto"
          : "Baixo";
    $(".prediction-grid strong").textContent = resultado;
    toast(`Simulação concluída: ${resultado}`);
  });
}
function relatorios() {
  const [exportar, compartilhar] = $$(".action-row button");
  exportar?.addEventListener("click", () => toast("Relatório PDF exportado."));
  compartilhar?.addEventListener("click", async () => {
    await navigator.clipboard?.writeText(window.location.href);
    toast("Link copiado.");
  });
}
function preferencias() {
  $$(".toggle-list input").forEach((check) =>
    check.addEventListener("change", () => toast("Preferências atualizadas.")),
  );
}
