---
sidebar_position: 1
title: Powerduck Cloud
description: "Ponha a sua especificação OpenAPI online em minutos. Publique documentação renderizada e um endpoint MCP gerenciado, escolha a exposição, controle o acesso e compartilhe links estáveis sem executar nada."
---

# Powerduck Cloud

Powerduck Cloud torna um arquivo OpenAPI em algo **compartilhável**. Adicione a sua spec, escolha o que expor e depois compartilhe links estáveis à documentação renderizada e um servidor MCP gerenciado. Sem auto-hospedagem nem executar nada.

É o mesmo fluxo orientado a contrato e impulsionado por IA que o cliente de desktop, online para equipes e consumidores.

## O fluxo

1. **Adicionar a spec** — arquivo, repositório Git ou URL. Pode iniciar o fluxo desde o site e iniciar sessão ao publicar sem voltar a subir.
2. **Escolher a exposição.** Operações ativadas individualmente; o arquivo original não muda.
3. **Abrir o link de documentação logo** — a documentação está ativada por defeito. O endpoint MCP permanece desativado até querer oferecer ferramentas a agentes: um interruptor.
4. **Controlar o acesso.** Adicionar senha de visualização e data de validade, além de uma chave de acesso MCP independente para agentes.
5. **Publicar e compartilhar.** Publique os artefatos finais da versão atual: os links resolvem, o controlo avançado a um clique.
6. **Manter-se atualizado.** Cada mudança cria uma nova versão para comparar/reverter, e as fontes Git sincronizam-se com as atualizações.
7. **Gerenciar o ciclo de vida.** Pausar, retomar, arquivar e ver estado, versão e origem de um relance.

## O que obtém

- **Link estável de documentação** — legível após novas versões.
- **Endpoint MCP gerenciado** — agentes de IA externos descobrem e chamam as operações escolhidas.
- **Exposição por operação** — excluir interfaces internas/inacabadas da superfície pública.
- **Controlo de acesso** — senha de visualização, validade, chave de acesso MCP.
- **Histórico de versões** — comparar e revertir; o original nunca se sobrescreve.
- **Sincronização Git** — reflete as atualizações do repositório como novas versões hospedadas.
- **Domínios personalizados** — experiência de marca incluída a configuração de subcaminho.

### Um documento, várias versões

Cada edição cria uma nova versão em vez de sobrescrever, para comparar, revertir e regenerar documentação/MCP para um estado concreto. A documentação e MCP estão sempre ligados a um documento e versão concretos, nunca a um vago «estado atual».

### Porquê um link pode não abrir

Um link de documentação ou MCP resolve quando se dão três coisas, e o espaço do documento mostra cada uma e realça o primeiro requisito faltante.

1. O documento está **ativo** — pausar tira documentação e MCP juntos da rede.
2. O modo a compartilhar está **ativo** — um interruptor por modo para documentação e MCP (documentação por defeito ativa, MCP por defeito inativa).
3. O artefato atual está **publicado** — construído automaticamente após adicionar versão ou mudar exposição, normalmente sem ação; publicação manual como respaldo.

As verificações de acesso — senha de visualização, validade, chave de acesso MCP — atuam por cima destas três.

## Início de sessão e pertença

Inicie sessão com **Google** ou **GitHub**. Após o handshake OAuth, Powerduck emite a sua própria sessão num cookie HttpOnly seguro, e o token do fornecedor não serve como identidade a longo prazo. Tudo pertence a uma **Organização**; cria-se automaticamente uma organização pessoal para compartilhar em equipe mais adiante sem redesenho.

## A consola

- **Dashboard** — adicionar specs e ver documentos recentes com links rápidos e ações de início/parada.
- **Projects** — organizar documentos.
- **Espaço do documento** — estado, documentação, MCP, operações expostas, versões, origem, domínios em separadores claros.
- **Billing** — estado de subscrição e pedidos separados.
- **Hub** — publicar e explorar documentação e servidores MCP públicos.
- **Settings** e **Activity** — perfil, preferências, registo de auditoria.

Os leitores públicos usam um visualizador próprio e não precisam de conta se o documento não pede senha.

## Cloud versus cliente de desktop

| | Cliente de desktop | Cloud |
|---|---|---|
| Execução | A sua máquina | Hospedado |
| Modelo | Licença perpétua, compra única | Subscrição mensal |
| Resultado | Chave de licença (mostrada uma vez) | Membresia, sem chave |
| Quando | Local, sem conexão, âmbito completo | Compartilhar e publicar online |

Ambos se complementam e vendem-se separadamente. Veja [Faturação](./billing).

## Comece aqui

- [Início rápido da Cloud](./quickstart)
- [Documentos e versões](./documents-versions)
- [Operações expostas](./exposure)
- [Controlo de acesso](./access-control)
- [Domínios personalizados](./custom-domains)
- [Faturação](./billing)
