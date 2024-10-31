// src/components/ProjectForm.tsx

import React, { useState, useEffect } from 'react';
import { Project } from './Types';

type ProjectFormProps = {
  onSubmit: (project: Project) => void;
  initialProject?: Project | null;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialProject }) => {
  const [projectName, setProjectName] = useState<string>(initialProject?.title || '');
  const [projectDescription, setProjectDescription] = useState<string>(initialProject?.description || '');

  useEffect(() => {
    if (initialProject) {
      setProjectName(initialProject.title);
      setProjectDescription(initialProject.description);
    } else {
      setProjectName('');
      setProjectDescription('');
    }
  }, [initialProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (projectName.trim() === '' || projectDescription.trim() === '') {
      alert('Title and Description cannot be empty.');
      return;
    }

    const newProject: Project = initialProject
      ? {
          id: initialProject.id,
          title: projectName,
          description: projectDescription,
        }
      : {
          title: projectName,
          description: projectDescription,
        };

    onSubmit(newProject);

    if (!initialProject) {
      setProjectName('');
      setProjectDescription('');
    }
  };

  return (
    <section className="CreateProject">
      <form id="projectForm" onSubmit={handleSubmit}>
        <label htmlFor="PName">Project Title</label><br />
        <input
          type="text"
          id="PName"
          name="PName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        /><br />

        <label htmlFor="Description">Project Description</label><br />
        <textarea
          name="Description"
          id="Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
        ></textarea><br />

        <input type="submit" value={initialProject ? "Save Changes" : "Create Project"} /><br />
      </form>
    </section>
  );
};

export default ProjectForm;
