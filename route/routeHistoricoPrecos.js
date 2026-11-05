const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR HISTÓRICO DE PREÇOS
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT h.*, p.nome AS produto_nome FROM historico_precos h LEFT JOIN produtos p ON p.id_produto = h.id_produto",
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ historico_preco: resultado });
        });
    });
});

// LISTAR APENAS UM REGISTRO DO HISTÓRICO
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT h.*, p.nome AS produto_nome FROM historico_precos h LEFT JOIN produtos p ON p.id_produto = h.id_produto WHERE h.id_historico = ?",
            [req.params.id],
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ historico_preco: resultado });
        });
    });
});

// CADASTRAR PREÇO NO HISTÓRICO
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO historico_precos (id_produto, preco, vigencia) VALUES (?, ?, ?)",
            [req.body.id_produto, req.body.preco, req.body.vigencia],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Preço registrado com sucesso!",
                    id_historico: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR PREÇO NO HISTÓRICO
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE historico_precos SET id_produto = ?, preco = ?, vigencia = ? WHERE id_historico = ?",
            [req.body.id_produto, req.body.preco, req.body.vigencia, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Histórico de preço atualizado com sucesso!" });
            }
        );
    });
});

// DELETAR PREÇO DO HISTÓRICO
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM historico_precos WHERE id_historico = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Registro do histórico removido com sucesso!" });
        });
    });
});

module.exports = router;
