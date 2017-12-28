import express from 'express';
import morgan from 'morgan';
import routes from '../routes/index-route';
import bodyParser from 'body-parser';
import config from './const'
const app = express();

app.use(morgan('dev'))
app.use('/', express.static('./src/client_office'));
app.use('/', express.static('./bower_components'));

app.use('/driver', express.static('./src/client_driver'));
app.use('/driver', express.static('./bower_components'));
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../../../client_office/index.html');
});

app.get('/driver', (req, res) => {
    res.sendFile(__dirname + '../../../client_driver/index.html');
});

app.use('/api', routes);

export default app;