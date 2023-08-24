const express = require('express');
const { listarContas, criarConta, atualizarConta, excluirConta, verSaldo, listarExtrato } = require('./controladores/contas');
const { depositar, sacar, transferir } = require('./controladores/transacoes');
const { validarSenha, validaCamposReq, existenciaContaParams, existenciaContaBody, validarSenhaBody, validarSenhaQuery, existenciaContaQuery } = require('./intermediarios');


const rotas = express();

rotas.get('/contas', validarSenha, listarContas);
rotas.post('/contas', validaCamposReq, criarConta);
rotas.put('/contas/:numeroConta/usuario', existenciaContaParams, validaCamposReq, atualizarConta);
rotas.delete('/contas/:numeroConta', existenciaContaParams, excluirConta);

rotas.post('/transacoes/depositar', existenciaContaBody, depositar);
rotas.post('/transacoes/sacar', validarSenhaBody, existenciaContaBody, sacar);
rotas.post('/transacoes/transferir', validarSenhaBody, transferir);

rotas.get('/contas/saldo', validarSenhaQuery, existenciaContaQuery, verSaldo);
rotas.get('/contas/extrato', validarSenhaQuery, existenciaContaQuery, listarExtrato);

module.exports = rotas;