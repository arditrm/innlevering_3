

import React from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import { useProjects } from './hooks /useProjects';
import { Project } from './components/Types';

const Frontprosjket: React.FC = () => {
  const { projects, loading, error, createProject, deleteProject, updateProject } = useProjects();

  const handleFormSubmit = (project: Omit<Project, 'id'> | Project) => {
    if ('id' in project && project.id) {
      updateProject(project as Project);
    } else {
      createProject(project as Omit<Project, 'id'>);
    }
  };

  return (
    <main>
      <header>
        <h1>Prosjektstyring</h1>
      </header>
      <ProjectForm
        onSubmit={handleFormSubmit}
        initialProject={null} 
      />
      <section className="ViewProjectHeader">
        <header>
          <h2>Prosjekter</h2>
        </header>
      </section>
      {loading && <p>Laster inn prosjekter...</p>}
      {error && <p>Feil: {error}</p>}
      <ProjectList
        projects={projects}
        onUpdate={(updatedProject) => updateProject(updatedProject)}
        onDelete={deleteProject}
      />
    </main>
  );
};

export default Frontprosjket;
