const { client } = require("./init");

const mockPosts = [
    {
      title: "First Post",
      content: "Hi, This is my first post",
      img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 4
    },
    {
      title: "Second Post",
      content: "Hi, This is my second post by other user",
      img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 7
    },
    {
      title: "Tips to improve health",
      content: "Follow the given steps to improve health",
      img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 3
    },
    {
      title: "Travel Diaries",
      content: "Exploring the beautiful landscapes of New Zealand",
      img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 2
    },
    {
      title: "Cooking Adventures",
      content: "Trying out a new recipe for a delicious pasta dish",
      img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 5
    },
    {
      title: "Book Review",
      content: "My thoughts on the latest bestselling novel",
      img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 1
    }
  ];

async function createUser(username, email, password, img) {
    const queryText = 'INSERT INTO users (username, email, password, img) VALUES ($1, $2, $3, $4)';
    try {
        const result = await client.query(queryText, [username, email, password, img]);
        return result.rows[0]; // Assuming the insert operation returns the inserted row
    } catch (err) {
        console.error('[data.users.createUser] Unable to create user', err.message);
        return undefined;
    }
}

async function getUserById(id) {
    const queryText = 'SELECT * FROM users WHERE id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rows[0];
    } catch (err) {
        console.error('[data.users.getUserById] Unable to fetch user by ID', err.message);
        return undefined;
    }
}

async function getAllUsers() {
    const queryText = 'SELECT * FROM users';
    try {
        const result = await client.query(queryText);
        return result.rows;
    } catch (err) {
        console.error('[data.users.getAllUsers] Unable to fetch all users', err.message);
        return [];
    }
}

async function deleteUser(id) {
    const queryText = 'DELETE FROM users WHERE id = $1';
    try {
        const result = await client.query(queryText, [id]);
        return result.rowCount > 0; // Return true if one or more rows were deleted
    } catch (err) {
        console.error('[data.users.deleteUser] Unable to delete user', err.message);
        return false;
    }
}

async function updateUsername(username, id) {
    const queryText = 'UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [username, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.users.updateUsername] Unable to update username', err.message);
        return false;
    }
}

async function updateEmail(email, id) {
    const queryText = 'UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [email, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.users.updateEmail] Unable to update user email', err.message);
        return false;
    }
}

async function updatePassword(password, id) {
    const queryText = 'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    try {
        const result = await client.query(queryText, [password, id]);
        return result.rowCount > 0; // Return true if one or more rows were updated
    } catch (err) {
        console.error('[data.users.updatePassword] Unable to update user password', err.message);
        return false;
    }
}

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    deleteUser,
    updateUsername,
    updateEmail,
    updatePassword
};
