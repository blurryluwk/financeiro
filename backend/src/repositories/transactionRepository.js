const db = require('../../config/db'); 

const findAll = async () => {
    const result = await db.query('SELECT * FROM transactions ORDER BY date DESC');
    return result.rows;
};

const create = async (transaction) => {
    const { amount, description, type, category } = transaction;
    const result = await db.query(
        'INSERT INTO transactions (amount, description, type, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [amount, description, type, category]
    );
    return result.rows[0];
};

const remove = async (id) => {
    await db.query('DELETE FROM transactions WHERE id = $1', [id]);
}

module.exports = { findAll, create, remove };
