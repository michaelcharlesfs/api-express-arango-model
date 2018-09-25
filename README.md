# API ExpressJS + ArangoJS

Este � um modelo base de API RESTful usando framework ExpressJS e com ArangoJS (driver do ArangoDB). O prop�sito deste projeto � apenas ter uma aplica��o inicial para qualquer projeto. Os arquivos de rotas presentes no projeto n�o tem nenhum prop�sito espec�fico, ent�o, pode ser desconsiderada ao criar uma nova aplica��o.
Este projeto foi gerado com o [Gerador ExpressJS](http://expressjs.com/pt-br/starter/generator.html) vers�o 4.15.2.

## Configurando

Este modelo j� possui algumas ferramentas que proporcionam o in�cio r�pido de um novo projeto. Antes de tudo, certifique-se que voc� tem a o [ArangoDB](https://www.arangodb.com/) instalado em sua m�quina. 

### Passo 1

Abra o arquivo `database.js` e edite as linhas 4, 5, 6, e 7 com endere�o do banco de dados com a porta de acesso, usu�rio do banco de dados, senha do usu�rio do banco de dados e com o nome do banco de dados. Certifique-se de que o banco de dados tenha sido criado e que o usu�rio tenha permiss�o sob este banco de dados. Qualquer d�vida consulte o [Manual do ArangoDB](https://docs.arangodb.com/3.3/Manual/).

### Passo 2

Abra o arquivo `collections-config.js` e insira as cole��es de dados utilizadas. Deve-se utilizar o mesmo padr�o definido no modelo inicial:

<code>
const collectionConfig = [
    { name: "minhaColecao", type: 1 },
    { name: "outraColecao", type: 2 }
];
</code>

O par�metro `name` deve conter o nome da cole��o. � recomendado que este nome siga a [Conven��o](https://docs.arangodb.com/3.3/Manual/DataModeling/NamingConventions/) disponibilizada na documenta��o do ArangoDB. O par�metro `type` deve conter um inteiro indicando o tipo de cole��o. O valor 1 indica cole��o de documentos e o valor 2 indica cole��o de arestas.

### Passo 3

Abra o terminal, navegue at� o diret�rio do projeto e execute `npm install`. Os pacotes necess�rios ser� instalados pelo npm. Este processo pode levar um tempo. 

### Passo 4

Execute `npm start` para iniciar o servi�o. Acesse `http://localhost:3000/v1/users` para ver a lista de usu�rios cadastrados. A aplica��o vai recarregar automaticamente se voc� alterar qualquer arquivo do projeto porque o [Nodemon](https://nodemon.io/) est� configurado no arquivo `package.json`. 

## Para mais informa��es

Entre em contato comigo caso encontre algum erro, bug ou deseja sugerir melhoria.

Michael Charles
Email: michaelcharlesfs@gmail.com
