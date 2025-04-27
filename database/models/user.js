import { db } from "database/db";
import { hashPassword } from "utils/password-utils";

function getAllUsers() {
  try {
    const statement = db.prepare(`SELECT * FROM users`);
    const result = statement.all();
    return { success: true, message: null, data: result };
  } catch (err) {
    return {
      success: false,
      message: `Error fetching users: ${err.message}`,
      data: null,
    };
  }
}

function getUserById(id) {
  try {
    const statement = db.prepare(`SELECT * FROM users WHERE id = ?`);
    const result = statement.get(id);
    return { success: true, message: null, data: result };
  } catch (err) {
    return {
      success: false,
      message: `Error fetching user with ID ${id}: ${err.message}`,
      data: null,
    };
  }
}

function getUserByUsername(username) {
  try {
    const statement = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const result = statement.get(username);
    return { success: true, message: null, data: result };
  } catch (err) {
    return {
      success: false,
      message: `Error fetching user with username ${username}: ${err.message}`,
      data: null,
    };
  }
}

function getUserByEmail(email) {
  try {
    const statement = db.prepare(`SELECT * FROM users WHERE email = ?`);
    const result = statement.get(email);
    return { success: true, message: null, data: result };
  } catch (err) {
    return {
      success: false,
      message: `Error fetching user with email ${email}: ${err.message}`,
      data: null,
    };
  }
}

function createUser(username, email, password, full_name) {
  try {
    const userInDb = db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .get(email);
    if (userInDb) {
      return {
        success: false,
        message: "A user with this email address already exists.",
        data: null,
      };
    }

    const password_hash = hashPassword(password);
    const statement = db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name)
      VALUES (? ? ? ?)`);
    const result = statement.run(username, email, password_hash, full_name);
    return { success: true, message: null, data: result };
  } catch (err) {
    return {
      success: false,
      message: `Error creating new user: ${err.message}`,
      data: null,
    };
  }
}

function updateUser(id, userUpdates) {
  try {
    const userFromDb = getUserById(id).data;
    if (!userFromDb) {
      return {
        success: false,
        message: `Couldn't find user with ID: ${id}`,
        data: null,
      };
    }
    const updateFields = [];
    const updateValues = [];

    if (userUpdates.email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(userUpdates.email);
    }

    if (userUpdates.password !== undefined) {
      updateFields.push("password = ?");
      updateValues.push(userUpdates.password);
    }

    if (userUpdates.full_name !== undefined) {
      updateFields.push("full_name = ?");
      updateValues.push(userUpdates.full_name);
    }

    if (userUpdates.bio !== undefined) {
      updateFields.push("bio = ?");
      updateValues.push(userUpdates.bio);
    }

    if (userUpdates.bio_link !== undefined) {
      updateFields.push("bio_link = ?");
      updateValues.push(userUpdates.bio_link);
    }

    if (userUpdates.profile_picture !== undefined) {
      updateFields.push("profile_picture = ?");
      updateValues.push(userUpdates.profile_picture);
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        message: "No fields to update provided",
        data: null,
      };
    }

    const statement = db.prepare(`
        UPDATE users
        SET ${updateFields.join(", ")}
        WHERE id = ?
        `);

    updateValues.push(id);

    const result = statement.run(...updateValues);

    return getUserById(id);
  } catch (err) {
    return {
      success: false,
      message: `Failed to update user: ${err.message}`,
      data: null,
    };
  }
}

function deleteUser(id) {
  try {
    const statement = db.prepare(`DELETE FROM users WHERE id = ?`);
    const result = statement.run(id);
    return {
      success: true,
      message: `User with ID ${id} successfully deleted`,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to delete user: ${err.message}`,
      data: null,
    };
  }
}

export {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
