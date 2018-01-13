import express from 'express';
import routes from '../routes/index-route';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(morgan('dev'))
app.use('/', express.static('./dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../../../dist/index.html');
});

app.options('*', cors());
app.use('/api', routes);

export default app;