const { client, init } = require('../controllers/init'); 

async function initializeDB() {
    await init(); // Connect to the database
};

async function getRecordFromDB(table, field, value) {
    const queryText = `SELECT * FROM ${table} WHERE ${field} = $1`;
    try {
        const result = await client.query(queryText, [value]);
        return result.rows.length > 0? result.rows[0] : null;
    } catch (err) {
        console.error('[data.utils.getRecordFromDB] Unable to fetch record', err.message);
        return null;
    }
};

async function disableForeignKey() {
    // Note: PostgreSQL does not have a direct equivalent to SQLite's PRAGMA foreign_keys = OFF;
    // However, you can achieve a similar effect by setting session_replication_role to replica during testing.
    // This prevents writes to the database but allows reads.
    await client.query("ALTER USER root SET session_replication_role TO 'replica';")
    await client.query('SET session_replication_role = replica;');
};

async function addToDB(table, fields, records) {
    const valuesPlaceholder = records.map((_, index) => `$${index + 1}`).join(', ');
    console.log(`${fields.join(', ')}`)
    console.log(valuesPlaceholder)
    console.log(records)
    const queryText = `INSERT INTO ${table}(${fields.join(', ')}) VALUES (${valuesPlaceholder})`;
    try {
        await client.query(queryText, records);
    } catch (err) {
        console.error('[data.utils.addToDB] Unable to add records', err.message);
    }
};

module.exports = {
    initializeDB,
    addToDB,
    getRecordFromDB,
    disableForeignKey
};
