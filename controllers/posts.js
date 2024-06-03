const { client } = require("./init");

async function disableForeignKey() {
    // Disabling Foreign Key for testing
    await client.connect(); // Ensure connection is open
    const disableForeignKeysQuery = 'SET session_replication_role = replica;';
    await client.query(disableForeignKeysQuery);
    await client.end(); // Close the connection after disabling foreign keys
};

async function addToDB(table, fields, records) {
    await disableForeignKey();
    const valuesPlaceholder = fields.map(() => '$1').join(', ');
    const queryText = `INSERT INTO ${table}(${fields.join(', ')}) VALUES (${valuesPlaceholder})`;
    const query = client.query(queryText, records.flatMap(record => Object.values(record)));
    await query;
};

async function createPost(title, content, img, user_id) {
    const queryText = 'INSERT INTO posts (title, content, img, user_id) VALUES ($1, $2, $3, $4)';
    try {
        const result = await client.query(queryText, [title, content, img, user_id]);
        return result.rows[0]; // Assuming the insert operation returns the inserted row
    } catch (err) {
        console.error('[data.posts.createPost] Unable to create post', err.message);
        return undefined;
    }
}

async function getPostById(id) {
    const queryText = 'SELECT posts.id, posts.title, posts.content, posts.created_at, posts.img, posts.user_id, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rows[0];
    } catch (err) {
        console.error('[data.posts.getPostById] Unable to fetch post by ID', err.message);
        return undefined;
    }
}

async function getAllPosts() {
    const queryText = 'SELECT * FROM posts';
    try {
        const result = await client.query(queryText);
        return result.rows;
    } catch (err) {
        console.error('[data.posts.getAllPosts] Unable to fetch all posts', err.message);
        return [];
    }
}

async function deletePost(id) {
    const queryText = 'DELETE FROM posts WHERE id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rowCount > 0; // Return true if one or more rows were deleted
    } catch (err) {
        console.error('[data.posts.deletePost] Unable to delete post', err.message);
        return false;
    }
}

async function updateTitle(title, id) {
    const queryText = 'UPDATE posts SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [title, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.posts.updateTitle] Unable to update title', err.message);
        return false;
    }
}

async function updateContent(content, id) {
    const queryText = 'UPDATE posts SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [content, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.posts.updateContent] Unable to update content', err.message);
        return false;
    }
}

async function updateImg(img, id) {
    const queryText = 'UPDATE posts SET img = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [img, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.posts.updateImg] Unable to update img', err.message);
        return false;
    }
}

async function getPostByUser(username) {
    const getUserIdQueryText = 'SELECT id FROM users WHERE username = $1';
    const userId = (await client.query(getUserIdQueryText, [username])).rows[0].id;
    const getPostsQueryText = 'SELECT * FROM posts WHERE user_id = $1';
    try {
        const posts = await client.query(getPostsQueryText, [userId]);
        return posts.rows;
    } catch (err) {
        console.error('[data.posts.getPostByUser] Unable to fetch posts by user', err.message);
        return [];
    }
};

module.exports = {
    createPost,
    getPostById,
    getAllPosts,
    deletePost,
    updateTitle,
    updateContent,
    getPostByUser,
    updateImg
};
