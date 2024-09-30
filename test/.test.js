const request = require('supertest');
const app = require('../server');  
const connectDB = require('../configs/dbConfig');  

let dbClient;
let createdTaskId;  

beforeAll(async () => {
    dbClient = await connectDB();
});

describe('Task Management API', () => {

    // Test to create a new task
    it('should create a new task', async () => {
        const res = await request(app)
            .post('/tasks/create')
            .send({
                title: 'Test Task',
                description: 'This is a test task'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id'); 
        
        createdTaskId = res.body._id;  // Store the created task's ID
    });

    // Test to retrieve all tasks
    it('should retrieve all tasks', async () => {
        const res = await request(app).get('/tasks/get');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('task');
        expect(Array.isArray(res.body.task)).toBe(true);
    });

    // Test to update the created task
    it('should update the created task', async () => {
        const res = await request(app)
            .put(`/tasks/update/${createdTaskId}`)
            .send({
                title: 'Updated Test Task'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task updated successfully');
    });

    // Test to delete the created task
    it('should delete the created task', async () => {
        const res = await request(app).delete(`/tasks/delete/${createdTaskId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task Deleted Sucessfully');
    });

    // Test to handle trying to delete a non-existent task
    it('should return 404 when deleting a non-existent task', async () => {
        const nonExistentTaskId = '507f191e810c19729de860ea';  // Random ObjectId
        const res = await request(app).delete(`/tasks/delete/${nonExistentTaskId}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Task Not Found');
    });
});
