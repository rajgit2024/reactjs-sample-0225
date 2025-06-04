const express=require("express");
const router=express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const {jwtAuthMiddleware}=require("../middleware/authMiddleware")


router.get("/",jwtAuthMiddleware, getTasks);
router.post("/add",jwtAuthMiddleware, createTask);
router.put("/update/:id",jwtAuthMiddleware, updateTask);
router.delete("/delete/:id",jwtAuthMiddleware, deleteTask);

module.exports = router;