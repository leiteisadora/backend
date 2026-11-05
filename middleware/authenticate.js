const jwt = require("jsonwebtoken");

const cookieName = "loja_session";
const sessionDurationMs = 8 * 60 * 60 * 1000;

function getAllowedOrigins() {
    return (process.env.FRONTEND_ORIGIN || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}

function isAllowedOrigin(origin) {
    if (!origin) return true;

    const configuredOrigins = getAllowedOrigins();
    if (configuredOrigins.includes(origin)) return true;

    if (process.env.NODE_ENV === "production") return false;

    try {
        const parsedOrigin = new URL(origin);
        return ["localhost", "127.0.0.1"].includes(parsedOrigin.hostname);
    } catch {
        return false;
    }
}

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    return typeof secret === "string" && Buffer.byteLength(secret) >= 32 ? secret : null;
}

function setSessionCookie(res, usuario) {
    const secret = getJwtSecret();
    if (!secret) {
        return res.status(503).send({
            mensagem: "A autenticação não está configurada no servidor."
        });
    }

    const token = jwt.sign(
        {
            id_usu: usuario.id_usu,
            nome: usuario.nome,
            email: usuario.email
        },
        secret,
        {
            algorithm: "HS256",
            expiresIn: "8h",
            issuer: "loja-api",
            audience: "loja-frontend"
        }
    );
    const production = process.env.NODE_ENV === "production";

    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax",
        maxAge: sessionDurationMs,
        path: "/"
    });
    return null;
}

function clearSessionCookie(res) {
    const production = process.env.NODE_ENV === "production";
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax",
        path: "/"
    });
}

function authenticate(req, res, next) {
    if (!isAllowedOrigin(req.get("Origin"))) {
        return res.status(403).send({ mensagem: "Origem não autorizada." });
    }

    const secret = getJwtSecret();
    if (!secret) {
        return res.status(503).send({
            mensagem: "A autenticação não está configurada no servidor."
        });
    }

    const token = req.cookies?.[cookieName];
    if (!token) {
        return res.status(401).send({ mensagem: "Autenticação necessária." });
    }

    try {
        req.usuario = jwt.verify(token, secret, {
            algorithms: ["HS256"],
            issuer: "loja-api",
            audience: "loja-frontend"
        });
        return next();
    } catch {
        clearSessionCookie(res);
        return res.status(401).send({ mensagem: "Sessão inválida ou expirada." });
    }
}

module.exports = {
    authenticate,
    clearSessionCookie,
    cookieName,
    getAllowedOrigins,
    isAllowedOrigin,
    setSessionCookie
};
