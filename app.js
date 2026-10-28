//1. Dependências e Middlewares
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const routeUsuario= require('./route/routeUsuario');
const routeClientes= require('./route/routeClientes');
const routeCategorias= require('./route/routeCategorias');
const routeFornecedores= require('./route/routeFornecedores');
const routeFuncionario= require('./route/routeFuncionario');
const routeProdutos= require('./route/routeProdutos');
const routeEntradas= require('./route/routeEntradas');
const routeEstoque= require('./route/routeEstoque');
const routeHistoricoPrecos= require('./route/routeHistoricoPrecos');
const routeLogs= require('./route/routeLogs');
const routeMovimentacoes= require('./route/routeMovimentacoes');
const routePedidos= require('./route/routePedidos');
const routePedidoItens= require('./route/routePedidoItens');
const routeSaidas= require('./route/routeSaidas');

//2. Controle de CORS (Headers & OPTIONS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
//3. Definição de Rotas



app.use("/usuario",routeUsuario);
app.use("/clientes",routeClientes);
app.use("/categorias",routeCategorias);
app.use("/fornecedores",routeFornecedores);
app.use("/funcionarios",routeFuncionario);
app.use("/produtos",routeProdutos);
app.use("/entradas",routeEntradas);
app.use("/estoque",routeEstoque);
app.use("/historico_precos",routeHistoricoPrecos);
app.use("/logs",routeLogs);
app.use("/movimentacoes",routeMovimentacoes);
app.use("/pedidos",routePedidos);
app.use("/pedido_itens",routePedidoItens);
app.use("/saidas",routeSaidas);
//4. Tratamento de Erros (Fallback & Handler)
app.use((req,res,next)=>{
      const erro = new Error("Não encontrado!");
      erro.status = 404;
      next(erro);
});
app.use((error,req,res,next)=>{
        res.status(error.status || 500);
        return res.json({
            erro:{
                 mensagem:error.message
            }  })
})

module.exports=app;