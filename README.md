# SELENE

### Monitoramento Ambiental
---

# Global Solution 2026

Projeto desenvolvido para a Global Solution da FIAP com o objetivo de aplicar conceitos da indústria espacial na resolução de problemas ambientais por meio do monitoramento inteligente baseado em dados orbitais.

---

# Sobre o Projeto

O SELENE é uma plataforma de monitoramento ambiental inteligente que utiliza dados orbitais, sensoriamento remoto e análise de riscos para auxiliar órgãos públicos, pesquisadores, agricultores e equipes de emergência na prevenção de desastres naturais.

A solução transforma dados provenientes de satélites em informações acessíveis e acionáveis, permitindo monitoramento em tempo real, geração de alertas, visualização geográfica de eventos ambientais e apoio à tomada de decisão.

---

# FRONT-END DESIGN

<img src="https://skillicons.dev/icons?i=html,css,git,github,vscode&theme=light" />

---

## Problema que a Interface Busca Resolver

Atualmente, informações ambientais importantes encontram-se distribuídas em diferentes sistemas, dificultando o acesso rápido e a tomada de decisão durante situações críticas como queimadas, enchentes, secas e deslizamentos.

A plataforma SELENE centraliza essas informações em uma única interface intuitiva, permitindo que usuários visualizem dados ambientais em tempo real, recebam alertas preventivos e acompanhem indicadores ambientais baseados em dados espaciais.

---

## Estrutura da Interface

A interface foi organizada em módulos independentes para facilitar a navegação e melhorar a experiência do usuário.

### Dashboard

Exibição de indicadores ambientais, métricas operacionais e tendências de risco.

### Monitoramento

Acompanhamento de eventos ambientais em tempo real.

### Alertas

Visualização e gerenciamento de alertas classificados por criticidade.

### Mapa Interativo

Representação geográfica das áreas monitoradas.

### Telemetria

Exibição das informações recebidas de sensores e fontes orbitais.

### Histórico

Registro e consulta de ocorrências ambientais.

### Simulação

Previsão de cenários ambientais com base em parâmetros configuráveis.

### Administração

Controle de usuários, permissões e indicadores do sistema.

### Educação Ambiental

Conteúdos educativos relacionados à sustentabilidade e prevenção de riscos.

---

## Justificativa das Cores

A identidade visual da plataforma foi desenvolvida para transmitir tecnologia, inovação e confiabilidade.

### Azul (#4F7CFF)

Representa tecnologia, monitoramento e segurança.

### Roxo (#7C3AED)

Remete à inovação, ciência e exploração espacial.

### Ciano (#00D4FF)

Representa conectividade, comunicação orbital e fluxo de dados.

### Branco e Tons Claros

Utilizados para proporcionar contraste, legibilidade e conforto visual.

---

## Justificativa da Tipografia

Foi utilizada a família tipográfica:

```css
Segoe UI, system-ui, sans-serif
```

A escolha foi realizada considerando:

- Excelente legibilidade;
- Aparência moderna;
- Compatibilidade entre navegadores;
- Boa experiência em dispositivos móveis e desktops.

---

## Usabilidade

A interface foi desenvolvida seguindo princípios de UX/UI:

- Navegação intuitiva;
- Hierarquia visual clara;
- Componentes reutilizáveis;
- Design responsivo;
- Facilidade de acesso às informações críticas;
- Organização modular das funcionalidades.

---

## Relação com a Indústria Espacial

O SELENE utiliza conceitos da indústria espacial por meio do uso de dados orbitais para monitoramento ambiental, prevenção de riscos e apoio à tomada de decisão.

A solução demonstra como tecnologias originalmente desenvolvidas para aplicações espaciais podem contribuir para resolver problemas ambientais na Terra.

### ODS Relacionados

- ODS 9 – Indústria, Inovação e Infraestrutura
- ODS 11 – Cidades e Comunidades Sustentáveis
- ODS 13 – Ação Contra a Mudança Global do Clima

---

# WEB DEVELOPMENT

<img src="https://skillicons.dev/icons?i=js,git,github,vscode&theme=light" />

---

# Manual de Interatividade

A seguir estão descritas todas as funcionalidades interativas implementadas no sistema.

---

## 1. Login da Plataforma

### Como testar

1. Acesse a seção **Acesso à Plataforma**.
2. Digite um e-mail válido.
3. Digite uma senha com no mínimo 6 caracteres.
4. Clique em **Entrar**.

### Resultado esperado

- Validação dos campos.
- Autenticação simulada.
- Armazenamento da sessão no Local Storage.
- Exibição de mensagem de boas-vindas.

