# Testes E2E com Playwright

## Instalação

```bash
npm install
npx playwright install chromium
```

## Executar Testes

### Todos os testes
```bash
npm run test:e2e
```

### Interface gráfica
```bash
npm run test:e2e:ui
```

### Modo debug
```bash
npm run test:e2e:debug
```

## Testes de Login

Os testes de login verificam:
- Exibição do formulário de login
- Validação de campos vazios
- Tratamento de credenciais inválidas
- Fluxo completo de login com credenciais válidas
- Captura de logs `[AUTH]` durante o processo

## Credenciais de Teste

Os testes usam as seguintes credenciais:
- Email: `admin@example.com`
- Senha: `Admin@123456`

Certifique-se de que essas credenciais existem no seu Supabase antes de executar os testes.

