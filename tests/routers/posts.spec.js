const request = require("supertest");
const app = require("../../app");
const utils = require('../utils');


describe("Posts Routes", () => {

    describe("GET /posts/all", () => {
        const mockusers = [
            "Michael123","Michael@gmail.com","Password123"];
    const mockPosts =[
      "First Post", "Hi, This is my first post", 1];
    beforeEach(async () => {
      await utils.initializeDB();
        //await utils.disableForeignKey();
        await utils.addToDB(
            'users', 
            ['username', 'email', 'password'], 
            mockusers
        );
      await utils.addToDB(
          'posts', 
          ['title', 'content', 'user_id'], 
          mockPosts
      );
    });

    test("should return all posts added", async () => {  
        const response = await request(app).get("/posts/all");
        rep = await utils.getRecordFromDB('posts','user_id',1)
      console.log('Data->>>>',rep)
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({posts: mockPosts});
    });
  });

  

});