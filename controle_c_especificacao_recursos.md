# Especificação de Recursos – Sistema Controle-C

O **Controle-C** é um ecossistema de gestão pessoal e financeira integrado, projetado para unificar a rotina do usuário em uma única interface visual de alta performance. O sistema centraliza compromissos, tarefas, hábitos e o diário financeiro em um painel interativo (Cockpit).

---

## 1. 🎛️ Cockpit Geral (Painel Inicial)
O painel inicial atua como uma central de monitoramento diário, compilando as informações mais urgentes e relevantes de todos os módulos para fornecer um panorama completo da rotina em segundos.

*   **Saudação Dinâmica:** Saudação personalizada que se adapta ao período do dia (Bom dia, Boa tarde ou Boa noite) junto ao nome do usuário.
*   **Relógio e Calendário Integrados:** Exibição da hora exata em tempo real e data completa (dia da semana, dia do mês e mês atual).
*   **Painel de Saldo e Fluxo Mensal:**
    *   **Saldo Disponível:** Exibido em destaque com carregamento animado e progressivo dos valores.
    *   **Indicadores de Fluxo:** Exibição resumida dos valores totais de Entradas (Receitas) e Saídas (Despesas) do mês vigente.
*   **Widget de Agenda:** Visualização rápida dos três compromissos mais próximos agendados para o dia atual.
*   **Widget de Hábitos:** Anel de progresso circular dinâmico que exibe graficamente a porcentagem de conclusão das rotinas diárias programadas para hoje, acompanhado do número total de hábitos concluídos e pendentes.
*   **Widget Financeiro:** Histórico compacto exibindo os lançamentos financeiros mais recentes com ícones temáticos de identificação de categoria.
*   **Widget de Tarefas:** Exibição simplificada das quatro tarefas pendentes mais importantes do dia, destacando com alerta visual vermelho as obrigações que estão fora do prazo.
*   **Widget de Alertas (Contas a Vencer):** Monitoramento das datas de vencimento de despesas fixas ou planejadas com vencimento próximo.

---

## 2. 💰 Módulo Financeiro (Financial Dashboard)
O módulo de controle de finanças é dividido em duas sub-abas integradas: o controle de **Transações** ativas e a área de **Planejamento** a médio e longo prazo.

### Sub-aba A: Transações (Gestão Financeira Ativa)
*   **Resumos Dinâmicos:** Cards informativos com o cálculo automático do Saldo Geral, total de Entradas e total de Saídas do período filtrado.
*   **Diário de Transações Recentes:**
    *   **Identificação por Ícones:** Cada transação exibe um emoticon associado à categoria correspondente (ex: 🍽️ Alimentação, 🚗 Transporte, 🎉 Lazer, 💊 Saúde/Farmácia, 🏠 Moradia, 🛍️ Compras, 💰 Entradas).
    *   **Detalhamento de Parcelas:** Formatação automática de compras parceladas, convertendo marcações complexas em etiquetas limpas no formato `(Parcela Atual/Parcelas Totais)`.
    *   **Informações Complementares:** Exibição da data exata do lançamento, categoria e a forma de pagamento utilizada (Pix, Crédito, Débito, Dinheiro).
    *   **Edição e Exclusão Rápida:** Atalhos diretos em cada card de transação para fazer edições de valores ou a exclusão do registro.
*   **Filtros Avançados e Campo de Busca:**
    *   Busca textual livre por descrição, título ou notas da transação.
    *   Filtro por período de datas (Data Inicial e Data Final).
    *   Filtro por Tipo de transação (Todas, Entradas ou Saídas).
    *   Filtro por Categoria cadastrada.
    *   Filtro por Forma de Pagamento (Pix, Débito, Crédito, Dinheiro).
