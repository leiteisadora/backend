


const express = require('express');

const router = express.Router();

const mysql = require("../mysql").pool;

// LISTAR FUNCIONÁRIOS

router.get('/', (req, res) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error });

        conn.query("SELECT * FROM funcionarios", (error, resultado) => {

            conn.release();

            if (error) return res.status(500).send({ error });

            res.status(200).send({ funcionario: resultado });

        });

    });

});

// lista apenas um funcionário
router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "SELECT * FROM funcionarios WHERE id_funcionario = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(200).send({ funcionario: resultado });

            }
        );

    });

});


router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "INSERT INTO funcionarios (nome, cargo, salario, telefone, email) VALUES (?, ?, ?, ?, ?)",
            [
                req.body.nome,
                req.body.cargo,
                req.body.salario,
                req.body.telefone,
                req.body.email
            ],
            (error, resultado) => {

                console.log(error);

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(201).send({
                    mensagem: "Funcionário criado com sucesso!",
                    id_funcionario: resultado.insertId
                });

            }
        );

    });

});


router.patch('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "UPDATE funcionarios SET nome = ?, cargo = ?, salario = ?, telefone = ?, email = ? WHERE id_funcionario = ?",
            [
                req.body.nome,
                req.body.cargo,
                req.body.salario,
                req.body.telefone,
                req.body.email,
                req.params.id
            ],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Funcionário atualizado com sucesso!"
                });

            }
        );

    });

});


router.delete('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            "DELETE FROM funcionarios WHERE id_funcionario = ?",
            [req.params.id],
            (error, resultado) => {

                conn.release();

                if (error) return res.status(500).send({ error: error });

                res.status(202).send({
                    mensagem: "Funcionário removido com sucesso!"
                });

            }
        );

    });

});

module.exports = router;

