const resources = [
  {
    path: "categorias",
    envelope: "categoria",
    id: "id_categoria",
    label: "Categorias",
    singular: "categoria",
    group: "Cadastros",
    icon: "grid",
    description: "Organize os grupos dos seus produtos.",
    fields: [["nome", "Nome", "text"], ["descricao", "Descrição", "textarea"]]
  },
  {
    path: "clientes",
    envelope: "cliente",
    id: "id_cliente",
    label: "Clientes",
    singular: "cliente",
    group: "Cadastros",
    icon: "users",
    description: "Consulte e mantenha os dados dos clientes.",
    fields: [["nome", "Nome", "text"], ["email", "E-mail", "email"], ["contato", "Contato", "tel"]]
  },
  {
    path: "fornecedores",
    envelope: "fornecedor",
    id: "id_fornecedor",
    label: "Fornecedores",
    singular: "fornecedor",
    group: "Cadastros",
    icon: "truck",
    description: "Mantenha os dados de contato dos fornecedores.",
    fields: [["nome", "Nome", "text"], ["empresa", "Empresa", "text"], ["email", "E-mail", "email"], ["telefone", "Telefone", "tel"], ["cidade", "Cidade", "text"], ["estado", "Estado", "text"]]
  },
  {
    path: "funcionarios",
    envelope: "funcionario",
    id: "id_funcionario",
    label: "Funcionários",
    singular: "funcionário",
    group: "Cadastros",
    icon: "user",
    description: "Acesse os registros e dados da equipe.",
    fields: [["nome", "Nome", "text"], ["cargo", "Cargo", "text"], ["salario", "Salário", "number"], ["telefone", "Telefone", "tel"], ["email", "E-mail", "email"]]
  },
  {
    path: "produtos",
    envelope: "produto",
    id: "id_produto",
    label: "Produtos",
    singular: "produto",
    group: "Cadastros",
    icon: "box",
    description: "Gerencie o catálogo de produtos da loja.",
    fields: [["nome", "Nome", "text"], ["descricao", "Descrição", "textarea"], ["preco", "Preço", "number"], ["imagem_produto", "Imagem do produto", "url"]]
  },
  {
    path: "entradas",
    envelope: "entrada",
    id: "id_entrada",
    label: "Entradas",
    singular: "entrada",
    group: "Operações",
    icon: "arrow-down",
    description: "Registre produtos recebidos no estoque.",
    fields: [["id_produto", "Produto", "number"], ["id_fornecedor", "Fornecedor", "number"], ["quantidade", "Quantidade", "number"], ["valor_unitario", "Valor unitário", "number"], ["data_entrada", "Data da entrada", "date"], ["observacao", "Observação", "textarea"]],
    references: {
      id_produto: { path: "produtos", envelope: "produto", id: "id_produto", name: "nome", joined: "produto_nome" },
      id_fornecedor: { path: "fornecedores", envelope: "fornecedor", id: "id_fornecedor", name: "nome", joined: "fornecedor_nome" }
    }
  },
  {
    path: "estoque",
    envelope: "estoque",
    id: "id_estoque",
    label: "Estoque",
    singular: "registro de estoque",
    group: "Operações",
    icon: "layers",
    description: "Acompanhe quantidades e limites de estoque.",
    fields: [["id_produto", "Produto", "number"], ["quantidade", "Quantidade", "number"], ["estoque_minimo", "Estoque mínimo", "number"], ["estoque_maximo", "Estoque máximo", "number"], ["localizacao", "Localização", "text"]],
    references: {
      id_produto: { path: "produtos", envelope: "produto", id: "id_produto", name: "nome", joined: "produto_nome" }
    }
  },
  {
    path: "historico_precos",
    envelope: "historico_preco",
    id: "id_historico",
    label: "Histórico de preços",
    singular: "registro de preço",
    group: "Operações",
    icon: "chart",
    description: "Consulte as alterações de preço dos produtos.",
    fields: [["id_produto", "Produto", "number"], ["preco", "Preço", "number"], ["vigencia", "Vigência", "date"]],
    references: {
      id_produto: { path: "produtos", envelope: "produto", id: "id_produto", name: "nome", joined: "produto_nome" }
    }
  },
  {
    path: "movimentacoes",
    envelope: "movimentacao",
    id: "id_movimentacao",
    label: "Movimentações",
    singular: "movimentação",
    group: "Operações",
    icon: "arrows",
    description: "Acompanhe as movimentações de produtos.",
    fields: [["id_produto", "Produto", "number"], ["tipo", "Tipo", "text"], ["quantidade", "Quantidade", "number"], ["data_movimentacao", "Data da movimentação", "datetime-local"], ["observacao", "Observação", "textarea"]],
    references: {
      id_produto: { path: "produtos", envelope: "produto", id: "id_produto", name: "nome", joined: "produto_nome" }
    }
  },
  {
    path: "pedidos",
    envelope: "pedido",
    id: "id_pedido",
    label: "Pedidos",
    singular: "pedido",
    group: "Operações",
    icon: "clipboard",
    description: "Visualize os pedidos e os clientes associados.",
    fields: [["status", "Status", "text"], ["data_pedido", "Data do pedido", "datetime-local"], ["id_cliente", "Cliente", "number"]],
    references: {
      id_cliente: { path: "clientes", envelope: "cliente", id: "id_cliente", name: "nome", joined: "cliente_nome" }
    }
  },
  {
    path: "pedido_itens",
    envelope: "pedido_item",
    id: "id_item",
    label: "Itens de pedido",
    singular: "item de pedido",
    group: "Operações",
    icon: "list",
    description: "Gerencie os produtos associados a cada pedido.",
    fields: [["id_pedido", "Pedido", "number"], ["id_produto", "Produto", "number"], ["quantidade", "Quantidade", "number"], ["valor_unitario", "Valor unitário", "number"], ["subtotal", "Subtotal", "number"]],
    references: {
      id_pedido: { path: "pedidos", envelope: "pedido", id: "id_pedido", name: "id_pedido", joined: "pedido_referencia" },
      id_produto: { path: "produtos", envelope: "produto", id: "id_produto", name: "nome", joined: "produto_nome" }
    }
  },
  {
    path: "saidas",
    envelope: "saida",
    id: "id_saida",
    label: "Saídas",
    singular: "saída",
    group: "Operações",
    icon: "arrow-up",
    description: "Registre produtos retirados do estoque.",
    fields: [["id_produto", "Produto", "number"], ["id_funcionario", "Funcionário", "number"], ["quantidade", "Quantidade", "number"], ["valor_unitario", "Valor unitário", "number"], ["data_saida", "Data da saída", "datetime-local"], ["destino", "Destino", "text"]],
    references: {
      id_produto: { path: "produtos", envelope: "produto", id: "id_produto", name: "nome", joined: "produto_nome" },
      id_funcionario: { path: "funcionarios", envelope: "funcionario", id: "id_funcionario", name: "nome", joined: "funcionario_nome" }
    }
  },
  {
    path: "logs",
    envelope: "log",
    id: "id_log",
    label: "Logs",
    singular: "log",
    group: "Acompanhamento",
    icon: "history",
    description: "Consulte os registros de atividade disponíveis.",
    fields: [["usuario", "Usuário", "text"], ["tabela_afetada", "Tabela afetada", "text"], ["acao", "Ação", "text"], ["registro", "Registro", "textarea"], ["data_hora", "Data e hora", "datetime-local"]]
  }
];

