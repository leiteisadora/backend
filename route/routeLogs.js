const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR LOGS
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("SELECT * FROM logs", (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ log: resultado });
        });
    });
});

// LISTAR APENAS UM LOG
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("SELECT * FROM logs WHERE id_log = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ log: resultado });
        });
    });
});

// CADASTRAR LOG
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO logs (usuario, tabela_afetada, acao, registro, data_hora) VALUES (?, ?, ?, ?, ?)",
            [req.body.usuario, req.body.tabela_afetada, req.body.acao, req.body.registro, req.body.data_hora],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Log criado com sucesso!",
                    id_log: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR LOG
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE logs SET usuario = ?, tabela_afetada = ?, acao = ?, registro = ?, data_hora = ? WHERE id_log = ?",
            [req.body.usuario, req.body.tabela_afetada, req.body.acao, req.body.registro, req.body.data_hora, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Log atualizado com sucesso!" });
            }
        );
    });
});

// DELETAR LOG
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM logs WHERE id_log = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Log removido com sucesso!" });
        });
    });
});

module.exports = router;