*   **Gráfico de Categorias Dinâmico (`ExpensePieChart`):** Gráfico de pizza interativo que exibe a divisão percentual exata dos gastos do usuário por categoria no período selecionado.
*   **Exportação de Relatórios (PDF):** Funcionalidade que compila os lançamentos filtrados e gera instantaneamente um relatório em PDF formatado contendo os dados do usuário, o balanço de saldo do período e a tabela de transações.
*   **Configurador de Limites de Gastos (`ExpenseLimits`):** Ferramenta para definir tetos orçamentários mensais para categorias específicas. O progresso do consumo do limite é exibido por barras coloridas (verde, amarelo e vermelho) que mudam conforme o gasto se aproxima do limite.
*   **Gerenciador de Lembretes Recorrentes (`RecurringReminders`):** Lista de contas fixas recorrentes para acompanhamento mensal de vencimentos.
*   **Formulário de Lançamento (`TransactionModal`):** Interface para inclusão de transações contendo campos de Valor, Tipo (Entrada/Saída), Descrição, Categoria, Forma de Pagamento, Data e recorrências.

### Sub-aba B: Planejamento (Previsão e Simulação)
*   **Indicadores de Planejamento:** Cards exibindo o Total Projetado de despesas para o mês, o montante que já foi marcado como pago (Já Pago) e o valor ainda pendente (Pendente).
*   **Navegador de Meses:** Botões de avanço e retrocesso para realizar o planejamento financeiro de meses futuros.
*   **Simulador de Tipos de Despesas:**
    *   **Parcelado:** Simulação de compras parceladas com definição de parcelas totais e atuais.
    *   **Assinatura:** Custos recorrentes fixos de cobrança mensal (ex: streaming, internet).
    *   **Único:** Despesas pontuais planejadas para datas específicas futuras (ex: impostos, IPVA, IPTU).
*   **Check de Pagamento com Integração Automática:** Ao marcar um item planejado como "Pago", o sistema cria automaticamente a transação de despesa correspondente no diário financeiro ativo, sem a necessidade de o usuário redigitar as informações.
*   **Controle de Lembretes:** Ativação e desativação de notificações e lembretes para cada item planejado.

---

## 3. 📅 Módulo Agenda (Calendário Integrado)
Uma ferramenta visual de gerenciamento de compromissos que funciona em tempo real por meio de integração com contas Google.

*   **Sincronização Nativa Google Calendar:**
    *   Conexão por fluxo seguro OAuth 2.0 (Google).
    *   Sincronização automática bidirecional (busca os eventos existentes na conta do Google Agenda e grava novos eventos criados na plataforma).
*   **Modo de Visualização em Grade Semanal (Grid View):**
    *   Colunas de segunda a domingo organizadas pelas 24 horas do dia.
    *   **Linha de Tempo Atual Dinâmica:** Marcador horizontal luminoso com indicação de hora flutuante e ponto pulsing que indica a hora exata na grade.
    *   **Foco Automático Inteligente (`performScrollToNow`):** Ao abrir a agenda, o sistema rola o foco da tela automaticamente para centralizar a exibição no horário comercial (8h) ou no horário atual do dia, otimizando o fluxo de uso.
*   **Botão de Foco Rápido:** Atalho no cabeçalho em forma de relógio para re-centralizar instantaneamente a tela na hora atual.
*   **Modo de Visualização em Lista:** Alterna a exibição da grade semanal por uma lista cronológica limpa contendo os próximos compromissos organizados por data.
*   **Eventos Interativos:** Os eventos são exibidos como blocos dimensionados dinamicamente de acordo com o horário de início e fim. O clique no evento abre o painel de edição/exclusão.
*   **Formulário de Agendamento (`EventModal`):** Interface para inclusão e edição de eventos contendo campos para Título do Evento, Data, Horário de Início/Fim e Descrição.

---

## 4. ✅ Módulo de Tarefas (Tasks Board)
Gerenciador de obrigações e projetos estruturado em colunas, focado na priorização diária de tarefas.

*   **Colunas de Projetos Customizados:**
    *   Distribuição de tarefas em colunas dedicadas de projetos/áreas de vida.
    *   Definição de cores individuais para cada projeto (indicadas por marcadores coloridos).
    *   Badges numéricas com o total de tarefas pendentes in each coluna.
