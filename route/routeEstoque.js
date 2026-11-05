const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR ESTOQUE
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT e.*, p.nome AS produto_nome FROM estoque e LEFT JOIN produtos p ON p.id_produto = e.id_produto",
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ estoque: resultado });
        });
    });
});

// LISTAR APENAS UM REGISTRO DO ESTOQUE
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT e.*, p.nome AS produto_nome FROM estoque e LEFT JOIN produtos p ON p.id_produto = e.id_produto WHERE e.id_estoque = ?",
            [req.params.id],
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ estoque: resultado });
        });
    });
});

// CADASTRAR REGISTRO NO ESTOQUE
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO estoque (id_produto, quantidade, estoque_minimo, estoque_maximo, localizacao) VALUES (?, ?, ?, ?, ?)",
            [req.body.id_produto, req.body.quantidade, req.body.estoque_minimo, req.body.estoque_maximo, req.body.localizacao],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Registro de estoque criado com sucesso!",
                    id_estoque: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR REGISTRO DO ESTOQUE
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE estoque SET id_produto = ?, quantidade = ?, estoque_minimo = ?, estoque_maximo = ?, localizacao = ? WHERE id_estoque = ?",
            [req.body.id_produto, req.body.quantidade, req.body.estoque_minimo, req.body.estoque_maximo, req.body.localizacao, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Estoque atualizado com sucesso!" });
            }
        );
    });
});

// DELETAR REGISTRO DO ESTOQUE
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM estoque WHERE id_estoque = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Registro de estoque removido com sucesso!" });
        });
    });
});

module.exports = router;
