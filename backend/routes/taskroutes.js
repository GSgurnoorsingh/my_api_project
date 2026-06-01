const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');
const { protect } = require('../middleware/auth');

// READ
router.get('/', protect, async (req, res, next) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.findAll({
                include: { model: User, attributes: ['id', 'name', 'email'] }
            });
        } else {
            tasks = await Task.findAll({ where: { userId: req.user.id } });
        }
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
});

// CREATE
router.post('/', protect, async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ message: 'Task requires a valid title parameter' });

        const newTask = await Task.create({
            title,
            description,
            userId: req.user.id
        });
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        next(error);
    }
});

// DELETE
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Resource matching id not found' });

        if (task.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Resource unlinked to client' });
        }

        await task.destroy();
        res.status(200).json({ success: true, message: 'Resource removed successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;