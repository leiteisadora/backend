const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcryptjs');
const {
    authenticate,
    clearSessionCookie,
    isAllowedOrigin,
    setSessionCookie
} = require("../middleware/authenticate");

router.post('/login', (req, res) => {
    if (!isAllowedOrigin(req.get("Origin"))) {
        return res.status(403).send({ mensagem: "Origem não autorizada." });
    }

    const { email, senha } = req.body || {};

    if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha) {
        return res.status(400).send({ mensagem: "Informe email e senha." });
    }

    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT id_usu, nome, email, senha, contato, genero FROM usuarios WHERE email = ? AND ativo = 1 LIMIT 1",
            [email.trim()],
            async (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });

                const usuario = resultado[0];
                if (!usuario) {
                    return res.status(401).send({ mensagem: "Email ou senha inválidos." });
                }

                const senhaArmazenada = usuario.senha;
                let senhaValida;
                if (/^\$2[aby]\$/.test(senhaArmazenada)) {
                    try {
                        senhaValida = await bcrypt.compare(senha, senhaArmazenada);
                    } catch (error) {
                        console.error("Erro ao validar senha do usuário:", error);
                        return res.status(500).send({ mensagem: "Erro ao validar login." });
                    }
                } else {
                    senhaValida = senha === senhaArmazenada;
                }

                if (!senhaValida) {
                    return res.status(401).send({ mensagem: "Email ou senha inválidos." });
                }

                const sessionError = setSessionCookie(res, usuario);
                if (sessionError) return sessionError;

                delete usuario.senha;
                res.status(200).send({
                    mensagem: "Login realizado com sucesso.",
                    usuario
                });
            }
        );
    });
});

router.post('/logout', (req, res) => {
    if (!isAllowedOrigin(req.get("Origin"))) {
        return res.status(403).send({ mensagem: "Origem não autorizada." });
    }

    clearSessionCookie(res);
    res.status(200).send({ mensagem: "Logout realizado com sucesso." });
});

router.use(authenticate);

router.get('/me', (req, res) => {
    const { id_usu, nome, email } = req.usuario;
    res.status(200).send({ usuario: { id_usu, nome, email } });
});

//LISTAR USUARIOS
router.get('/', (req, res) => {
   
mysql.getConnection((error, conn) => {
   if (error) return res.status(500).send({ error });
      conn.query("SELECT id_usu, nome, email, contato, genero, ativo FROM usuarios", (error, resultado) => {
      conn.release();
   if (error) return res.status(500).send({ error });
      res.status(200).send({ usuario: resultado });
      });
   });
});


//LISTA APENAS UM USUARIO
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query("SELECT id_usu, nome, email, contato, genero, ativo FROM usuarios WHERE id_usu = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });
            res.status(200).send({ usuario: resultado });
        });
    });
});

router.post('/', async (req, res) => {
    if (typeof req.body.senha !== "string" || !req.body.senha) {
        return res.status(400).send({ mensagem: "Informe uma senha válida." });
    }

    let senhaHash;
    try {
        senhaHash = await bcrypt.hash(req.body.senha, 12);
    } catch (error) {
        console.error("Erro ao proteger senha do usuário:", error);
        return res.status(500).send({ mensagem: "Erro ao criar usuário." });
    }

    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
    "INSERT INTO usuarios (nome, email, senha, contato, genero) VALUES (?, ?, ?, ?, ?)",
    [req.body.nome, req.body.email, senhaHash, req.body.contato, req.body.genero],
    (error, resultado) => {
        conn.release();
                if (error) return res.status(500).send({ error: error });
                res.status(201).send({
                    mensagem: "Usuário criado com sucesso!",
                    id_usuario: resultado.insertId
                });
            }
        );
    });
});


router.patch('/:id', async (req, res) => {
    if (typeof req.body.senha !== "string" || !req.body.senha) {
        return res.status(400).send({ mensagem: "Informe uma senha válida." });
    }

    let senhaHash;
    try {
        senhaHash = await bcrypt.hash(req.body.senha, 12);
    } catch (error) {
        console.error("Erro ao proteger senha do usuário:", error);
        return res.status(500).send({ mensagem: "Erro ao atualizar usuário." });
    }

    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
            "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id_usu = ?",
            [req.body.nome, req.body.email, senhaHash, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error: error });
                res.status(202).send({ mensagem: "Usuário atualizado com sucesso!" });
            }
        );
    });
});

router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query("DELETE FROM usuarios WHERE id_usu = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });
            res.status(202).send({ mensagem: "Usuário removido com sucesso!" });
        });
    });
});








module.exports=router;