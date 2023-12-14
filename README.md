# Node.js + OCI Vault + OCI Autonomous DB

Este repositório mostra a implementação de um sistema composto por 2 containers docker, front-end (NGINX) e back-end (oraclelinux + node.js). O back-end se comunica com os serviços oracle (Vault e Autonomous DB) e é capaz de listar e cadastrar registros, acessando o DB utilizando a senha salva no Vault.

![image](https://github.com/MarceloPreis/nodejs-autonomous/assets/91762820/39e44f85-87ae-4792-be0c-e27105d48c03)

# Inicializando projeto

- Adicionar sua wallet dentro da pasta back-end e renomear para wallet_mydb
- Adicionar pasta de configuração .oci dentro da pasta nodeapp
- Iniciar os containers docker
- Dentro do container node, rodar npm start