const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  truck: '<path d="M3 6h12v12H3zM15 10h4l3 3v5h-7"/><circle cx="7.5" cy="18" r="2"/><circle cx="18.5" cy="18" r="2"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  box: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9"/>',
  "arrow-down": '<path d="M12 3v13"/><path d="m6 11 6 6 6-6"/><path d="M5 21h14"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 14 4-4 3 2 6-7"/>',
  arrows: '<path d="M7 7h14l-3-3M17 17H3l3 3"/><path d="m18 4 3 3-3 3M6 14l-3 3 3 3"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6a1.5 1.5 0 0 0-3-1 1.5 1.5 0 0 0-3 1ZM9 11h6M9 15h6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  "arrow-up": '<path d="M12 21V8"/><path d="m6 13 6-6 6 6"/><path d="M5 3h14"/>',
  history: '<path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>'
};

const state = {
  apiBase: localStorage.getItem("loja-api-base") || "https://backend-oz6f.onrender.com",
  resource: resources[0],
  usuario: null,
  records: [],
  editingId: null,
  loading: false,
  requestId: 0,
  toastTimeout: null
};

const elements = {
  loginScreen: document.querySelector("#login-screen"),
  appShell: document.querySelector("#app-shell"),
  loginForm: document.querySelector("#login-form"),
  loginEmail: document.querySelector("#login-email"),
  loginPassword: document.querySelector("#login-password"),
  loginFeedback: document.querySelector("#login-feedback"),
  loginButton: document.querySelector("#login-button"),
  currentUser: document.querySelector("#current-user"),
  nav: document.querySelector("#resource-nav"),
  breadcrumb: document.querySelector("#breadcrumb-current"),
  eyebrow: document.querySelector("#page-eyebrow"),
  title: document.querySelector("#page-title"),
  description: document.querySelector("#page-description"),
  createButton: document.querySelector("#create-button"),
  createButtonLabel: document.querySelector("#create-button-label"),
  connectionStatus: document.querySelector("#connection-status"),
  connectionLabel: document.querySelector("#connection-label"),
  recordCount: document.querySelector("#record-count"),
  search: document.querySelector("#search-input"),
  table: document.querySelector("#table-container"),
  caption: document.querySelector("#table-caption"),
  feedback: document.querySelector("#feedback"),
  recordDialog: document.querySelector("#record-dialog"),
  recordForm: document.querySelector("#record-form"),
  recordDialogTitle: document.querySelector("#record-dialog-title"),
  formEyebrow: document.querySelector("#form-eyebrow"),
  formFields: document.querySelector("#form-fields"),
  saveButton: document.querySelector("#save-button"),
  settingsDialog: document.querySelector("#settings-dialog"),
  settingsForm: document.querySelector("#settings-form"),
  apiUrl: document.querySelector("#api-url"),
  toast: document.querySelector("#toast")
};

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
}

