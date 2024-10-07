const connection = require('./database')
const usuario = require('./usuarioModel')
const codigo = require('./codigoModel')

// Definindo a chave estrangeira da tabela codigo
codigo.belongsTo(usuario, {
    foreignKey: 'usuarioEmail',
    targetKey: 'email',
    onDelete: 'CASCADE'
})

// Sincronizando o banco de dados
connection.sync({force: false})
    .then(() => {
        console.log('Tabelas criadas!');
    })
    .catch((error) => {
        console.error('Erro ao criar tabelas:', error);
    });

module.exports = {
    connection,
    usuario,
    codigo
}