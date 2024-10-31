import { useState, useEffect } from "react";
import { API_URL } from "../config/urls";
import { Project } from "../components/Types";
import { projectSchema } from "../validering/validering"; 


interface ApiProject {
  id?: string;
  Id?: string;
  _id?: string;
  title?: string;
  Title?: string;
  description?: string;
  Description?: string;
}

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  updateProject: (updatedProject: Project) => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

 
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL.getProjects);
      if (!response.ok) throw new Error("Failed to fetch projects.");
      const data: ApiProject[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Data is not an array.");
      }

   
      const validProjects: Project[] = data
        .map((project) => ({
          id: project.id || project['Id'] || project['_id'] || Math.floor(Math.random() * 1000000).toString(),
          title: project.title || project.Title || "Untitled Project",
          description: project.description || project.Description || "No description",
        }))
        .filter((project) => {
          const result = projectSchema.safeParse(project);
          return result.success;
        });

      setProjects(validProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };


  const createProject = async (project: Omit<Project, 'id'>) => {

    const validation = projectSchema.safeParse(project);
    console.log("Validation result for create:", validation);
    if (!validation.success) {
      setError("Invalid project data");
      return;
    }

    try {
      const response = await fetch(API_URL.createProject, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      if (!response.ok) throw new Error("Failed to create project.");

      await fetchProjects(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  
  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(API_URL.deleteProject(projectId), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project.");
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };


  const updateProject = async (updatedProject: Project) => {
    if (!updatedProject.id) {
      setError("Project ID is required for update.");
      return;
    }

  
    const validation = projectSchema.safeParse(updatedProject);
    console.log("Validation result for update:", validation); 
    if (!validation.success) {
      setError("Invalid project data");
      return;
    }

    try {
      const response = await fetch(API_URL.updateProject(updatedProject.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      if (!response.ok) throw new Error("Failed to update project.");

      await fetchProjects(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, fetchProjects, createProject, deleteProject, updateProject };
}
