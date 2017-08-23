# Pokemon Api

Este repositório é um desafio. A ideia é pegar uma api muito simples, tentar melhorá-la ao máximo e corrigir seus erros.

# Como rodar o projeto:

  - Clonar o repositório
```sh
$ git clone https://github.com/otaviopace/pokemon-api.git
```
  - Executar npm install
```sh
$ npm install
```
  - Executar um banco MySQL ou apontar para um que já esteja em funcionamento
  - Alterar as variáveis no script start e/ou dev do package.json

Observação: As variáveis de conexão ao banco estão sendo buscadas do ambiente, olhar arquivo ./models/index.js.


Também é possível executar o projeto utilizando Docker:
  - Existe um arquivo de deploy (./deploy.sh) que realiza o processo de construir imagem, parar container, remover container, construir container.
```sh
$ sh deploy.sh
```
  - Deve-se ficar atento(a) as variáveis inseridas no ./deploy.sh