function renderNavigation() {
  elements.nav.replaceChildren();
  let currentGroup = "";

  for (const resource of resources) {
    if (resource.group !== currentGroup) {
      currentGroup = resource.group;
      const heading = document.createElement("div");
      heading.className = "nav-group-label";
      heading.textContent = currentGroup.toUpperCase();
      elements.nav.append(heading);
    }

    const button = document.createElement("button");
    button.className = "nav-link";
    button.type = "button";
    button.dataset.resource = resource.path;
    button.setAttribute("aria-label", resource.label);
    button.setAttribute("aria-current", resource === state.resource ? "page" : "false");
    button.innerHTML = `<span class="nav-icon">${iconSvg(resource.icon)}</span><span>${resource.label}</span>`;
    button.addEventListener("click", () => selectResource(resource));
    elements.nav.append(button);
  }
}

function selectResource(resource) {
  state.resource = resource;
  state.records = [];
  elements.search.value = "";
  elements.feedback.hidden = true;
  updateHeading();
  renderNavigation();
  loadRecords();
}

function updateHeading() {
  const resource = state.resource;
  elements.breadcrumb.textContent = resource.label;
  elements.eyebrow.textContent = resource.group.toUpperCase();
  elements.title.textContent = resource.label;
  elements.description.textContent = resource.description;
  elements.createButtonLabel.textContent = `Cadastrar ${resource.singular}`;
}

function apiUrl(path) {
  return `${state.apiBase.replace(/\/+$/, "")}/${path}`;
}

async function request(path, options = {}, settings = {}) {
  let response;
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique o endereço e se o backend está disponível.");
  }

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const message = body?.mensagem || body?.erro?.mensagem || body?.error?.message;
    if (response.status === 401 && !settings.skipAuthHandling) {
      showLogin("Sua sessão expirou. Entre novamente para continuar.");
    }
    throw new Error(message || `A API respondeu com o status ${response.status}.`);
  }
  return body;
}

