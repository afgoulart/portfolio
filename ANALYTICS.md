# 📊 Analytics Tracking - Portfolio

Este projeto implementa tracking detalhado com Google Analytics 4 para monitorar visualizações, sessões e interações por idioma.

## 🎯 **Eventos Trackados**

### **1. Sessões e Visitas**

- ✅ **session_start** - Início de cada sessão
- ✅ **site_visit** - Visita ao site (com info detalhada)
- ✅ **session_end** - Final da sessão
- ✅ **page_view** - Visualização de página com idioma

### **2. Visualizações por Seção**

- ✅ **section_view** - Quando 50% da seção fica visível
- ✅ **hero** - Seção inicial
- ✅ **about** - Sobre mim
- ✅ **skills** - Habilidades
- ✅ **companies** - Empresas
- ✅ **certifications** - Certificações
- ✅ **contact** - Contato

### **3. Tracking por Idioma**

- ✅ **page_language** - Idioma da página visitada
- ✅ **language_switch** - Troca de idioma (PT ↔ EN)
- ✅ Todas as métricas separadas por **pt** e **en**

### **4. Engagement**

- ✅ **scroll_depth** - Profundidade do scroll (25%, 50%, 75%, 100%)
- ✅ **time_on_page** - Tempo na página (a cada 30s)
- ✅ **user_active** - Atividade do usuário

### **5. Interações Específicas**

- ✅ **certificate_click** - Cliques em certificados
- ✅ **project_click** - Cliques em projetos
- ✅ **social_click** - Cliques em redes sociais
- ✅ **contact_form_submit** - Envio de formulário

## 📈 **Métricas Disponíveis no GA4**

### **Por Idioma:**

- Visualizações PT vs EN
- Tempo médio por idioma
- Taxa de rejeição por idioma
- Seções mais visualizadas por idioma

### **Por Seção:**

- Seção mais popular
- Tempo gasto em cada seção
- Taxa de visualização de cada seção
- Ordem de navegação

### **Engagement:**

- Duração média das sessões
- Profundidade de scroll
- Usuários novos vs recorrentes
- Dispositivos e localização

## 🚀 **Como Ativar**

1. **Configurar GA4:**

   ```bash
   # .env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Já está integrado automaticamente:**
   - ✅ Componente `GoogleAnalytics` no layout
   - ✅ `AnalyticsProvider` na página principal
   - ✅ Hooks de tracking em todas as seções

## 📊 **Relatórios Personalizados no GA4**

### **1. Relatório por Idioma:**

```
Dimensão: page_language
Métrica: Visualizações, Sessões, Usuários
```

### **2. Relatório por Seção:**

```
Dimensão: section_name
Métrica: section_viewed (eventos)
```

### **3. Funil de Engagement:**

```
1. site_visit → 2. section_view → 3. certificate_click
```

## 🎮 **Eventos Customizados Disponíveis**

```typescript
// Exemplos de uso
trackCertificateClick("AWS Cloud Practitioner");
trackProjectClick("Portfolio", "github");
trackSocialClick("linkedin");
trackLanguageSwitch("pt", "en");
```

## 📱 **Dados Coletados**

- **Sessão:** Duração, idioma, seções visualizadas
- **Usuário:** Novo/recorrente, localização, dispositivo
- **Comportamento:** Scroll, tempo, cliques, interações
- **Performance:** Carregamento, navegação between seções
- **Conversão:** Cliques em certificados, contato, social

---

**🔒 Privacidade:** Todos os dados são anonimizados pelo Google Analytics 4 e seguem as diretrizes GDPR.

# GA4
