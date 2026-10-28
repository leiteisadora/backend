const express = require('express');

const router = express.Router();

const mysql = require("../mysql").pool;

// LISTAR CATEGORIAS

router.get('/', (req, res) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error });

        conn.query("SELECT * FROM categorias", (error, resultado) => {

            conn.release();

            if (error) return res.status(500).send({ error });

            res.status(200).send({ categoria: resultado });

        });

    });

});

// LISTA APENAS UMA CATEGORIA

router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "SELECT * FROM categorias WHERE id_categoria = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(200).send({ categoria: resultado });

            }
        );

    });

});

// CADASTRAR CATEGORIA

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "INSERT INTO categorias (nome, descricao) VALUES (?, ?)",
            [
                req.body.nome,
                req.body.descricao
            ],
            (error, resultado) => {

                console.log(error);

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(201).send({
                    mensagem: "Categoria criada com sucesso!",
                    id_categoria: resultado.insertId
                });

            }
        );

    });

});

// ATUALIZAR CATEGORIA

router.patch('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "UPDATE categorias SET nome = ?, descricao = ? WHERE id_categoria = ?",
            [
                req.body.nome,
                req.body.descricao,
                req.params.id
            ],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Categoria atualizada com sucesso!"
                });

            }

        );

    });

});

// DELETAR CATEGORIA

router.delete('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "DELETE FROM categorias WHERE id_categoria = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Categoria removida com sucesso!"
                });

            }

        );

    });

});

module.exports = router;


