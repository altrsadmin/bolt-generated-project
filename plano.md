# Plano de Desenvolvimento - Simplificação Backend

## Tarefas Imediatas (Fase 1)
1. **Desconectar Supabase** ✅
   - [x] Remover pacote `@supabase/supabase-js`
   - [x] Criar service `LocalStorageDB.ts` com métodos básicos
   - [x] Substituir chamadas do Supabase pelo novo service
   - [x] Manter estrutura de tabelas existente no localStorage

2. **Remover Autenticação** ✅
   - [x] Excluir contexto de autenticação original
   - [x] Criar sistema de autenticação local
   - [x] Implementar mock de usuário padrão
   - [x] Manter sessão via localStorage

## Tarefas de Simplificação (Fase 2)
3. **Remover serviços não essenciais** 🔄
   - [ ] Criar mock para Evolution API
   - [ ] Implementar mock para Notificame Hub
   - [ ] Remover dependências externas

4. **Simplificar modelos de dados**
   - [ ] Unificar interfaces
   - [ ] Reduzir complexidade de tipos
   - [ ] Atualizar tipos no código

5. **Substituir real-time features**
   - [ ] Implementar polling simples
   - [ ] Remover WebSockets
   - [ ] Criar PollingService

▶️ **Próximo Passo:** Iniciando implementação da Tarefa 3 - Mock dos serviços externos
