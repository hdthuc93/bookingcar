import app from './configs/server_config';
import connection from './configs/connection';

let server = app.listen(connection.port, () => {
    console.log(`Server is running on port: ${connection.port}`);
});