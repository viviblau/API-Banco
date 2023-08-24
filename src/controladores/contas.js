const { contas, depositos, saques, transferencias } = require('../bancodedados');

let numero = 1;

const listarContas = (req, res) => {
    return res.json(contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cpfExistente = contas.find(conta => conta.usuario.cpf === cpf);
    const emailExistente = contas.find(conta => conta.usuario.email === email);

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }

    const novaConta = {
        numero,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    numero++;

    contas.push(novaConta);

    return res.status(201).send();
}

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const numeroConta = Number(req.params.numeroConta);

    const cpfExistente = contas.find(conta => conta.usuario.cpf === cpf);
    const emailExistente = contas.find(conta => conta.usuario.email === email);

    if (cpfExistente) {
        return res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" })
    }

    if (emailExistente) {
        return res.status(400).json({ mensagem: "O email informado já existe cadastrado!" })
    }

    contaExistente.usuario.nome = nome;
    contaExistente.usuario.cpf = cpf;
    contaExistente.usuario.data_nascimento = data_nascimento;
    contaExistente.usuario.telefone = telefone;
    contaExistente.usuario.email = email;
    contaExistente.usuario.senha = senha;

    return res.status(204).json()

}

const excluirConta = (req, res) => {

    const indiceConta = contas.findIndex(conta => conta.numero === Number(req.params.numeroConta));

    if (contas[indiceConta].saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    contas.splice(indiceConta, 1);

    return res.status(204).json();
}

const verSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!senha || !numero_conta) {
        return res.status(400).json({ mensagem: "A senha e o numero da conta deve ser informado." });
    }

    const saldo = { saldo: contas[indiceConta].saldo }

    return res.json(saldo);
}

const listarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!senha || !numero_conta) {
        return res.status(400).json({ mensagem: "A senha e o numero da conta deve ser informado." });
    }

    const transferenciasEnviadas = transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta)
    const transferenciasRecebidas = transferencias.filter((transferencia) => transferencia.numero_conta_origem !== numero_conta)

    const extrato = {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.json(extrato);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    verSaldo,
    listarExtrato
}
