import { pool } from "../db/connection.js";

const isExistsByField = async (field, value) => {
  const allowedFields = ["email", "username"];

  if (!allowedFields.includes(field)) {
    throw new Error("Invalid search field");
  }

  const query = `
    SELECT 1
    FROM users
    WHERE ${field} = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [value]);
  return result.rowCount > 0;
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT id, username, email, hashed_password
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};
const findUserById = async (userId) => {
  const query = `
    SELECT id, username, email,role
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

const createUser = async (username, email, hashedpassword) => {
  const query = `
      INSERT INTO users (username, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;

  const values = [username, email, hashedpassword];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const authRepositories = {
  isExistsByField,
  findUserByEmail,
  createUser,
  findUserById,
};

export default authRepositories;
