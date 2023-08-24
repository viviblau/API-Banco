const { contas, depositos, saques, transferencias } = require('../bancodedados');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if ((!valor && valor !== 0) || !numero_conta) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const indiceConta = contas.findIndex(conta => conta.numero === Number(numero_conta));

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser negativo ou zerado!" });
    }

    contas[indiceConta].saldo += valor;

    const dataAtual = new Date();
    const data = dataAtual.toLocaleString();

    depositos.push({
        data,
        numero_conta,
        valor
    });

    return res.status(204).json();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!valor || !numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, o valor e a senha são obrigatórios!" });
    }

    const indiceConta = contas.findIndex(conta => conta.numero === Number(numero_conta));

    if (contas[indiceConta].saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "Não há saldo para saque!" });
    }

    contas[indiceConta].saldo -= valor;

    const dataAtual = new Date();
    const data = dataAtual.toLocaleString();

    saques.push({
        data,
        numero_conta,
        valor
    });

    return res.status(204).json();

}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!valor || !numero_conta_origem || !senha || !numero_conta_destino) {
        return res.status(400).json({ mensagem: "O número da conta de origem, o número da conta de destino, o valor e a senha são obrigatórios!" });
    }

    const indiceContaOrigem = contas.findIndex(conta => conta.numero === Number(numero_conta_origem));

    if (indiceContaOrigem < 0) {
        return res.status(404).json({ mensagem: "Não existe conta de origem para o número informado." });
    }

    const indiceContaDestino = contas.findIndex(conta => conta.numero === Number(numero_conta_destino));

    if (indiceContaDestino < 0) {
        return res.status(404).json({ mensagem: "Não existe conta de destino para o número informado." });
    }

    if (contas[indiceContaOrigem].saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "Não há saldo para transferência" });
    }

    contas[indiceContaOrigem].saldo -= valor;
    contas[indiceContaDestino].saldo += valor;

    const dataAtual = new Date();
    const data = format(dataAtual, "yyyy-mm-dd hh:mm:ss");

    transferencias.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    });

    return res.status(204).json();
}

module.exports = {
    depositar,
    sacar,
    transferir
}