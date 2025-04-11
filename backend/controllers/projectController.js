const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newProject = new Project({
            name,
            description,
            createdBy: req.user.userId,
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const role = req.user.role;
        const userId = req.user.userId;

        let projects;
        if (role === 'admin') {
            projects = await Project.find().populate('createdBy', 'name email');
        } else {
            projects = await Project.find({ createdBy: userId });
        }

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