function setConnectionStatus(status, label) {
  elements.connectionStatus.dataset.state = status;
  elements.connectionLabel.textContent = label;
}

function showFeedback(message, type = "error") {
  elements.feedback.textContent = message;
  elements.feedback.dataset.type = type;
  elements.feedback.hidden = false;
}

function showToast(message, type = "success") {
  window.clearTimeout(state.toastTimeout);
  elements.toast.textContent = message;
  elements.toast.dataset.type = type;
  elements.toast.classList.add("visible");
  state.toastTimeout = window.setTimeout(() => elements.toast.classList.remove("visible"), 3500);
}

function getDisplayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function renderTable() {
  const searchTerm = elements.search.value.trim().toLocaleLowerCase("pt-BR");
  const records = state.records.filter(record =>
    !searchTerm || Object.values(record).some(value =>
      getDisplayValue(value).toLocaleLowerCase("pt-BR").includes(searchTerm)
    )
  );
  elements.recordCount.textContent = String(records.length);
  elements.caption.textContent = searchTerm
    ? `${records.length} de ${state.records.length} registros encontrados.`
    : "Dados e relacionamentos carregados da API.";
  elements.table.replaceChildren();

  if (state.loading) {
    const loading = document.createElement("div");
    loading.className = "loading-state";
    loading.innerHTML = '<span class="spinner" aria-hidden="true"></span>Carregando dados...';
    elements.table.append(loading);
    return;
  }

  if (records.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = searchTerm
      ? '<span class="empty-symbol" aria-hidden="true">⌕</span><strong>Nenhum resultado</strong><p>Tente buscar por outro termo.</p>'
      : '<span class="empty-symbol" aria-hidden="true">＋</span><strong>Nenhum registro encontrado</strong><p>Crie um registro para começar ou atualize a lista.</p>';
    elements.table.append(empty);
    return;
  }

  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headingRow = document.createElement("tr");
  const fields = [
    { key: state.resource.id, label: "ID" },
    ...state.resource.fields.map(([key, label]) => ({
      key,
      label,
      displayKey: state.resource.references?.[key]?.joined || key
    }))
  ];

  for (const field of fields) {
    const heading = document.createElement("th");
    heading.scope = "col";
    heading.textContent = field.label;
    headingRow.append(heading);
  }
  const actionsHeading = document.createElement("th");
  actionsHeading.scope = "col";
  actionsHeading.textContent = "Ações";
  actionsHeading.style.textAlign = "right";
  headingRow.append(actionsHeading);
  head.append(headingRow);

  const body = document.createElement("tbody");
  for (const record of records) {
    const row = document.createElement("tr");
    for (const field of fields) {
      const cell = document.createElement("td");
      const value = record[field.displayKey];
      cell.textContent = getDisplayValue(value ?? record[field.key]);
      if (field.key === state.resource.fields[0][0]) cell.className = "cell-primary";
      row.append(cell);
    }

    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "row-actions";
    actionGroup.append(
      createRowAction("Editar registro", "edit", () => openRecordDialog(record)),
      createRowAction("Excluir registro", "delete", () => deleteRecord(record))
    );
    actions.append(actionGroup);
    row.append(actions);
    body.append(row);
  }
  table.append(head, body);
  elements.table.append(table);
}

function createRowAction(label, action, callback) {
  const button = document.createElement("button");
  button.className = `row-action${action === "delete" ? " delete" : ""}`;
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = action === "edit"
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg>';
  button.addEventListener("click", callback);
  return button;
}

async function loadRecords() {
  const requestId = ++state.requestId;
  const resource = state.resource;
  state.loading = true;
  elements.feedback.hidden = true;
  setConnectionStatus("loading", "Conectando à API");
  renderTable();

  try {
    const body = await request(resource.path);
    if (requestId !== state.requestId) return;
    const records = body?.[resource.envelope];
    if (!Array.isArray(records)) {
      throw new Error(`A resposta de /${resource.path} não contém a lista esperada "${resource.envelope}".`);
    }
    state.records = records;
    state.loading = false;
    setConnectionStatus("connected", "API conectada");
    renderTable();
  } catch (error) {
    if (requestId !== state.requestId) return;
    state.records = [];
    state.loading = false;
    setConnectionStatus("error", "API indisponível");
    renderTable();
    showFeedback(error.message);
  }
}

