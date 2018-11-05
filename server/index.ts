import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import registerRoutes from './routes';

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
registerRoutes(app);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Listening on Port ' + port);
});