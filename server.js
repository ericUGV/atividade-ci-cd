const express = require('express');
const client = require('prom-client');

const app = express();
// Coleta métricas padrão da aplicação
const objectDefautMetrics = client.collectDefaultMetrics;
objectDefautMetrics({ timeout: 5000 });

// Cria um contador para o total de requisições recebidas
const counter = new client.Counter({
  name: 'app_requests_total',
  help: 'Contador de requisições recebidas',
});

// Cria um novo histograma para medir a duração das requisições
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duração das requisições HTTP em milissegundos',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

// Middleware para medir a duração das requisições
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => {
    // Incrementa o contador a cada requisição na rota raiz
    counter.inc();
    res.send('Hello World!');
});

app.get('/metrics', async (req, res) => {
    // Rota para expor as métricas ao Prometheus
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});