### Conceitos utilizados

- Event Listener
- DOM
- Local Storage
- Estruturas condicionais

---

## 2. Sincronização de Dados Orbitais

### Como testar

Ao abrir a aplicação, aguarde alguns segundos.

### Resultado esperado

O sistema realiza uma sincronização simulada dos dados orbitais através do arquivo JSON.

São atualizados automaticamente:

- Temperatura média
- Umidade média
- Eficiência do sinal orbital
- Status da comunicação orbital

### Conceitos utilizados

- Fetch API
- JSON
- JavaScript Assíncrono
- Manipulação do DOM

---

## 3. Informações Orbitais

### Como testar

Após o carregamento da página.

### Resultado esperado

É criada dinamicamente uma área contendo:

- Localização monitorada
- Latitude
- Longitude
- Eficiência do sinal
- Status orbital

### Conceitos utilizados

- Criação dinâmica de elementos HTML
- DOM
- JavaScript

---

## 4. Dashboard Dinâmico

### Como testar

1. Acesse a seção Dashboard.
2. Altere a região monitorada.

### Resultado esperado

O sistema atualiza automaticamente:

- Alertas ativos
- Temperatura média
- Umidade relativa
- Status de risco

### Conceitos utilizados

- DOM
- Eventos
- Estruturas condicionais

---

## 5. Registro de Ocorrências

### Como testar

1. Acesse a seção Monitoramento.
2. Informe o tipo da ocorrência.
3. Digite uma descrição.
4. Clique em **Registrar Ocorrência**.

### Resultado esperado

- Validação dos campos.
- Registro da ocorrência.
- Armazenamento local.
- Exibição de notificação de sucesso.

### Conceitos utilizados

- Formulários
- DOM
- Local Storage
- Eventos

---

## 6. Simulação Ambiental

### Como testar

1. Acesse a seção Simulação.
2. Escolha um cenário ambiental.
3. Ajuste os parâmetros.
4. Clique em **Iniciar Simulação**.

### Resultado esperado

O sistema calcula automaticamente:

- Nível de impacto
- Área afetada
- Confiança da previsão

Possíveis resultados:

- Baixo
- Moderado
- Alto
- Crítico

Quando o impacto é crítico, um alerta do navegador é exibido.

### Conceitos utilizados

- Variáveis
- Estruturas condicionais
- DOM
- BOM
- Alert()

---

## 7. Exportação de Relatórios

### Como testar

Clique em:

**Exportar PDF**

### Resultado esperado

O sistema realiza uma exportação simulada do relatório ambiental e exibe uma mensagem de confirmação.

### Conceitos utilizados

- Eventos
- DOM

---

## 8. Compartilhamento

### Como testar

Clique em:

**Compartilhar**

### Resultado esperado

O link da aplicação é copiado automaticamente para a área de transferência.

### Conceitos utilizados

- Clipboard API
- BOM

---

## 9. Preferências de Notificação

### Como testar

Marque ou desmarque qualquer opção na seção de notificações.

### Resultado esperado

O sistema registra a alteração e exibe uma confirmação visual.

### Conceitos utilizados

- Event Listeners
- DOM

---

# Recursos JavaScript Implementados

## Manipulação do DOM

- Atualização dinâmica de métricas.
- Atualização de informações orbitais.
- Criação de notificações Toast.
- Alteração de conteúdo em tempo real.
- Atualização de resultados das simulações.

## Eventos

- Login.
- Troca de região monitorada.
- Registro de ocorrências.
- Simulações.
- Exportação de relatórios.
- Compartilhamento.
- Preferências de notificação.

## Browser Object Model (BOM)

- Local Storage.
- Fetch API.
- Clipboard API.
- Alert().
- setTimeout().
- setInterval().
- Window Object.

---

# Estrutura do Projeto

```text
SELENE
│
├── index.html
├── style.css
├── script.js
├── dados_selene.json
├── assets/
└── README.md
```

---

# Publicação

A aplicação encontra-se disponível através do GitHub Pages:

https://coelhokauap.github.io/SELENE/

---

# Integrantes

- Anita Palhares
- Kauã Coelho
- Vitória Kereski

---

# Conclusão

O SELENE demonstra como tecnologias inspiradas na indústria espacial podem ser aplicadas à resolução de problemas ambientais reais. A plataforma integra monitoramento, análise de riscos, alertas e apoio à tomada de decisão em uma única solução acessível, moderna e intuitiva, transformando dados orbitais em informações estratégicas para proteção ambiental e prevenção de desastres.
