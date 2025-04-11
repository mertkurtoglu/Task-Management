const Task = require('../models/Task');

exports.getTasksByProject = async (req, res) => {
    const projectId = req.params.projectId;

    try {
        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTask = async (req, res) => {
    const projectId = req.params.projectId;
    const { title, description, status, priority, assignedTo } = req.body;

    try {
        const task = new Task({
            title,
            description,
            status,
            priority,
            assignedTo,
            project: projectId
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const updates = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    const taskId = req.params.taskId;

    try {
        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
