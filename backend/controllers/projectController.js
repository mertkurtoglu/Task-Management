const Project = require('../models/Project');

// Create a new project
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

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    const { projectId } = req.params;
    const updates = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(projectId, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(updatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
