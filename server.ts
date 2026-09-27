import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import apiRouter from './routes/api';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({
    project: ENV.PROJECT_NAME,
    team: ENV.TEAM_NAME,
    hackathon: ENV.HACKATHON_NAME,
    demoUrl: ENV.DEMO_URL,
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', project: ENV.PROJECT_NAME, version: '1.0.0' });
});

app.use('/api', apiRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const startServer = async () => {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ${ENV.PROJECT_NAME} API Server`);
    console.log(`👨‍💻 Team: ${ENV.TEAM_NAME} | Hackathon: ${ENV.HACKATHON_NAME}`);
    console.log(`🌐 Server running on http://localhost:${ENV.PORT}`);
    console.log(`=======================================================`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
