
import db from './db';

const createProjectsTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `).run();
};

export default createProjectsTable;
