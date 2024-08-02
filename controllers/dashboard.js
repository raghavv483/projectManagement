// controllers/dashboardController.js
const Project = require('../models/project');
const User = require('../models/user');
const {uploadOnCloudinary} = require("../utils/cloudinary.js");
const path=require("path");
const mongoose=require("mongoose"); 
const multer = require('multer');  
const upload = multer({ dest: 'uploads/' }); // Specify upload destination

const ApiError=require("../utils/apiError");

// Add Project
// Add Project

const addProject = async (req, res) => {
    //console.log("erorr0000")
    const { Project_name, Github_url, Live_hosted_link, TechStack_used } = req.body;
    if(!Project_name||!Github_url){
        res.status(404);
        throw new Error("Something went wrong");
    }
   // console.log(req.body);

console.log("file: ",req.files);
const thumbnailLocalpath = req.files?.thumbnail[0]?.path
// console.log("thumbnailLocalpath", thumbnail  Localpath);

if (!thumbnailLocalpath) throw new ApiError(400, "thumbnail file is required")
console.log("error60")
const thumbnail= await uploadOnCloudinary(thumbnailLocalpath).catch((error) => console.log(error))
//console.log("error 70");
if (!thumbnail) throw new ApiError(400, "thumbnail file is required!!!.")

    const project = new Project({
        Project_name,
        Github_url,
        thumbnail:thumbnail.url,
        Live_hosted_link,
        TechStack_used,
        userId: req.body.id,
    });

    
    try {
        const savedProject = await project.save();
        res.json({savedProject,success:true});
        res.json({savedProject,success:true});
    } catch (err) {
        res.status(400).send(err);
    }
};

// View Projects
// View Projects
const viewProjects = async (req, res) => {
    const{userId}=req.query ////
    try {
        const projects = await User.find({ userId });
        res.send(projects.userProject);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Edit Project
// Edit Project
const editProject = async (req, res) => {
    const { Project_name, github_url, thumbnail, Live_hosted_link, TechStack_used } = req.body;
    const {projectId}=req.params; ////
    if(!projectId){
        res.status(404);
        throw new Error("Something went wrong");
    }
    if(!Project_name||!github_url){
        res.status(404);
        throw new Error("Something went wrong");
    }
    try {
        const updatedProject = await Project.findOneAndUpdate(
            { projectId},
            { Project_name, github_url, thumbnail, Live_hosted_link, TechStack_used },
            { new: true }
        );
        res.send(updatedProject);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete Project
// Delete Project
const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    if(!projectId){
        res.status(404);
        throw new Error("Something went wrong");
    }
    try {
        const removedProject = await Project.findOneAndDelete({ projectId, userId: req.user._id });
        res.send(removedProject);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Admin: View All Users and Projects
const viewAllUsersAndProjects = async (req, res) => {
    try {
        const users = await User.find();
        const projects = await Project.find().populate('userId');
        res.send({ users, projects });
    } catch (err) {
        res.status(400).send(err);
    }
};

// Admin: Edit Any Project
const adminEditProject = async (req, res) => {
    const { projectId, projectName, githubLink, thumbnail, liveLink, techStack } = req.body;
    try {
        const updatedProject = await Project.findOneAndUpdate(
            { _id: projectId },
            { projectName, githubLink, thumbnail, liveLink, techStack },
            { new: true }
        );
        res.send(updatedProject);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Admin: Delete Any Project
const adminDeleteProject = async (req, res) => {
    const { projectId } = req.body;
    try {
        const removedProject = await Project.findOneAndDelete({ _id: projectId });
        res.send(removedProject);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Admin: Manage Users
const manageUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports={addProject,manageUsers,adminEditProject,viewAllUsersAndProjects,deleteProject,editProject,viewProjects}



 

