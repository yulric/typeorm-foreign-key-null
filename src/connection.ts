import { createConnection, Connection } from 'typeorm';
import * as path from 'path';

let connection: Connection | null = null;

/**
 * Returns the established connection to the db. Should be called after setupConnection is called.
 * 
 * @export
 * @returns {Connection}
 */
export function getConnection(): Connection {
    if (connection === null) {
        throw new Error(
            `db connection not setup. Please call setupConnection first`
        );
    }

    return connection;
}

/**
 * Sets up the connection the db. Should be called as early as possible in the app.
 * 
 * @export
 * @returns {Promise<void>}
 */
export async function setupConnection(): Promise<void> {
    connection = await createConnection({
        driver: {
            type: 'postgres',
            port: 5432,
            host: 'localhost',
            username: 'postgres',
            password: 'Untitled01*',
            database: 'test'
        },
        entities: [
            path.join(__dirname, './entities/**/*.js')
        ],
        //TODO Do this only in dev and remove in production. Db setup should be done using a script
        autoSchemaSync: true
    });
}