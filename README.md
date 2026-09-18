# Projeto-Pizzaria

Site da Pizzaria Realeza com cardapio responsivo e envio de pedidos pelo WhatsApp.

## Executar

Abra `index.html` no navegador. O projeto utiliza HTML, CSS e JavaScript, sem instalacao de dependencias.

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
- `script.js`: cardapio, configuracoes, carrinho e finalizacao.
- `assets/`: imagens usadas pelo site.
- `assets/drinks/sources.json`: origem das fotos de catalogo dos refrigerantes.

## Configuracao

Os dados do estabelecimento, telefone, horarios, produtos e precos ficam em `script.js`, principalmente em `WHATSAPP_NUMBER`, `CONFIG` e nas listas de produtos. O carrinho utiliza armazenamento local do navegador. O site monta a mensagem do pedido; a confirmacao e o pagamento sao realizados com a pizzaria.

Algumas fotos das pizzas salgadas ainda usam links externos. As demais imagens estao em `assets/`. As imagens e marcas pertencem aos respectivos titulares; este repositorio nao concede direitos sobre esses materiais.

A consulta de endereco requer acesso a `https://viacep.com.br`. O icone de carrinho utiliza Lucide, sob a licenca ISC incluida em `assets/lucide-LICENSE.txt`.