async function openRecordDialog(record = null) {
  const resource = state.resource;
  const references = resource.references || {};
  const optionsByField = new Map();
  try {
    await Promise.all(Object.entries(references).map(async ([key, reference]) => {
      const body = await request(reference.path);
      const options = body?.[reference.envelope];
      if (!Array.isArray(options)) {
        const label = resource.fields.find(([fieldKey]) => fieldKey === key)?.[1] || key;
        throw new Error(`Não foi possível carregar as opções de ${label.toLocaleLowerCase("pt-BR")}.`);
      }
      optionsByField.set(key, options);
    }));
  } catch (error) {
    showToast(error.message, "error");
    return;
  }

  if (state.resource !== resource) return;

  state.editingId = record ? record[resource.id] : null;
  elements.recordDialogTitle.textContent = record ? `Editar ${resource.singular}` : `Criar ${resource.singular}`;
  elements.formEyebrow.textContent = record ? "EDIÇÃO" : "CADASTRO";
  elements.saveButton.disabled = false;
  elements.saveButton.textContent = "Salvar";
  elements.formFields.replaceChildren();

  for (const [key, label, type] of resource.fields) {
    const group = document.createElement("div");
    group.className = "field-group";
    if (type === "textarea" || resource.fields.length === 1) group.classList.add("full-width");

    const fieldLabel = document.createElement("label");
    fieldLabel.className = "field-label";
    fieldLabel.htmlFor = `field-${key}`;
    fieldLabel.append(document.createTextNode(label));
    const fieldKey = document.createElement("span");
    fieldKey.className = "field-key";
    fieldKey.textContent = key;
    fieldLabel.append(fieldKey);

    const reference = references[key];
    const input = document.createElement(reference ? "select" : type === "textarea" ? "textarea" : "input");
    input.className = "field-input";
    input.id = `field-${key}`;
    input.name = key;
    if (reference) {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = `Selecione ${label.toLocaleLowerCase("pt-BR")}`;
      input.append(placeholder);
      for (const optionRecord of optionsByField.get(key)) {
        const option = document.createElement("option");
        option.value = String(optionRecord[reference.id]);
        const name = optionRecord[reference.name];
        option.textContent = reference.name === "id_pedido"
          ? `Pedido #${name}`
          : `${getDisplayValue(name)} (#${optionRecord[reference.id]})`;
        input.append(option);
      }
    } else if (type !== "textarea") input.type = type;
    if (type === "number") input.step = "any";
    if (reference && record?.[key] !== null && record?.[key] !== undefined) input.value = String(record[key]);
    else if (type === "datetime-local" && record?.[key]) input.value = toLocalDateTime(record[key]);
    else if (type !== "textarea" && record?.[key] !== null && record?.[key] !== undefined) input.value = String(record[key]);
    else if (type === "textarea" && record?.[key] !== null && record?.[key] !== undefined) input.value = String(record[key]);
    group.append(fieldLabel, input);
    elements.formFields.append(group);
  }

  elements.recordDialog.showModal();
  elements.formFields.querySelector("input, textarea")?.focus();
}

function toLocalDateTime(value) {
  const normalized = String(value).replace(" ", "T");
  return normalized.length >= 16 ? normalized.slice(0, 16) : normalized;
}

function readFormPayload() {
  const payload = {};
  for (const [key, , type] of state.resource.fields) {
    const value = elements.recordForm.elements.namedItem(key).value.trim();
    payload[key] = type === "number" ? (value === "" ? null : Number(value)) : (value === "" ? null : value);
  }
  return payload;
}

