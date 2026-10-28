const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcryptjs');

router.post('/login', (req, res) => {
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

                delete usuario.senha;
                res.status(200).send({
                    mensagem: "Login realizado com sucesso.",
                    usuario
                });
            }
        );
    });
});

//LISTAR USUARIOS
router.get('/', (req, res) => {
   
mysql.getConnection((error, conn) => {
   if (error) return res.status(500).send({ error });
      conn.query("SELECT * FROM usuarios", (error, resultado) => {
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
        conn.query("SELECT * FROM usuarios WHERE id_usu = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });
            res.status(200).send({ usuario: resultado });
        });
    });
});

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
    "INSERT INTO usuarios (nome, email, senha, contato, genero) VALUES (?, ?, ?, ?, ?)",
    [req.body.nome, req.body.email, req.body.senha, req.body.contato, req.body.genero],
    (error, resultado) => {
                console.log(error)
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


router.patch('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
            "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id_usu = ?",
            [req.body.nome, req.body.email, req.body.senha, req.params.id],
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