---
sidebar_position: 8
title: IA e modelos
description: "Conecte um modelo compatível com OpenAI, mantenha instruções e chaves locais pelo processo principal, use chamada de função nativa com fallback automático e conserve o mesmo fluxo na web."
---

# IA e modelos

A capacidade do assistente depende do modelo subjacente, por isso Powerduck não o fixa a um fornecedor concreto. Você escolhe e configura o modelo, a app chama-o por uma rota local segura, e cada mudança passa pelos mesmos cartões revisáveis.

## Trazer um modelo

Nos ajustes, configure o assistente para qualquer endpoint de Chat Completions **compatível com OpenAI**.

- Escolha uma predefinição de fornecedor ou defina um **personalizado**.
- Aporte nome visível, URL base, chave API e ID de modelo.
- Configure vários perfis e escolha entre eles.

A app não assume que o modelo venha de um fornecedor concreto. Os endpoints auto-hospedados ou de terceiros compatíveis funcionam igual, importante para equipas com estratégia própria de modelos.

## Funções avançadas e fallback elegante

Cada perfil tem um interruptor de **funções avançadas**, ativado por defeito.

- Ativado, a app usa a **chamada de função nativa** do modelo: envia o catálogo de ferramentas pela rede e deixa o modelo escolher e chamar diretamente a ferramenta adequada.
- Se um endpoint rejeita argumentos de ferramentas nativos — modelos pequenos sem suporte — esse endpoint lembra-se e faz-se uma única retentativa por um **protocolo de fallback baseado em conteúdo**.

O objetivo é devolver sempre um resultado: os modelos potentes tomam a rota nativa precisa, os modelos sem ferramentas baixam a um protocolo mais simples em vez de perder o turno. Pode desativar funções avançadas para perfis que devam usar sempre a rota base.

O trabalho impulsionado por ferramentas também tem limites: o agente executa um número limitado de turnos (3 por defeito) e deduplica chamadas para que uma ferramenta não corra duas vezes em ciclo.

## Porquê encaminhar pelo processo principal

No desktop, a requisição completa emite-a o **processo principal Node**, não a WebView. Duas vantagens concretas.

- **Sem muro CORS do navegador.** As restrições cross-origin da web não bloqueiam as chamadas ao endpoint do modelo.
- **Instruções e chaves fora da consola.** URL, cabeçalhos de autenticação, instrução do sistema e lista de ferramentas não aparecem no painel de rede do renderer.

O gateway está deliberadamente restrito, não é um proxy aberto.

- Valida destinos (loopback e hosts permitidos), saneia cabeçalhos e evita a injeção de quebras de linha por cabeçalhos de resposta.
- As requisições são canceláveis (`ai:cancel`).

## Desktop e web

O mesmo assistente funciona em ambos os ambientes com a rota adaptada a cada um.

- **Desktop (Electron):** as capacidades importam-se e executam localmente, e a requisição encaminha-se pelo processo principal.
- **Web:** o mesmo fluxo executa-se por HTTP, chamando as APIs do serviço em vez de módulos locais.

Por isso a app mantém uma rota compatível com a web além da de Electron. O tratamento da intenção e a apresentação de cartões são iguais; só muda o transporte.

## Como se identifica a intenção

A intenção não se gere listando palavras-chave por função. A app apresenta ao modelo um **catálogo de ferramentas** claro e bem descrito — ID de cada ferramenta, argumentos e situação exata de uso. O modelo escolhe a melhor ferramenta do catálogo, o host determinista valida-a e executa, e as escritas pedem confirmação.

Adicionar uma capacidade significa adicionar uma ferramenta ao catálogo (com descrição precisa), não manter listas mais longas de palavras-chave. O mesmo catálogo compartilha-se com agentes externos pelo servidor MCP, para alinhar capacidades entre o produto e outras ferramentas.

## Privacidade

- No desktop, as chaves API e instruções permanecem locais e não se expõem ao renderer.
- O host determinista, não o modelo, valida e aplica cada mudança.
- Toda escrita recebe a sua aprovação antes de executar.

Veja também: [Desenhar com o assistente](./design.md)、[Ajustes](./settings.md)、[Controlo de acesso na Cloud](../cloud/access-control.md).
