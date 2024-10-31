import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db/db";
import { serveStatic } from "@hono/node-server/serve-static";
import { v4 as uuidv4 } from "uuid";
import createProjectsTable from './db/tables';

const app = new Hono();

createProjectsTable();

app.use("/*", cors());

app.get("/statics/*", serveStatic({ root: "./dist" }));


interface Project {
  id: string;
  title: string;
  description: string;
  publics: number; 
}


app.get("/json", async (c) => {
  try {
    const stmt = db.prepare("SELECT id, title, description, publics FROM projects");
    const projects = stmt.all() as Project[]; 
    const formattedProjects = projects.map((project) => ({
      ...project,
      publics: project.publics === 1, 
    }));
    return c.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ message: "Error fetching projects", error }, 500);
  }
});


app.post("/json", async (c) => {
  try {
    const newProject = await c.req.json();
    const { title, description, publics } = newProject;

    if (!title || !description) {
      return c.json({ message: "Title and description are required" }, 400);
    }

    const id = uuidv4();

    const stmt = db.prepare("INSERT INTO projects (id, title, description, publics) VALUES (?, ?, ?, ?)");
    stmt.run(id, title, description, publics ? 1 : 0); 

    const insertedProject = { id, title, description, publics: !!publics };

    return c.json({ message: "Project added successfully!", project: insertedProject }, 201);
  } catch (error) {
    console.error("Error adding project:", error);
    return c.json({ message: "Error adding project", error }, 500);
  }
});


app.put("/json/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    const updatedProject = await c.req.json();
    const { title, description, publics } = updatedProject;

    if (!title || !description) {
      return c.json({ message: "Title and description are required" }, 400);
    }

    const selectStmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const existingProject = selectStmt.get(projectId) as Project | undefined;

    if (!existingProject) {
      return c.json({ message: "Project not found" }, 404);
    }

    const updateStmt = db.prepare("UPDATE projects SET title = ?, description = ?, publics = ? WHERE id = ?");
    updateStmt.run(title, description, publics ? 1 : 0, projectId);

    const updatedProjectData = { id: projectId, title, description, publics: !!publics };

    return c.json({
      message: "Project updated successfully!",
      project: updatedProjectData,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ message: "Error updating project", error }, 500);
  }
});


app.delete("/json/:id", async (c) => {
  try {
    const projectId = c.req.param("id");

    const selectStmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const existingProject = selectStmt.get(projectId) as Project | undefined;

    if (!existingProject) {
      return c.json({ message: "Project not found" }, 404);
    }

    const deleteStmt = db.prepare("DELETE FROM projects WHERE id = ?");
    deleteStmt.run(projectId);

    const remainingProjects = db.prepare("SELECT id, title, description, publics FROM projects").all() as Project[];
    const formattedProjects = remainingProjects.map((project) => ({
      ...project,
      publics: project.publics === 1, 
    }));

    return c.json({
      message: "Project deleted successfully!",
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ message: "Error deleting project", error }, 500);
  }
});

const port = 2121;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
