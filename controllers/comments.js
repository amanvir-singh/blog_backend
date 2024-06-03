const { client } = require("./init");

async function createComment(content, user_id, post_id) {
    const queryText = 'INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3)';
    try {
        const result = await client.query(queryText, [content, user_id, post_id]);
        return result.rows[0]; // Assuming the insert operation returns the inserted row
    } catch (err) {
        console.error('[data.comments.createComment] Unable to create comment', err.message);
        return undefined;
    }
};

async function getCommentById(id) {
    const queryText = 'SELECT comments.id, comments.content, comments.user_id, comments.post_id, comments.created_at, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rows[0];
    } catch (err) {
        console.error('[data.comments.getCommentById] Unable to fetch comment by ID', err.message);
        return undefined;
    }
};

async function getAllComments() {
    const queryText = 'SELECT * FROM comments';
    try {
        const result = await client.query(queryText);
        return result.rows;
    } catch (err) {
        console.error('[data.comments.getAllComments] Unable to fetch all comments', err.message);
        return [];
    }
};

async function deleteComment(id) {
    const queryText = 'DELETE FROM comments WHERE id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rowCount > 0; // Return true if one or more rows were deleted
    } catch (err) {
        console.error('[data.comments.deleteComment] Unable to delete comment', err.message);
        return false;
    }
};

async function updateContent(content, id) {
    const queryText = 'UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [content, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.comments.updateContent] Unable to update content', err.message);
        return false;
    }
};

async function getCommentByUser(username) {
    const getUserQueryText = 'SELECT id FROM users WHERE username = $1';
    const userId = (await client.query(getUserQueryText, [username])).rows[0].id;
    const getCommentsQueryText = 'SELECT * FROM comments WHERE user_id = $1';
    try {
        const comments = await client.query(getCommentsQueryText, [userId]);
        return comments.rows;
    } catch (err) {
        console.error('[data.comments.getCommentByUser] Unable to fetch comments by user', err.message);
        return [];
    }
};

async function getCommentByPostId(id) {
    const queryText = 'SELECT * FROM comments WHERE post_id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rows;
    } catch (err) {
        console.error('[data.comments.getCommentByPostId] Unable to fetch comments by post ID', err.message);
        return [];
    }
};

module.exports = {
    createComment,
    getCommentById,
    getAllComments,
    deleteComment,
    updateContent,
    getCommentByUser,
    getCommentByPostId
};
