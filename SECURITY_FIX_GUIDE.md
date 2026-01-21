# 🚨 Guia de Correção de Segurança - Chave OpenAI Vazada

## ✅ O que já foi feito automaticamente:

1. ✅ Removida a chave de API do código fonte (`useVoiceAssistant.js`)
2. ✅ Configurado para usar variável de ambiente `VITE_OPENAI_API_KEY`
3. ✅ Atualizado `.gitignore` para proteger o arquivo `.env`
4. ✅ Atualizado `.env.example` com placeholder

## 🔑 Ações URGENTES que VOCÊ precisa fazer:

### **1. Criar Nova Chave na OpenAI** ⚠️ FAÇA AGORA

1. Acesse: https://platform.openai.com/api-keys
2. **DELETE** a chave antiga se ainda estiver lá:
   - Nome: `jarvis (sk-pro...eoA)`
   - Já deveria estar desabilitada pela OpenAI
3. Clique em **"Create new secret key"**
4. Nome sugerido: `Jarvis Voice Assistant - $(date)`
5. **COPIE** a chave (só aparece uma vez!)
6. Guarde em local seguro (ex: gerenciador de senhas)

### **2. Atualizar arquivo .env local**

Edite o arquivo `e:\Documentos\GitHub\jarvis\.env`:

```env
VITE_GOOGLE_CLIENT_ID=84457801558-v2hlgh59vfbei2iar6iuo7n9of05go6j.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=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
VITE_OPENAI_API_KEY=sk-proj-NOVA_CHAVE_AQUI
```

⚠️ **IMPORTANTE**: Substitua `sk-proj-NOVA_CHAVE_AQUI` pela chave real copiada no passo 1!

### **3. Commit das correções**

Execute no terminal:

```bash
cd e:\Documentos\GitHub\jarvis

# Adicionar arquivos
git add .

# Commit com mensagem descritiva
git commit -m "security: remove hardcoded OpenAI API key and use env variable"

# Push para o GitHub
git push origin main
```

### **4. Limpar Histórico do Git** (CRÍTICO)

A chave antiga AINDA ESTÁ no histórico do Git. Para remover:

#### Opção A: Usar BFG Repo-Cleaner (RECOMENDADO)

1. Baixar BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Execute:
```bash
# Backup do repositório primeiro!
cd e:\Documentos\GitHub
git clone --mirror jarvis jarvis-backup

# Limpar chave do histórico
java -jar bfg.jar --replace-text passwords.txt jarvis

cd jarvis
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

Conteúdo de `passwords.txt`:
```
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
```

#### Opção B: Recriar Repositório (MAIS SIMPLES)

Se o histórico não for importante:

```bash
# 1. Backup local
cd e:\Documentos\GitHub
cp -r jarvis jarvis-backup

# 2. Remover pasta .git
cd jarvis
rm -rf .git

# 3. Criar novo repositório
git init
git add .
git commit -m "Initial commit - clean history"

# 4. Reenviar para GitHub (criar novo repo no GitHub primeiro)
git remote add origin https://github.com/SEU-USUARIO/jarvis-novo.git
git branch -M main
git push -u origin main
```

### **5. Verificar Vercel/Deploy**

Se você fez deploy na Vercel:

1. Acesse: https://vercel.com/dashboard
2. Vá em Settings → Environment Variables
3. Adicione `VITE_OPENAI_API_KEY=nova_chave_aqui`
4. Redeploy o projeto

## ✅ Checklist Final

- [ ] Nova chave OpenAI criada
- [ ] Chave antiga deletada/confirmada como desabilitada
- [ ] Arquivo `.env` atualizado localmente
- [ ] Commit das correções feito
- [ ] Push para GitHub realizado
- [ ] Histórico do Git limpo (BFG ou repo novo)
- [ ] Variável de ambiente configurada na Vercel (se aplicável)
- [ ] Aplicação testada com nova chave

## 🛡️ Boas Práticas para o Futuro

1. **NUNCA** commit chaves de API no código
2. **SEMPRE** usar variáveis de ambiente (`.env`)
3. **SEMPRE** adicionar `.env` ao `.gitignore`
4. Usar `.env.example` com placeholders
5. Rotacionar chaves periodicamente
6. Usar gerenciador de senhas para guardar chaves
7. Configurar alertas de segurança no GitHub

## 📚 Referências

- [OpenAI Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**Status Atual**: ⚠️ AÇÃO NECESSÁRIA - Siga os passos acima
