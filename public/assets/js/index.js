//const moment = require("moment");

//Modal Functions
$("#addTaskBtn").on("click", function () {

    $("#taskModal").css("display", "none");

    $(document).ready(function () {
        $("#taskModal").modal("hide");

        // Stops modal from closing when clicked outside
        $("#taskModal").modal({
            backdrop: 'static',
            keyboard: false
        });

    })
})

$("#addTimeBtn").on("click", function () {

    $("#timeModal").css("display", "none");

    $(document).ready(function () {
        $("#timeModal").modal("hide");

        // Stops modal from closing when clicked outside
        $("#timeModal").modal({
            backdrop: 'static',
            keyboard: false
        });

    })
})

$("#addMemberBtn").on("click", function () {

    $("#memberModal").css("display", "none");

    $(document).ready(function () {
        $("#memberModal").modal("hide");

        // Stops modal from closing when clicked outside
        $("#memberModal").modal({
            backdrop: 'static',
            keyboard: false
        });

    })
})

//Get Projects
$(document).ready(function () {

    const projectList = $("#projectList")
    var projectInfo = [];

    $(document).on("click", "#projectDelete", handleProjectDelete)
    $(document).on("click", "#projectEdit", handleProjectEdit)
    $(document).on("click", "#projectTitle", projectDetails)

    let url = window.location.search;
    let projectId;
    if (url.indexOf("?project_id=") !== -1) {
        projectId = url.split("=")[1];
        getProject(projectId);
    }
    else {
        getProject();
    }

    function getProject(id) {
        projectId = id || "";

        if (projectId) {
            projectId = "/?project_id=" + projectId
        }
        $.get("/api/Project" + projectId, function (data) {

            if (!data || !data.length) {
                displayEmpty();
            }
            else {
                projectList.empty();
                projectInfo = [];
                const projectsToAdd = [];
                for (let i = 0; i < data.length; i++) {
                    projectsToAdd.push(createRow(data[i]));
                    projectInfo.push(data[i]);
                }

                projectList.append(projectsToAdd)

            }
        })
    }


    function deleteProject(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/Project/" + id
        }).then(function () {
            getProject();
        })
    }

    function createRow(project) {

        let projectCard = projectList.append(
            `<div class="card" id="${project.title}"><div class="card-header">
            <h3 id="projectTitle"><a href="#">${project.title}</a></h3>
            <button class="edit btn btn-info" id="projectEdit"><i class="fas fa-edit edit-project"></i></button>
            <button class="delete btn btn-danger" id="projectDelete"><i class="fas fa-trash delete-project"></i></button>
            </div>
            </div>`

        )
        projectCard.data("project", project)

        return projectCard;

    }

    function displayEmpty() {

        projectList.empty();

        projectList.append(`<p>You have no projects to display</p>`)

    }

    function handleProjectEdit() {

        let currentProject = $(this)
            .parent()
            .parent()
            .parent()
            .data("project")
        console.log(currentProject)
        window.location.href = "/add?project_id=" + currentProject.projectId;
    }

    function handleProjectDelete() {
        let answer = window.confirm("Are you sure you would like to delete this project?")

        if (answer) {
            let currentProject = $(this)
                .parent().parent().parent().data("project")
            console.log(currentProject)
            deleteProject(currentProject.projectId)
        }
        else { return; }
    }

    function projectDetails() {
        $(".current-project-details").empty()
        $("#task-section").empty()
        var selectedProject = event.target.innerHTML;
        for (var i = 0; i < projectInfo.length; i++) {
            if (projectInfo[i].title == selectedProject) {
                selectedProject = projectInfo[i].projectId;
                selectedProject = selectedProject - 1;
            }
        }

        let currentProject = projectInfo[selectedProject];
        let team = currentProject.team;
        team = JSON.parse(team)

        $(".current-project-details").append(`
            <h3 class="selected-project">${currentProject.title}</h3>
            <p class="project-status"><strong>Status: </strong><span class="current-project-status">${currentProject.status}</span></p>
            <p class="project-assignees"><strong>Assignees: </strong><span class="current-project-assignees"></span></p>
            <p class="project-budget"><strong>Budget (in hours): </strong><span class="current-project-budget">${currentProject.budget}</span></p>
            <p><strong>Description:</strong></p>
            <p class="current-project-desc"> ${currentProject.description}</p>
            <small>Created on: ${currentProject.createdAt}</small>
            <small>Last updated: ${currentProject.updatedAt}</small>
        `)

        team.forEach(member => {
            $(".current-project-assignees").append(member + ", ")
        });

        $("#task-section").append(`
        <h2 class="col-md-10">Task</h2><button class="add-task" id="addTaskBtn" style= "float : right;"data-toggle="modal" data-target="#taskModal"><i class="fas fa-plus"></i> Add Task</button>`)

        getTasks(currentProject.projectId);
    }
    var tasks;
    var name;

    function getTasks(id) {
        $("#task-display").empty();

        $.when(
            $.get("/api/Task", function (data) {
                tasks = data;
            })
        ).done(function () {
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].projectId == id) {
                    $("#task-display").append(`
                    <div class = "col-md-3"><div class = "card" id ="taskCard">
                <div class = "card-header" id = "task-header"><h5 style="color:white;">${tasks[i].taskName}</h5></div><br>
                <strong>Assigned to: ${tasks[i].User.firstname} ${tasks[i].User.lastname}</strong>
                <details><p>${tasks[i].taskDescription}</p>
                <p>Created on: ${tasks[i].createdAt}</p>
                </div></div></details> <br>          
        
                    `)
                }
            }
        })
    }


    getProject();
});