async function saveRecord(event) {
  event.preventDefault();
  if (!elements.recordForm.reportValidity()) return;

  const editing = state.editingId !== null;
  const path = editing
    ? `${state.resource.path}/${encodeURIComponent(state.editingId)}`
    : state.resource.path;
  elements.saveButton.disabled = true;
  elements.saveButton.textContent = "Salvando...";

  try {
    await request(path, {
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(readFormPayload())
    });
    elements.recordDialog.close();
    showToast(editing ? "Registro atualizado." : "Registro criado.");
    await loadRecords();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    elements.saveButton.disabled = false;
    elements.saveButton.textContent = "Salvar";
  }
}

async function deleteRecord(record) {
  const id = record[state.resource.id];
  if (!window.confirm(`Excluir este registro de ${state.resource.singular}? Esta ação não pode ser desfeita.`)) return;

  try {
    await request(`${state.resource.path}/${encodeURIComponent(id)}`, { method: "DELETE" });
    showToast("Registro excluído.");
    await loadRecords();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function openSettings() {
  elements.apiUrl.value = state.apiBase;
  elements.settingsDialog.showModal();
  elements.apiUrl.focus();
}

function saveSettings(event) {
  event.preventDefault();
  if (!elements.settingsForm.reportValidity()) return;
  let parsedUrl;
  try {
    parsedUrl = new URL(elements.apiUrl.value.trim());
  } catch {
    showToast("Informe um endereço válido para a API.", "error");
    return;
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    showToast("Use um endereço http:// ou https:// válido, sem credenciais.", "error");
    return;
  }
  state.apiBase = parsedUrl.origin + parsedUrl.pathname.replace(/\/+$/, "");
  localStorage.setItem("loja-api-base", state.apiBase);
  elements.settingsDialog.close();
  verifySession();
}

function showLogin(message = "") {
  state.usuario = null;
  elements.appShell.hidden = true;
  elements.loginScreen.hidden = false;
  elements.loginFeedback.textContent = message;
  elements.loginFeedback.hidden = !message;
  elements.loginPassword.value = "";
}

function showApp(usuario) {
  state.usuario = usuario;
  elements.currentUser.textContent = usuario?.nome || usuario?.email || "";
  elements.loginScreen.hidden = true;
  elements.appShell.hidden = false;
}

async function verifySession() {
  try {
    const body = await request("usuario/me");
    showApp(body.usuario);
    loadRecords();
  } catch (error) {
    showLogin(error.message);
  }
}

async function login(event) {
  event.preventDefault();
  if (!elements.loginForm.reportValidity()) return;

  elements.loginButton.disabled = true;
  elements.loginButton.textContent = "Entrando...";
  elements.loginFeedback.hidden = true;
  try {
    const body = await request("usuario/login", {
      method: "POST",
      body: JSON.stringify({
        email: elements.loginEmail.value.trim(),
        senha: elements.loginPassword.value
      })
    }, { skipAuthHandling: true });
    elements.loginPassword.value = "";
    showApp(body.usuario);
    loadRecords();
  } catch (error) {
    elements.loginFeedback.textContent = error.message;
    elements.loginFeedback.hidden = false;
  } finally {
    elements.loginButton.disabled = false;
    elements.loginButton.textContent = "Entrar";
  }
}

async function logout() {
  try {
    await request("usuario/logout", { method: "POST" });
    showLogin("Você saiu do sistema.");
  } catch (error) {
    showToast(error.message, "error");
  }
}

for (const button of document.querySelectorAll("[data-close-dialog]")) {
  button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close());
}

document.querySelector("#create-button").addEventListener("click", () => openRecordDialog());
document.querySelector("#refresh-button").addEventListener("click", loadRecords);
document.querySelector("#settings-button").addEventListener("click", openSettings);
document.querySelector("#login-settings-button").addEventListener("click", openSettings);
document.querySelector("#logout-button").addEventListener("click", logout);
elements.search.addEventListener("input", renderTable);
elements.recordForm.addEventListener("submit", saveRecord);
elements.settingsForm.addEventListener("submit", saveSettings);
elements.loginForm.addEventListener("submit", login);
document.addEventListener("keydown", event => {
  if (event.key === "/" && !elements.recordDialog.open && !elements.settingsDialog.open &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.search.focus();
  }
});

renderNavigation();
updateHeading();
verifySession();
