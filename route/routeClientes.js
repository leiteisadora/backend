const express = require('express');

const router = express.Router();

const mysql = require("../mysql").pool;

// LISTAR CLIENTES

router.get('/', (req, res) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error });

        conn.query("SELECT * FROM clientes", (error, resultado) => {

            conn.release();

            if (error) return res.status(500).send({ error });

            res.status(200).send({ cliente: resultado });

        });

    });

});

// LISTA APENAS UM CLIENTE

router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "SELECT * FROM clientes WHERE id_cliente = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(200).send({ cliente: resultado });

            }
        );

    });

});

// CADASTRAR CLIENTE

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "INSERT INTO clientes (nome, email, contato) VALUES (?, ?, ?)",
            [
                req.body.nome,
                req.body.email,
                req.body.contato,
                
            ],
            (error, resultado) => {

                console.log(error);

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(201).send({
                    mensagem: "Cliente criado com sucesso!",
                    id_cliente: resultado.insertId
                });

            }
        );

    });

});

// ATUALIZAR CLIENTE

router.patch('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "UPDATE clientes SET nome = ?, email = ?, contato = ? WHERE id_cliente = ?",
            [
                req.body.nome,
                req.body.email,
                req.body.contato,
                req.params.id
            ],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Cliente atualizado com sucesso!"
                });

            }

        );

    });

});

// DELETAR CLIENTE

router.delete('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "DELETE FROM clientes WHERE id_cliente = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Cliente removido com sucesso!"
                });

            }

        );

    });

});

module.exports = router;
