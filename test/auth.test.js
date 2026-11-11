const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAllowedOrigin, setSessionCookie } = require("../middleware/authenticate");

process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";
process.env.FRONTEND_ORIGIN = "http://localhost:8765";
process.env.NODE_ENV = "test";

const passwordHash = bcrypt.hashSync("senha-segura", 4);
const usuarioTeste = {
    id_usu: 7,
    nome: "Usuária de teste",
    email: "teste@example.invalid",
    senha: passwordHash,
    contato: null,
    genero: null
};
const usuarioPublicoTeste = {
    id_usu: usuarioTeste.id_usu,
    nome: usuarioTeste.nome,
    email: usuarioTeste.email,
    contato: usuarioTeste.contato,
    genero: usuarioTeste.genero,
    ativo: 1
};
const queries = [];
const mockedMysql = {
    pool: {
        getConnection(callback) {
            callback(null, {
                query(sql, params, queryCallback) {
                    if (typeof params === "function") {
                        queryCallback = params;
                        params = [];
                    }
                    queries.push({ sql, params });
                    if (sql.includes("FROM usuarios WHERE email = ?")) {
                        queryCallback(null, params[0] === usuarioTeste.email ? [{ ...usuarioTeste }] : []);
                    } else if (sql.includes("FROM usuarios WHERE id_usu = ?")) {
                        queryCallback(null, Number(params[0]) === usuarioPublicoTeste.id_usu ? [{ ...usuarioPublicoTeste }] : []);
                    } else if (sql.includes("FROM usuarios")) {
                        queryCallback(null, [{ ...usuarioPublicoTeste }]);
                    } else if (sql.includes("FROM saidas s")) {
                        queryCallback(null, [{
                            id_saida: 3,
                            id_produto: 4,
                            produto_nome: "Produto relacionado",
                            id_funcionario: 7,
                            funcionario_nome: "Funcionária relacionada"
                        }]);
                    } else if (sql.startsWith("INSERT INTO usuarios")) {
                        queryCallback(null, { insertId: 99 });
                    } else {
                        queryCallback(null, []);
                    }
                },
                release() {}
            });
        }
    }
};

require.cache[require.resolve("../mysql")] = {
    id: require.resolve("../mysql"),
    filename: require.resolve("../mysql"),
    loaded: true,
    exports: mockedMysql
};

const app = require("../app");
let server;
let baseUrl;

before(async () => {
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

async function loginAndGetCookie() {
    const response = await fetch(`${baseUrl}/usuario/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            origin: process.env.FRONTEND_ORIGIN
        },
        body: JSON.stringify({ email: usuarioTeste.email, senha: "senha-segura" })
    });
    assert.equal(response.status, 200);
    return response.headers.get("set-cookie").split(";")[0];
}

after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("bloqueia recursos administrativos sem sessão", async () => {
    const response = await fetch(`${baseUrl}/saidas`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { mensagem: "Autenticação necessária." });
});

test("bloqueia consultas de usuários sem sessão antes de acessar o banco", async () => {
    const queryCount = queries.length;
    for (const path of ["/usuario", "/usuario/7"]) {
        const response = await fetch(`${baseUrl}${path}`);
        assert.equal(response.status, 401);
        assert.deepEqual(await response.json(), { mensagem: "Autenticação necessária." });
    }
    assert.equal(queries.length, queryCount);
});

test("recusa origem não autorizada no login", async () => {
    const response = await fetch(`${baseUrl}/usuario/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            origin: "https://origem-nao-autorizada.example"
        },
        body: JSON.stringify({ email: usuarioTeste.email, senha: "senha-segura" })
    });
    assert.equal(response.status, 403);
});

test("CORS permite credenciais apenas para a origem configurada", async () => {
    const response = await fetch(`${baseUrl}/saidas`, {
        method: "OPTIONS",
        headers: {
            origin: process.env.FRONTEND_ORIGIN,
            "access-control-request-method": "GET",
            "access-control-request-headers": "content-type"
        }
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), process.env.FRONTEND_ORIGIN);
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    assert.equal(isAllowedOrigin("https://origem-nao-autorizada.example"), false);
});

