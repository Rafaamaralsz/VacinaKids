# VacinaKids

Plataforma digital para acompanhamento da vacinação infantil, desenvolvida para substituir parcialmente a carteira física de vacinação. Permite que pais e responsáveis gerenciem o histórico vacinal de seus filhos, acompanhem o progresso e fiquem informados sobre campanhas ativas.

## Tecnologias Utilizadas

- **Ionic Framework 8** — UI components multiplataforma
- **Angular 20** — Framework SPA com Standalone Components
- **TypeScript** — Tipagem forte
- **SCSS** — Estilização com variáveis customizadas
- **Angular Reactive Forms** — Formulários reativos
- **Angular Services** — Camada de serviços com POO
- **Firebase Firestore** — Persistência de dados (opcional)
- **Firebase Hosting** — Deploy em produção

## Paleta de Cores

| Cor           | Hex       | Uso                          |
|---------------|-----------|------------------------------|
| Verde         | `#ABC270` | Primary, sucesso, progresso  |
| Amarelo       | `#FEC868` | Alertas pendentes, destaque  |
| Laranja       | `#FDA769` | Secondary, ações, ícones     |
| Marrom escuro | `#473C33` | Textos, títulos, contraste   |

## Estrutura de Pastas

```
vacinakids/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── child-card/
│   │   │   ├── vaccine-card/
│   │   │   ├── campaign-card/
│   │   │   ├── status-badge/
│   │   │   └── progress-vaccination/
│   │   ├── data/
│   │   │   └── mock-data.ts     # Dados mockados iniciais
│   │   ├── models/              # Classes TypeScript (POO)
│   │   │   ├── child.model.ts
│   │   │   ├── vaccine.model.ts
│   │   │   └── campaign.model.ts
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── dashboard/
│   │   │   ├── children/
│   │   │   ├── child-detail/
│   │   │   ├── child-form/
│   │   │   ├── vaccine-history/
│   │   │   └── campaigns/
│   │   ├── services/            # Serviços Angular
│   │   │   ├── child.service.ts
│   │   │   ├── vaccine.service.ts
│   │   │   └── campaign.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   ├── theme/
│   │   └── variables.scss
│   ├── global.scss
│   └── main.ts
├── firebase.json
├── .firebaserc
├── angular.json
├── ionic.config.json
└── package.json
```

## Funcionalidades

### Dashboard
- Resumo de crianças cadastradas, vacinas aplicadas, pendentes e atrasadas
- Campanhas ativas em destaque
- Barra de progresso vacinal geral

### Crianças
- CRUD completo (listar, adicionar, editar, remover)
- Idade calculada automaticamente
- Cards com progresso vacinal

### Histórico Vacinal
- Lista de vacinas por criança
- Status automático: Aplicada, Pendente ou Atrasada
- Filtros por status

### Campanhas
- Exibição de campanhas ativas em destaque
- Filtro entre campanhas ativas e todas

## Dados Mockados

A aplicação inicia com:

- **Ana Oliveira** — 4 anos (13 vacinas no histórico)
- **Lucas Oliveira** — 2 anos (9 vacinas no histórico)
- **2 campanhas ativas** de vacinação

## Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+ (LTS recomendado)
- npm 10+

### Instalação

```bash
# Clone ou acesse o diretório do projeto
cd vacinakids

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

### Scripts Disponíveis

| Comando       | Descrição                              |
|---------------|----------------------------------------|
| `npm start`   | Servidor de desenvolvimento            |
| `npm run build` | Build de produção (output: `www/`)   |
| `npm run deploy` | Build + deploy no Firebase Hosting  |

## Firebase Firestore (Opcional)

Por padrão, a aplicação utiliza dados mockados em memória. Para habilitar o Firestore:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Copie as credenciais para `src/environments/environment.ts` e `environment.prod.ts`
4. Altere `useFirebase: true` nos arquivos de environment
5. Importe os dados mockados para as collections `children`, `vaccines` e `campaigns`

## Deploy no Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login e configuração

```bash
firebase login
firebase init hosting
```

Selecione:
- **Public directory:** `www`
- **Single-page app:** Yes
- **Overwrite firebase.json:** No (já configurado)

Atualize o project ID em `.firebaserc`:

```json
{
  "projects": {
    "default": "seu-projeto-firebase"
  }
}
```

### 3. Build e deploy

```bash
npm run build
firebase deploy --only hosting
```

Ou use o script combinado:

```bash
npm run deploy
```

## Responsividade

A interface adapta-se a três breakpoints:

- **Mobile** (< 768px) — Navegação inferior, layout em coluna única
- **Tablet** (768px – 1199px) — Grid de 2 colunas
- **Desktop** (≥ 992px) — Menu lateral fixo, grid de 3+ colunas

## Licença

Projeto acadêmico — VacinaKids © 2026
