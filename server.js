const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./dbConfig');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const port = 3000;
const saltRounds = 10;

const chaveSecreta = crypto.randomBytes(32).toString('hex');

app.use(bodyParser.json());

// Rota para registro de usuários.
app.post('/registrar', (req, res) => {
  const { nome, email, senha } = req.body;

  // Verificar se o usuário já existe antes de tentar inserir
  db.query('SELECT * FROM usuarios WHERE nome = ?', [nome], (error, results) => {
    if (error) {
      console.error('Erro na consulta ao banco de dados:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length > 0) {
      // Usuário já existe
      return res.json({ message: 'Usuário já cadastrado' });
    } else {
      // Hash da senha antes de armazenar
      bcrypt.hash(senha, saltRounds, (err, hash) => {
        if (err) {
          console.error('Erro ao hashear a senha:', err);
          return res.status(500).json({ error: 'Erro no servidor' });
        }

        const novoUsuario = {
          nome,
          email,
          senha: hash, // Salvar a senha hasheada no banco de dados
        };

        // Inserir novo usuário no banco de dados
        db.query('INSERT INTO usuarios SET ?', novoUsuario, (err, results) => {
          if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).json({ error: 'Erro ao inserir usuário' });
          }
          console.log('Usuário inserido com sucesso:', results.insertId);
          res.json({ message: 'Usuário registrado com sucesso' });
        });
      });
    }
  });
});

app.post('/signup', (req, res) => {
  const { nome, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE nome = ?', [nome], (error, results) => {
    if (error) {
      console.error('Erro na consulta ao banco de dados:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length > 0) {
      const usuario = results[0];

      // Gera o token após verificar o usuário
      const tokenGerado = jwt.sign({ id: usuario.id, nome: usuario.nome }, chaveSecreta, { expiresIn: '24h'});
      console.log('Token gerado:', tokenGerado);
      
      res.json({ message: 'Login bem-sucedido', tokenGerado });
    } else {
      res.json({ message: 'Usuário não encontrado, cadastre-se primeiro' });
    }
  });
});

// Rota protegida que requer autenticação
app.get('/dados-pessoais', (req, res) => {
  // Obtenha o token do cabeçalho de autorização
  const token = req.headers.authorization;

  // Remova "Bearer " do início da string, se presente
  const tokenSemBearer = token ? token.replace(/^Bearer /, '') : null;

  // Verificar se o token não está presente
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });  }

  // Decodificar o token
  jwt.verify(tokenSemBearer, chaveSecreta, (err, decoded) => {
    console.log('Decodificado:', decoded);

    // Verificar se ocorreu um erro durante a decodificação
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      } else {
        return res.status(401).json({ error: 'Token inválido' });
      }
    }
    // Aqui você pode acessar as informações do usuário decodificadas
    const userId = decoded.id;
    const userName = decoded.nome;

    // Se tudo estiver correto, envie uma resposta com os dados do usuário
    res.json({ message: 'Acesso permitido', dados: { userId, userName } });
  });
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
