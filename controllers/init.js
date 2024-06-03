const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
    connectionString: "postgres://root:sBN5JGsps2kIjYayrwBWaOljDNN3j2Bq@dpg-cpf3uq3tg9os73b774a0-a/blog_blei" });
async function Connect() {
    await client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));
}


async function init() {
    const script = fs.readFileSync('./scripts/init.sql', 'utf-8');
    await client.query(script);
    console.log("Tables Created");
};

module.exports = {
    client,
    init,
    Connect
};
