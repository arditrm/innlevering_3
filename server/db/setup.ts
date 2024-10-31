

import createProjectsTable from './tables';

const setupDatabase = () => {
  createProjectsTable();
  console.log("Database setup complete.");
};

setupDatabase();
