import client from '@/lib/mongodb';

export const usersCollection = client.db("opensourcefinder").collection("users");
export const projectsCollection = client.db("opensourcefinder").collection("projects");