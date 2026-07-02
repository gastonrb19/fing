import express from 'express';
import {testConnection} from './src/config/connection.ts';

const app = express();

const PORT = process.env.PORT || 8000;

await testConnection();

app.listen(PORT, () => console.log(`running on port:${PORT}`))
