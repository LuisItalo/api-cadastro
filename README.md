<h1>Api-Token</h1>

<p>Este é um projeto de uma API local para testes utilizando:</p>


- JavaScript;
- Express;
- BodyParser;
- Bcrypt;
- Jwt;
- Mysql12;

>Utilizei o POSTMAN para realizar os testes

## Rotas

### Para cadastrar
http://localhost:3000/registrar

<p>Corpo da quisição:</p>


{
    "nome": "seuNome",
    "email": "seuEmail",
    "senha": "suaSenha"
}


### Para fazer login e receber token de acesso
http://localhost:3000/signup

<p>Corpo da quisição:</p>


{
    "nome": "seuNome",
    "senha": "suaSenha"
}

### Para ter acesso 
http://localhost:3000/dados-pessoais

> Authorization Bearer Token *tokenGerado*

## Teste
<p>Para iniciar a API:</p>

> node server.js

