const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR ENTRADAS
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT e.*, p.nome AS produto_nome, f.nome AS fornecedor_nome FROM entradas e LEFT JOIN produtos p ON p.id_produto = e.id_produto LEFT JOIN fornecedores f ON f.id_fornecedor = e.id_fornecedor",
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ entrada: resultado });
        });
    });
});

// LISTAR APENAS UMA ENTRADA
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT e.*, p.nome AS produto_nome, f.nome AS fornecedor_nome FROM entradas e LEFT JOIN produtos p ON p.id_produto = e.id_produto LEFT JOIN fornecedores f ON f.id_fornecedor = e.id_fornecedor WHERE e.id_entrada = ?",
            [req.params.id],
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ entrada: resultado });
        });
    });
});

// CADASTRAR ENTRADA
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO entradas (id_produto, id_fornecedor, quantidade, valor_unitario, data_entrada, observacao) VALUES (?, ?, ?, ?, ?, ?)",
            [req.body.id_produto, req.body.id_fornecedor, req.body.quantidade, req.body.valor_unitario, req.body.data_entrada, req.body.observacao],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Entrada criada com sucesso!",
                    id_entrada: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR ENTRADA
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE entradas SET id_produto = ?, id_fornecedor = ?, quantidade = ?, valor_unitario = ?, data_entrada = ?, observacao = ? WHERE id_entrada = ?",
            [req.body.id_produto, req.body.id_fornecedor, req.body.quantidade, req.body.valor_unitario, req.body.data_entrada, req.body.observacao, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Entrada atualizada com sucesso!" });
            }
        );
    });
});

// DELETAR ENTRADA
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM entradas WHERE id_entrada = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Entrada removida com sucesso!" });
        });
    });
});

module.exports = router;
