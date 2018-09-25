# API ExpressJS + ArangoJS

Este é um modelo base de API RESTful usando framework ExpressJS e com ArangoJS (driver do ArangoDB). O propósito deste projeto é apenas ter uma aplicação inicial para qualquer projeto. Os arquivos de rotas presentes no projeto não tem nenhum propósito específico, então, pode ser desconsiderada ao criar uma nova aplicação.
Este projeto foi gerado com o [Gerador ExpressJS](http://expressjs.com/pt-br/starter/generator.html) versão 4.15.2.

## Configurando

Este modelo já possui algumas ferramentas que proporcionam o início rápido de um novo projeto. Antes de tudo, certifique-se que você tem a o [ArangoDB](https://www.arangodb.com/) instalado em sua máquina. 

### Passo 1

Abra o arquivo `database.js` e edite as linhas 4, 5, 6, e 7 com endereço do banco de dados com a porta de acesso, usuário do banco de dados, senha do usuário do banco de dados e com o nome do banco de dados. Certifique-se de que o banco de dados tenha sido criado e que o usuário tenha permissão sob este banco de dados. Qualquer dúvida consulte o [Manual do ArangoDB](https://docs.arangodb.com/3.3/Manual/).

### Passo 2

Abra o arquivo `collections-config.js` e insira as coleções de dados utilizadas. Deve-se utilizar o mesmo padrão definido no modelo inicial:

<code>
const collectionConfig = [
    { name: "minhaColecao", type: 1 },
    { name: "outraColecao", type: 2 }
];
</code>

O parâmetro `name` deve conter o nome da coleção. É recomendado que este nome siga a [Convenção](https://docs.arangodb.com/3.3/Manual/DataModeling/NamingConventions/) disponibilizada na documentação do ArangoDB. O parâmetro `type` deve conter um inteiro indicando o tipo de coleção. O valor 1 indica coleção de documentos e o valor 2 indica coleção de arestas.

### Passo 3

Abra o terminal, navegue até o diretório do projeto e execute `npm install`. Os pacotes necessários será instalados pelo npm. Este processo pode levar um tempo. 

### Passo 4

Execute `npm start` para iniciar o serviço. Acesse `http://localhost:3000/v1/users` para ver a lista de usuários cadastrados. A aplicação vai recarregar automaticamente se você alterar qualquer arquivo do projeto porque o [Nodemon](https://nodemon.io/) está configurado no arquivo `package.json`. 

## Para mais informações

Entre em contato comigo caso encontre algum erro, bug ou deseja sugerir melhoria.

Michael Charles
Email: michaelcharlesfs@gmail.com
