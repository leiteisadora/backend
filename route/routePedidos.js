const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR PEDIDOS
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("SELECT * FROM pedidos", (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ pedido: resultado });
        });
    });
});

// LISTAR APENAS UM PEDIDO
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("SELECT * FROM pedidos WHERE id_pedido = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ pedido: resultado });
        });
    });
});

// CADASTRAR PEDIDO
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO pedidos (status, data_pedido, id_cliente) VALUES (?, ?, ?)",
            [req.body.status, req.body.data_pedido, req.body.id_cliente],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Pedido criado com sucesso!",
                    id_pedido: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR PEDIDO
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE pedidos SET status = ?, data_pedido = ?, id_cliente = ? WHERE id_pedido = ?",
            [req.body.status, req.body.data_pedido, req.body.id_cliente, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Pedido atualizado com sucesso!" });
            }
        );
    });
});

// DELETAR PEDIDO
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM pedidos WHERE id_pedido = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Pedido removido com sucesso!" });
        });
    });
});

module.exports = router;
