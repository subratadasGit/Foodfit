// Import database connection
import db from "../config/db.js";

// Import bcrypt for password hashing
import bcrypt from "bcrypt";

/*
  User Model
  ----------
  This class contains all database operations related to users.
  Each method interacts with the PostgreSQL database using SQL queries.
*/
class User {

  /*
    Create a new user in the database
    ---------------------------------
    Steps:
    1. Hash the user's password using bcrypt
    2. Insert the user into the users table
    3. Return basic user info (excluding password)
  */
  static async create({ email, password, name }) {

    // Hash the password with salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, hashedPassword, name]
    );

    // Return the newly created user
    return result.rows[0];
  }

  /*
    Find a user by email
    --------------------
    Used during login to locate the user account.
  */
  static async findByEmail(email) {

    const result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    return result.rows[0];
  }

  /*
    Find a user by ID
    -----------------
    Used to fetch profile information.
  */
  static async findById(id) {

    const result = await db.query(
      `SELECT id, email, name, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  /*
    Update user information
    -----------------------
    Allows updating name or email.
    COALESCE ensures fields remain unchanged if NULL is passed.
  */
  static async update(id, updates) {

    const { name, email } = updates;

    const result = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email)
       WHERE id = $3
       RETURNING id, email, name, updated_at`,
      [name, email, id]
    );

    return result.rows[0];
  }

  /*
    Update user password
    --------------------
    Steps:
    1. Hash new password
    2. Store it in password_hash column
  */
  static async updatePassword(id, newPassword) {

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users
       SET password_hash = $1
       WHERE id = $2`,
      [hashedPassword, id]
    );
  }

  /*
    Verify password
    ---------------
    Used during login to compare:
    - user entered password
    - hashed password in database
  */
  static async verifyPassword(plainPassword, hashedPassword) {

    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /*
    Delete user account
    -------------------
    Permanently removes a user from the database.
  */
  static async delete(id) {

    await db.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );
  }
}

// Export the User model
export default User;