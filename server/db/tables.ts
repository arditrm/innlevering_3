
import db from './db';

const createProjectsTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      publics INTEGER NOT NULL DEFAULT 1
    )
  `).run();
};

export default createProjectsTable;
