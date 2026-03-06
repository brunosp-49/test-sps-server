# Template Padrão - Teste Técnico SPS Group – Inovação

Oi, Candidato!

Tudo certo? Estamos animados por você estar no nosso processo seletivo para a vaga de **Desenvolvedor(a)** na SPS Group! Essa é a sua chance de mostrar o que você sabe e deixar sua marca com um projeto bem legal.

O próximo passo é um teste técnico prático com duas partes: **Front-End (React.js)** e **Back-End (Node.js)**. Ele foi feito para candidatos de todos os níveis – júnior, pleno ou sênior – e nossa equipe vai avaliar sua entrega.

---

## Começando: Repositórios

Não precisa começar do zero, tá? Já deixamos tudo prontinho pra você. É só clonar os repositórios abaixo:

- **Front-End (React.js):** [https://github.com/SPS-Group/test-sps-react](https://github.com/SPS-Group/test-sps-react)
- **Back-End (Node.js):** [https://github.com/SPS-Group/test-sps-server](https://github.com/SPS-Group/test-sps-server)

**Primeiro passo:** Dê uma olhada no teste e responda este e-mail dizendo em quantos dias você acha que vai entregar o projeto. O prazo final é *[Prazo Final Personalizado]*.

### Seu desafio

Construir um sistema simples com estas funcionalidades:

- **Login seguro:** Um jeito de entrar no sistema com autenticação.
- **CRUD completo:** Cadastrar, listar, editar e excluir usuários.
- **Acesso restrito:** Só quem tá logado pode usar as funcionalidades.

---

## Como o Teste Funciona

### 1. Back-End (Node.js)

Você vai trabalhar em uma API RESTful usando o repositório que fornecemos. Confira o que precisa fazer:

- Use o banco fake de usuários que já tá no repositório (pode ser em memória).
- Tem um usuário admin pronto pra usar com as credenciais abaixo.

#### Autenticação

Utilize o seguinte usuário administrador já pré-configurado:

```json
{
  "name": "admin",
  "email": "admin@spsgroup.com.br",
  "type": "admin",
  "password": "1234"
}
```

Esse usuário será utilizado para autenticar via token.

- Crie uma rota de autenticação que gera um token JWT.
- Todas as rotas da API precisam de autenticação.

#### O que a API deve fazer

- Cadastrar usuários (campos: email, nome, type, password).
- Bloquear e-mails repetidos.
- Editar dados de usuários.
- Excluir usuários.

---

### 2. Front-End (React.js)

No front, você vai usar o repositório fornecido para criar a interface. Veja os detalhes:

- O projeto já vem com Create React App configurado.
- Faça uma página de login (signIn) que conecta com a API.
- Guarde o token de autenticação.

**Só usuários logados podem:**

- Ver a lista de usuários.
- Cadastrar novos usuários.
- Editar ou excluir usuários.

A interface pode ser simples e funcional, mas capriche na usabilidade e no código limpo.

---

## Entrega

- Suba sua versão final do projeto em um repositório pessoal.
- Deixe público ou compartilhe o acesso com *[seu e-mail ou GitHub da SPS]*.
- Inclua um **README.md** com instruções claras pra rodar seu projeto.
- Envie o link como projeto pra gente por este e-mail até *[Prazo Final Personalizado]*.

---

## Dicas para Mandar Bem

- **Código organizado:** Escreva um código claro, com comentários onde precisar.
- **Boas práticas:** Use padrões REST no back-end e organize o front-end pensando em escalabilidade.

---

## Regras Importantes

- Não modifique os frameworks já definidos no projeto.
- Utilize o projeto como base, adicionando os requisitos e comportamentos esperados.
- Mantenha a estrutura e padrão de código organizados e coerentes.

---

## Alguma Dúvida?

Qualquer dúvida sobre o teste, os repositórios ou o processo, é só responder este e-mail, *[Nome do Candidato(a)]*! Estamos aqui pra te ajudar a tirar esse desafio de letra.

Obrigado por topar esse desafio com a gente, *[Nome do Candidato(a)]*! Boa sorte e divirta-se codando!

**P.S.:** Não esquece de responder este e-mail com o prazo que você acha que vai precisar pra entregar o teste!

Um abraço,

*Pessoas & Cultura | SPS Group*
