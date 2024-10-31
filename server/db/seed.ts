

import db from './db';
import { v4 as uuidv4 } from 'uuid';

const seedData = () => {
  const projects = [
    { id: uuidv4(), title: "Sample Project 1", description: "Description for project 1" },
    { id: uuidv4(), title: "Sample Project 2", description: "Description for project 2" },
  ];

  const insertStmt = db.prepare("INSERT INTO projects (id, title, description) VALUES (?, ?, ?)");

  db.transaction(() => {
    projects.forEach(project => insertStmt.run(project.id, project.title, project.description));
  })();

  console.log("Database seeded with sample projects.");
};

seedData();
