import express from 'express';
import routes from './routes';
import { dbInit } from './models';

const app = express();

app.use(express.json());
app.use(express.static('public'));  
app.use('/api', routes);

dbInit();

export default app;
