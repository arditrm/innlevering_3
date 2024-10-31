

export const API_URL = {
    getProjects: 'http://localhost:1234/json',
    createProject: 'http://localhost:1234/json',
    updateProject: (id: string) => `http://localhost:1234/json/${id}`,
    deleteProject: (id: string) => `http://localhost:1234/json/${id}`,
  };
  

  