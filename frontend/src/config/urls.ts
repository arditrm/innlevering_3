

export const API_URL = {
    getProjects: 'http://localhost:2121/json',
    createProject: 'http://localhost:2121/json',
    updateProject: (id: string) => `http://localhost:2121/json/${id}`,
    deleteProject: (id: string) => `http://localhost:2121/json/${id}`,
  };
  

  