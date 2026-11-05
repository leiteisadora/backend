const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// LISTAR ITENS DOS PEDIDOS
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT i.*, CONCAT('Pedido #', p.id_pedido) AS pedido_referencia, pr.nome AS produto_nome FROM pedido_itens i LEFT JOIN pedidos p ON p.id_pedido = i.id_pedido LEFT JOIN produtos pr ON pr.id_produto = i.id_produto",
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ pedido_item: resultado });
        });
    });
});

// LISTAR APENAS UM ITEM DO PEDIDO
router.get('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "SELECT i.*, CONCAT('Pedido #', p.id_pedido) AS pedido_referencia, pr.nome AS produto_nome FROM pedido_itens i LEFT JOIN pedidos p ON p.id_pedido = i.id_pedido LEFT JOIN produtos pr ON pr.id_produto = i.id_produto WHERE i.id_item = ?",
            [req.params.id],
            (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(200).send({ pedido_item: resultado });
        });
    });
});

// CADASTRAR ITEM DO PEDIDO
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, valor_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
            [req.body.id_pedido, req.body.id_produto, req.body.quantidade, req.body.valor_unitario, req.body.subtotal],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(201).send({
                    mensagem: "Item do pedido criado com sucesso!",
                    id_item: resultado.insertId
                });
            }
        );
    });
});

// ATUALIZAR ITEM DO PEDIDO
router.patch('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            "UPDATE pedido_itens SET id_pedido = ?, id_produto = ?, quantidade = ?, valor_unitario = ?, subtotal = ? WHERE id_item = ?",
            [req.body.id_pedido, req.body.id_produto, req.body.quantidade, req.body.valor_unitario, req.body.subtotal, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error });
                res.status(202).send({ mensagem: "Item do pedido atualizado com sucesso!" });
            }
        );
    });
});

// DELETAR ITEM DO PEDIDO
router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query("DELETE FROM pedido_itens WHERE id_item = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error });
            res.status(202).send({ mensagem: "Item do pedido removido com sucesso!" });
        });
    });
});

module.exports = router;
