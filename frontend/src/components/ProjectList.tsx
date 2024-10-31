import React, { useState } from 'react';
import { Project } from './Types';

type ProjectListProps = {
  projects: Project[];
  onUpdate: (updatedProject: Project) => void;
  onDelete: (projectId: string) => void;
};

const ProjectList: React.FC<ProjectListProps> = ({ projects, onUpdate, onDelete }) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState<Project | null>(null);

  const startEditing = (project: Project) => {
    if (project.id) {
      setEditingProjectId(project.id);
      setEditedProject({ ...project });
    }
  };

  const handleUpdate = () => {
    if (editedProject) {
      onUpdate(editedProject);
      setEditingProjectId(null);
      setEditedProject(null);
    }
  };

  return (
    <section className="DisplayProjects">
      <ul id="Projects">
        {projects
          .filter((project) => project && project.id)
          .map((project) => (
            <li key={project.id}>
              {editingProjectId === project.id ? (
                <div>
                  <input
                    type="text"
                    value={editedProject?.title || ''}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject!,
                        title: e.target.value,
                      })
                    }
                    placeholder="Project Title"
                  />
                  <textarea
                    value={editedProject?.description || ''}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject!,
                        description: e.target.value,
                      })
                    }
                    placeholder="Project Description"
                  ></textarea>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingProjectId(null)}>Cancel</button>
                </div>
              ) : (
                <article>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {}
                  <p>Status: {project.publics ? 'Public' : 'Private'}</p>
                  <button onClick={() => startEditing(project)}>Edit</button>
                  <button onClick={() => project.id && onDelete(project.id)}>Delete</button>
                </article>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
};

export default ProjectList;
