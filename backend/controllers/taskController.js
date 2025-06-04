// taskController.js - Updated for new schema
const db = require('../db'); // Adjust path to your database config
// const pool=require("pg");

const getTasks = async (req, res) => {
  try {
    console.log('Fetching tasks...');
    
    // Get user ID from JWT token (assuming you have auth middleware)
    const userId = req.user?.id;
    
    let query, params;
    
    if (userId) {
      // If user authentication is working, filter by user
      query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
      params = [userId];
    } else {
      // If no user auth, get all tasks (temporary)
      query = 'SELECT * FROM tasks ORDER BY created_at DESC';
      params = [];
    }
    
    const result = await db.query(query, params);
    
    console.log('Tasks fetched:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    console.log('Creating task with data:', { title, description, status, priority });
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Get user ID from JWT token
    const userId = req.user?.id || null;
    
    const result = await db.query(
      'INSERT INTO tasks (title, description, status, priority, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [
        title,
        description || '',
        status || 'To Do',
        priority || 'Medium',
        userId
      ]
    );
    
    console.log('Task created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    // Enhanced debugging
    console.log("Raw req.params:", req.params);
    console.log("Raw req.user:", req.user);
    console.log("Extracted ID:", id, "Type:", typeof id);
    console.log("Extracted User ID:", userId, "Type:", typeof userId);
    
    const { title, description, status, priority } = req.body;
    
    console.log("Request body:", req.body);

    // Validate that we have both required IDs
    if (!id || id === 'undefined') {
      console.error("Task ID is missing or undefined");
      return res.status(400).json({ error: 'Task ID is required and must be valid' });
    }

    if (!userId || userId === 'undefined') {
      console.error("User ID is missing or undefined");
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Convert IDs to integers to ensure proper type
    const taskId = parseInt(id, 10);
    const userIdInt = parseInt(userId, 10);

    // Validate that conversion was successful
    if (isNaN(taskId) || isNaN(userIdInt)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    console.log("Converted IDs - Task ID:", taskId, "User ID:", userIdInt);

    const query = `
      UPDATE tasks
      SET title = $1,
          description = $2,
          status = $3,
          priority = $4,
          updated_at = NOW()
      WHERE id = $5 AND user_id = $6
      RETURNING *;
    `;

    const values = [title, description, status, priority, taskId, userIdInt];
    
    console.log("Query values:", values);

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    console.log("Update successful:", result.rows[0]);
    res.status(200).json({ 
      message: 'Task updated successfully', 
      task: result.rows[0] 
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

     if (!userId || userId === 'undefined') {
      console.error("User ID is missing or undefined");
      return res.status(401).json({ error: 'User authentication required' });
    }

     const taskId = parseInt(id, 10);
    const userIdInt = parseInt(userId, 10);

    // Validate that conversion was successful
    if (isNaN(taskId) || isNaN(userIdInt)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    console.log("Converted IDs - Task ID:", taskId, "User ID:", userIdInt);

    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *;",
      [taskId, userIdInt]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Task deleted successfully", deletedTask: result.rows[0] });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};