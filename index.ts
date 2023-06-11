import express, { Express } from 'express';
import Routes from './src/routes/routes';
const port = 3020
export const app: Express = express()

Routes(app)


app.listen(port, () => {
  console.log(`Running on -> ${port}`);
});


