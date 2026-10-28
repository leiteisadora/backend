const express = require('express');

const router = express.Router();

const mysql = require("../mysql").pool;

// LISTAR PRODUTOS

router.get('/', (req, res) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error });

        conn.query("SELECT * FROM produtos", (error, resultado) => {

            conn.release();

            if (error) return res.status(500).send({ error });

            res.status(200).send({ produto: resultado });

        });

    });

});

// LISTA APENAS UM PRODUTO

router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "SELECT * FROM produtos WHERE id_produto = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(200).send({ produto: resultado });

            }
        );

    });

});

// CADASTRAR PRODUTO

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "INSERT INTO produtos (nome, descricao, preco, imagem_produto) VALUES (?, ?, ?, ?)",
            [
                req.body.nome,
                req.body.descricao,
                req.body.preco,
                req.body.imagem_produto
            ],
            (error, resultado) => {

                console.log(error);

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(201).send({
                    mensagem: "Produto criado com sucesso!",
                    id_produto: resultado.insertId
                });

            }
        );

    });

});

// ATUALIZAR PRODUTO

router.patch('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem_produto = ? WHERE id_produto = ?",
            [
                req.body.nome,
                req.body.descricao,
                req.body.preco,
                req.body.imagem_produto,
                req.params.id
            ],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Produto atualizado com sucesso!"
                });

            }

        );

    });

});

// DELETAR PRODUTO

router.delete('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "DELETE FROM produtos WHERE id_produto = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Produto removido com sucesso!"
                });

            }

        );

    });

});

module.exports = router;