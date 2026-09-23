# Projeto-Pizzaria

Site da Pizzaria Realeza com cardapio responsivo, registro de pedidos e painel administrativo protegido.

## Executar

Requer Node.js 22.13 ou superior (recomendado: Node.js 24).

```sh
npm ci
npm run dev
```

Site: http://127.0.0.1:4181/ | Equipe: http://127.0.0.1:4181/admin/

Agora e necessario executar o servidor; abrir o HTML diretamente nao registra pedidos.
Sem `DATABASE_URL`, o desenvolvimento utiliza SQLite em `.data/realeza.sqlite`.
O banco local persiste entre reinicializacoes, mas nunca e usado na Vercel.

## Acesso Administrativo

Nao ha cadastro publico, senha padrao nem link para o admin no cardapio. A URL so
mostra a tela de login; todas as consultas e alteracoes de pedidos exigem sessao
validada no servidor. Cada integrante da equipe deve ter uma conta propria.

```sh
npm run admin:create -- equipe@exemplo.com
```

O comando gera uma senha aleatoria e grava o acesso em `.data/admin-access.txt`,
ignorado pelo Git e inacessivel no servidor HTTP. Guarde a senha em um gerenciador
e remova esse arquivo quando nao for mais necessario. Nenhum e-mail e enviado.
Para trocar uma senha, use o mesmo comando com `--reset`; todas as sessoes dessa
conta serao revogadas. Nao compartilhe senhas neste repositorio ou em mensagens.

O painel permite buscar por nome, telefone ou identificador, filtrar data/status,
consultar os itens, endereco, pagamento, troco e observacoes e atualizar o pedido:

- Entrega: Novo > Em preparo > Saiu para entrega > Concluido.
- Retirada: Novo > Em preparo > Pronto para retirada > Concluido.
- Cancelamento exige motivo e e permitido antes da conclusao.
- Pedidos concluidos ou cancelados nao podem ser reabertos.
- Toda alteracao registra horario e conta responsavel. A lista atualiza a cada 30 segundos.

## Publicar Na Vercel

**Nao publicar esta versao sem configurar o banco: a finalizacao depende dele.**
O painel e o banco local nao ativam automaticamente o ambiente online.

1. Conecte um PostgreSQL persistente ao projeto (por exemplo, Neon pelo Marketplace).
2. Configure `DATABASE_URL` na Vercel usando a conexao segura fornecida pelo banco.
3. Configure `APP_ORIGIN` com a origem exata do site, por exemplo `https://seu-dominio.com`, sem caminhos. Use um dominio canonico e redirecione os demais para ele.
4. Para criar a primeira conta no banco online, configure `DATABASE_URL` em um `.env` local privado e execute `npm run admin:create -- EMAIL_DA_EQUIPE --production`. O comando cria as tabelas e a conta e salva a senha em `.data/admin-access-production.txt`, separado do acesso local. Nunca publique esses arquivos.
5. Publique o projeto. `vercel.json` define `npm run build`, a saida `public/` e a funcao `api/backend.js`.
6. Verifique login, envio de pedido e mudanca de status no dominio definitivo antes de receber pedidos reais.

Use um banco separado para previews/testes. Configure a origem correspondente
em cada ambiente. Sem banco ou origem valida, a API recusa novas gravacoes.
O projeto nao armazena dados de cartao: registra somente a forma de pagamento.
Configure backups e retencao dos dados de clientes no provedor do banco e limite
o acesso operacional a pessoas autorizadas.

## Seguranca E Registro

- Senhas com scrypt e salt individual; sessoes opacas armazenadas por hash.
- Cookies HttpOnly, SameSite=Strict e Secure em producao, com validade de 8 horas.
- Validacao de origem nas operacoes de escrita e limite de tentativas de login/envio.
- Precos, adicionais, cupons e totais recalculados no servidor usando `catalog.js`.
- Reenvios da mesma finalizacao usam chave de idempotencia e nao criam duplicatas.
- Historico e status sao gravados juntos, com controle de versao para alteracoes simultaneas.
- Arquivos publicados seguem uma lista explicita; banco, credenciais, testes e codigo do servidor ficam fora de `public/`.

O pedido entra como Novo ao finalizar no site, **antes** da confirmacao pelo
WhatsApp. A equipe deve confirmar com o cliente antes de iniciar o preparo.
O site nao consegue verificar se a mensagem foi realmente enviada no WhatsApp,
e nao importa conversas/pedidos antigos. Falhas no registro preservam o carrinho
e permitem tentar novamente sem indicar sucesso indevidamente.

## Funcionalidades

- Pizzas salgadas, brotos, pizzas doces, fogazzas e bebidas.
- Brotos com os mesmos sabores das pizzas salgadas, por R$ 30,00 de base.
- Personalizacao de pizzas, meio a meio, bordas e adicionais.
- Carrinho com quantidade, edicao e remocao de itens.
- Finalizacao com dados de entrega ou retirada e forma de pagamento.
- Consulta de CEP pelo ViaCEP para preencher rua e bairro, com preenchimento manual disponivel em caso de falha.
- Icone de carrinho com contador da quantidade de itens.
- Resumo do pedido enviado pelo WhatsApp para confirmacao da pizzaria.
- Horarios de funcionamento e layout adaptado a celular e desktop.

## Arquivos

- `index.html`: estrutura da pagina.
- `style.css`: estilos e layout responsivo.
- `catalog.js`: configuracoes e catalogo compartilhado com o servidor.
- `script.js`: interacoes do cardapio, carrinho e finalizacao.
- `admin/`: login e painel da equipe.
- `api/backend.js` e `server/`: autenticacao, validacao e persistencia.
- `scripts/`: build, servidor local e criacao de contas.
- `tests/`: testes de API e fluxo completo no navegador.
- `assets/`: imagens usadas pelo site.
- `assets/drinks/sources.json`: origem das fotos de catalogo dos refrigerantes.

## Configuracao

Os dados do estabelecimento, telefone, horarios, produtos e precos ficam em `catalog.js`, principalmente em `WHATSAPP_NUMBER`, `CONFIG` e nas listas de produtos. O carrinho utiliza armazenamento local do navegador. Os pedidos ficam no banco de dados; a confirmacao e o pagamento sao realizados com a pizzaria. Nunca coloque segredos em `catalog.js`, pois ele tambem e publico.

Algumas fotos das pizzas salgadas ainda usam links externos. As demais imagens estao em `assets/`. As imagens e marcas pertencem aos respectivos titulares; este repositorio nao concede direitos sobre esses materiais.

A consulta de endereco requer acesso a `https://viacep.com.br`. O icone de carrinho utiliza Lucide, sob a licenca ISC incluida em `assets/lucide-LICENSE.txt`.

## Testes

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

No Windows com Edge instalado, use `$env:BROWSER_CHANNEL='msedge'` antes de
`npm run test:browser`. Os testes usam bancos temporarios isolados, nunca o
`DATABASE_URL` configurado. Capturas ficam em `test-results/` (ignorado pelo Git).
O teste de navegador cobre finalizacao, registro, login, status, persistencia,
logout, escape de HTML e ausencia de cortes no desktop e em telas de 390/320 px.
