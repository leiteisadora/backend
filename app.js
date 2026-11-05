//1. Dependências e Middlewares
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { authenticate, isAllowedOrigin } = require('./middleware/authenticate');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

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
  origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
//3. Definição de Rotas



app.use("/usuario",routeUsuario);
app.use("/clientes",authenticate,routeClientes);
app.use("/categorias",authenticate,routeCategorias);
app.use("/fornecedores",authenticate,routeFornecedores);
app.use("/funcionarios",authenticate,routeFuncionario);
app.use("/produtos",authenticate,routeProdutos);
app.use("/entradas",authenticate,routeEntradas);
app.use("/estoque",authenticate,routeEstoque);
app.use("/historico_precos",authenticate,routeHistoricoPrecos);
app.use("/logs",authenticate,routeLogs);
app.use("/movimentacoes",authenticate,routeMovimentacoes);
app.use("/pedidos",authenticate,routePedidos);
app.use("/pedido_itens",authenticate,routePedidoItens);
app.use("/saidas",authenticate,routeSaidas);
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