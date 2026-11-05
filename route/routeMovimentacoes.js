const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR MOVIMENTAÇÕES
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT m.*, p.nome AS produto_nome FROM movimentacoes m LEFT JOIN produtos p ON p.id_produto = m.id_produto",
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ movimentacao: resultado });
        });
    });
});

// LISTAR APENAS UMA MOVIMENTAÇÃO
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT m.*, p.nome AS produto_nome FROM movimentacoes m LEFT JOIN produtos p ON p.id_produto = m.id_produto WHERE m.id_movimentacao = ?",
            [req.params.id],
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ movimentacao: resultado });
        });
    });
});

// CADASTRAR MOVIMENTAÇÃO
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO movimentacoes (id_produto, tipo, quantidade, data_movimentacao, observacao) VALUES (?, ?, ?, ?, ?)",
            [req.body.id_produto, req.body.tipo, req.body.quantidade, req.body.data_movimentacao, req.body.observacao],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Movimentação criada com sucesso!",
                    id_movimentacao: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR MOVIMENTAÇÃO
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE movimentacoes SET id_produto = ?, tipo = ?, quantidade = ?, data_movimentacao = ?, observacao = ? WHERE id_movimentacao = ?",
            [req.body.id_produto, req.body.tipo, req.body.quantidade, req.body.data_movimentacao, req.body.observacao, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Movimentação atualizada com sucesso!" });
            }
        );
    });
});

// DELETAR MOVIMENTAÇÃO
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM movimentacoes WHERE id_movimentacao = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Movimentação removida com sucesso!" });
        });
    });
});

module.exports = router;
