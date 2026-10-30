const express = require('express');
const { Categoria } = require("../models");

const router = express.Router();

const formatCategoria = (categoria) => ({
    ...categoria,
    ativo: categoria.ativo === null ? null : Number(categoria.ativo)
});

const handleDatabaseError = (res, error) => res.status(500).send({ error });

router.get('/', async (req, res) => {
    try {
        const resultado = await Categoria.findAll({ raw: true });
        res.status(200).send({ categoria: resultado.map(formatCategoria) });
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resultado = await Categoria.findAll({
            where: { id_categoria: req.params.id },
            raw: true
        });
        res.status(200).send({ categoria: resultado.map(formatCategoria) });
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.post('/', async (req, res) => {
    const dados = {
        nome: req.body.nome,
        descricao: req.body.descricao
    };

    try {
        const categoria = await Categoria.create(dados);
        res.status(201).send({
            mensagem: "Categoria criada com sucesso!",
            id_categoria: categoria.id_categoria
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.patch('/:id', async (req, res) => {
    const dados = {
        nome: req.body.nome === undefined ? null : req.body.nome,
        descricao: req.body.descricao === undefined ? null : req.body.descricao
    };

    try {
        await Categoria.update(dados, {
            where: { id_categoria: req.params.id }
        });
        res.status(202).send({
            mensagem: "Categoria atualizada com sucesso!"
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Categoria.destroy({
            where: { id_categoria: req.params.id }
        });
        res.status(202).send({
            mensagem: "Categoria removida com sucesso!"
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

module.exports = router;
