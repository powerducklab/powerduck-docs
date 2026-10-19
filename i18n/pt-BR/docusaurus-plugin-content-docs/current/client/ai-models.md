---
sidebar_position: 8
title: IA e modelos
description: "Configure modelos compatíveis com OpenAI e entenda os transportes desktop e web, a alternativa para chamadas de ferramentas e os dados enviados ao provedor."
---

# IA e modelos

O Powerduck permite escolher e configurar o modelo do assistente. No desktop, as solicitações passam pelo processo principal até o endpoint escolhido; mudanças no documento continuam sendo apresentadas em cartões para revisão.

## Trazer um modelo

Nos ajustes, configure o assistente para qualquer endpoint de Chat Completions **compatível com OpenAI**.

- Escolha uma predefinição de fornecedor ou defina um **personalizado**.
- Aporte nome visível, URL base, chave API e ID de modelo.
- Configure vários perfis e escolha entre eles.

Nenhum provedor específico é obrigatório. Endpoints compatíveis com OpenAI, próprios ou de terceiros, funcionam da mesma forma, permitindo que equipes sigam sua política de modelos.

## Funções avançadas e fallback elegante

Cada perfil tem um interruptor de **funções avançadas**, ativado por defeito.

- Ativado, a app usa a **chamada de função nativa** do modelo: envia o catálogo de ferramentas pela rede e deixa o modelo escolher e chamar diretamente a ferramenta adequada.
- Se um endpoint rejeita argumentos de ferramentas nativos — modelos pequenos sem suporte — esse endpoint lembra-se e faz-se uma única retentativa por um **protocolo de fallback baseado em conteúdo**.

A alternativa melhora a compatibilidade, mas não garante sucesso: erros de rede, autenticação e modelo ainda podem ocorrer. Desative os recursos avançados se um perfil precisar usar sempre o modo básico.

O uso de ferramentas tem limites: o agente executa um número limitado de rodadas, três por padrão, e elimina chamadas repetidas na mesma execução.

## Porquê encaminhar pelo processo principal

No desktop, a requisição completa emite-a o **processo principal Node**, não a WebView. Duas vantagens concretas.

- **Sem muro CORS do navegador.** As restrições cross-origin da web não bloqueiam as chamadas ao endpoint do modelo.
- **A solicitação HTTP ocorre fora do renderer.** Seu painel de rede não mostra a comunicação HTTP do processo principal. Isso não garante que prompts ou chaves estejam ausentes da memória do renderer, de logs ou de outras ferramentas de desenvolvimento.

O gateway desktop valida a estrutura das solicitações e aplica limites de recursos:

- Aceita apenas URLs HTTP(S); verifica nomes e valores de cabeçalhos, tamanho do corpo, tempos limite e solicitações simultâneas. Endpoints locais e privados são permitidos. Isso não é uma lista de hosts autorizados nem uma garantia de privacidade do provedor;
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

- Prompts, contexto selecionado, descrições de ferramentas e credenciais são enviados ao endpoint do modelo configurado. Um provedor hospedado recebe esses dados; use um endpoint local confiável se sua política exigir inferência local;
- O host determinista, não o modelo, valida e aplica cada mudança.
- Toda escrita recebe a sua aprovação antes de executar.

Veja também: [Desenhar com o assistente](./design.md)、[Ajustes](./settings.md)、[Controlo de acesso na Cloud](../cloud/access-control.md).