*   **Filtros de Data Individuais por Projeto:** Cada coluna de projeto possui seu próprio micro-calendário seletor de data, permitindo filtrar e exibir apenas as tarefas programadas para um dia específico dentro daquela área isolada.
*   **Cards de Tarefa Interativos:**
    *   **Marcador de Conclusão:** Círculo de seleção rápida para concluir a tarefa.
    *   **Regras de Recorrência:** Tarefas com repetição automática (Diária, Semanal, Mensal) exibem uma badge de "Loop" com as regras de repetição cadastradas.
    *   **Alerta de Atraso:** Tarefas com prazos expirados recebem uma borda vermelha e uma etiqueta com a indicação "Vencida".
*   **Painel Oculto de Concluídas:** Seção retrátil no rodapé de cada coluna ("Ver concluídas") que agrupa as tarefas já finalizadas, mantendo a área de trabalho organizada sem perder o histórico do projeto.
*   **Criação Rápida Inline:** Botão de inclusão de tarefas no rodapé de cada projeto, permitindo cadastrar novas tarefas pré-vinculadas àquela coluna de forma ágil.

---

## 5. 🔥 Módulo de Hábitos (Habit Tracker)
Painel desenvolvido para rastreamento de rotinas diárias e desenvolvimento de novos hábitos.

*   **Painel de Estatísticas Diárias:**
    *   **Barra de Progresso:** Exibição percentual do volume de hábitos diários que já foram concluídos no dia de hoje.
    *   **Contadores de Placar:** Número de hábitos programados para hoje e total de hábitos já concluídos.
*   **Organização por Dias de Funcionamento:**
    *   **Hábitos de Hoje:** Lista de rotinas ativas e programadas para o dia atual da semana.
    *   **Descanso Hoje:** Hábitos que não possuem dia de funcionamento programado para hoje recebem a badge `Descanso` (representada por um ícone de café), poupando o usuário de registrar o hábito sem penalizar sua sequência de dias.
*   **Metas Diárias Fracionadas (Goal Tracker):** Suporta hábitos que exigem múltiplas repetições diárias (ex: "Beber água - meta: 5x"). O botão de check se transforma em um contador incremental (`Marcar +1 (2/5)`) até bater a meta diária.
*   **Indicador de Sequência (Streaks):** Mostra um ícone de chama com o número de dias seguidos de sucesso (`🔥 X dias de sequência`) para alimentar a motivação do usuário.
*   **Calendário de Histórico Estilo "GitHub Grid" (`HabitHistoryModal`):**
    *   Um modal robusto que abre ao clicar em qualquer hábito, mostrando métricas de Taxa Geral de Sucesso, Meta Semanal e Meta Mensal.
    *   Renderiza uma grade visual mostrando cada dia do mês: círculos coloridos brilhantes para dias concluídos, cinzas para dias futuros/sem registro e vermelhos para falhas.
    *   **Edição Retroativa Interativa:** O usuário pode clicar em qualquer quadrado/dia do calendário passado para adicionar ou remover logs manualmente, permitindo correções retroativas no histórico do hábito.
*   **Customização Estética do Hábito:** Modal para configurar Nome, Descrição, emoji do ícone (através de um seletor popover), Cor do tema e os dias específicos da semana em que o hábito deve rodar.

---

## 6. ⚙️ Módulo de Configurações (Settings)
Painel administrativo para controle e personalização da conta e das integrações.

*   **Ajustes de Perfil (WhatsApp):**
    *   Campo para inserção do número de celular.
    *   **Formatação Inteligente:** Formata e insere máscara de celular automaticamente `(XX) XXXXX-XXXX` durante a digitação.
    *   **Tratamento do Número:** O sistema padroniza o número internacional padrão (`+55`) e trata o nono dígito automaticamente antes de salvar, assegurando a integridade em integrações e disparos de webhooks externos.
*   **Segurança (Senha):** Formulário direto de alteração de senha da conta com verificação dupla.
*   **Controle de Integrações:** Gerenciamento da conexão com o Google Agenda (Badge de status verde "Conectado" ou vermelha "Desconectado"), acompanhado por botões de ação para Conectar ou Desconectar a conta com segurança.
*   **Central de Ajuda:** Atalho para a rota `/como-usar`, contendo uma biblioteca de vídeos explicativos com 6 tutoriais passo a passo sobre o uso do painel.