test("login válido cria cookie HttpOnly e libera consultas protegidas", async () => {
    const loginResponse = await fetch(`${baseUrl}/usuario/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            origin: process.env.FRONTEND_ORIGIN
        },
        body: JSON.stringify({ email: usuarioTeste.email, senha: "senha-segura" })
    });
    assert.equal(loginResponse.status, 200);
    const loginBody = await loginResponse.json();
    assert.equal(loginBody.usuario.id_usu, usuarioTeste.id_usu);
    assert.equal(Object.hasOwn(loginBody.usuario, "senha"), false);
    const setCookie = loginResponse.headers.get("set-cookie");
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Lax/i);
    const sessionCookie = setCookie.split(";")[0];

    const meResponse = await fetch(`${baseUrl}/usuario/me`, {
        headers: { cookie: sessionCookie, origin: process.env.FRONTEND_ORIGIN }
    });
    assert.equal(meResponse.status, 200);
    assert.deepEqual((await meResponse.json()).usuario, {
        id_usu: usuarioTeste.id_usu,
        nome: usuarioTeste.nome,
        email: usuarioTeste.email
    });

    const exitsResponse = await fetch(`${baseUrl}/saidas`, {
        headers: { cookie: sessionCookie, origin: process.env.FRONTEND_ORIGIN }
    });
    assert.equal(exitsResponse.status, 200);
    assert.equal((await exitsResponse.json()).saida[0].funcionario_nome, "Funcionária relacionada");
});

test("consultas e novos cadastros de usuário não expõem senha em texto puro", async () => {
    const sessionCookie = await loginAndGetCookie();
    const listResponse = await fetch(`${baseUrl}/usuario`, {
        headers: { cookie: sessionCookie, origin: process.env.FRONTEND_ORIGIN }
    });
    assert.equal(listResponse.status, 200);
    const listBody = await listResponse.json();
    assert.deepEqual(listBody.usuario, [usuarioPublicoTeste]);
    assert.equal(Object.hasOwn(listBody.usuario[0], "senha"), false);
    assert.doesNotMatch(queries.at(-1).sql, /SELECT \*|senha/i);

    const createResponse = await fetch(`${baseUrl}/usuario`, {
        method: "POST",
        headers: {
            cookie: sessionCookie,
            origin: process.env.FRONTEND_ORIGIN,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            nome: "Conta teste",
            email: "nova@example.invalid",
            senha: "nova-senha",
            contato: "",
            genero: ""
        })
    });
    assert.equal(createResponse.status, 201);
    const insertion = queries.at(-1);
    assert.match(insertion.params[2], /^\$2[aby]\$/);
    assert.equal(await bcrypt.compare("nova-senha", insertion.params[2]), true);
});

test("GET /usuario/:id retorna o usuário correspondente sem expor senha", async () => {
    const sessionCookie = await loginAndGetCookie();
    const response = await fetch(`${baseUrl}/usuario/${usuarioPublicoTeste.id_usu}`, {
        headers: { cookie: sessionCookie, origin: process.env.FRONTEND_ORIGIN }
    });

    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).usuario, [usuarioPublicoTeste]);
    assert.deepEqual(queries.at(-1).params, [String(usuarioPublicoTeste.id_usu)]);
    assert.doesNotMatch(queries.at(-1).sql, /SELECT \*|senha/i);
});

test("logout remove o cookie da sessão", async () => {
    const response = await fetch(`${baseUrl}/usuario/logout`, {
        method: "POST",
        headers: { origin: process.env.FRONTEND_ORIGIN }
    });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/i);
});

test("token com assinatura inválida não autoriza acesso", async () => {
    const invalidToken = jwt.sign({ id_usu: 7 }, "different-secret-with-at-least-32-chars", {
        expiresIn: "1h",
        issuer: "loja-api",
        audience: "loja-frontend"
    });
    const response = await fetch(`${baseUrl}/saidas`, {
        headers: {
            cookie: `loja_session=${invalidToken}`,
            origin: process.env.FRONTEND_ORIGIN
        }
    });
    assert.equal(response.status, 401);
});

test("cookie de produção exige HTTPS e permite frontend em outra origem", () => {
    const previousEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    let cookieOptions;
    try {
        setSessionCookie({
            cookie(name, token, options) {
                assert.equal(name, "loja_session");
                assert.ok(token);
                cookieOptions = options;
            }
        }, usuarioTeste);
    } finally {
        process.env.NODE_ENV = previousEnvironment;
    }

    assert.equal(cookieOptions.httpOnly, true);
    assert.equal(cookieOptions.secure, true);
    assert.equal(cookieOptions.sameSite, "none");
});
