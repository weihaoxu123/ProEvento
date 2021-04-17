const app=require("./app")
const supertest=require("supertest")
test('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

test("Post /login with incorrect combination", async (done) => {  
    const data={userName:"123",password:"456"}
    await supertest(app).post("/login")
        .send(data)
        .expect(200)
        .then((response) => {
            expect(response.body.code).toBe(1)
        });
        done()
    });
var token
test("Post /login with correct combination", async (done) => {  
    const data={userName:"jennie",password:"123"}
    await supertest(app).post("/login")
        .send(data)
        .expect(200)
        .then((response) => {
            token=response.headers['set-cookie']
            expect(response.body.code).toBe(200)
        });
        done()
    });
//web page authentication
test("get index page authenticated", async (done)=>{
    await supertest(app).get("/")
    .set("cookie",token)
    .then((res)=>{
        expect(res.status).toBe(200)
    })
    done()
})

test("get index page unauthenticated", async (done)=>{
    await supertest(app).get("/")
    .then((res)=>{
        expect(res.status).toBe(302)
    })
    done()
})

test("get login page unauthenticated", async (done)=>{
    await supertest(app).get("/login")
    .then((res)=>{
        expect(res.status).toBe(200)
    })
    done()
})

test("get login page authenticated", async (done)=>{
    await supertest(app).get("/login")
    .set("cookie",token)
    .then((res)=>{
        expect(res.status).toBe(302)
    })
    done()
})
// registration functionality
// test("Post /register with user that doesn't exist", async () => {  
//     const data={userName:"123",password:"123"}
//     await supertest(app).post("/register")
//         .send(data)
//         .then((response) => {
//             expect(response.body.code).toBe(200)
//         });
//     });

test("Post /register with user that exists", async (done) => {  
    const data={userName:"123",password:"123"}
    await supertest(app).post("/register")
        .send(data)
        .then((response) => {
            expect(response.body.code).toBe(1)
        });
    done()
    });

//start event functionality
test("Post /event/started unauthenticated", async (done) => {  
    const data={event_id:1}
    await supertest(app).post("/event/started")
        .send(data)
        .then((response) => {
            expect(response.body.message).toBe("not log in")
        });
    done()
    });

test("Post /event/started authenticated but wrong user", async (done) => {  
    const data={event_id:1}
    await supertest(app).post("/event/started")
        .set("cookie",token)
        .send(data)
        .then((response) => {
            expect(response.body.message).toBe("you don't own this event")
        });
    done()
    });
var new_token;
test("Post /event/started authenticated and right user", async (done) => { 
    const data={userName:"jack",password:"123"}
    await supertest(app).post("/login")
        .send(data)
        .expect(200)
        .then((response) => {
            new_token=response.headers['set-cookie']
        }); 
    const event_data={event_id:1}
    await supertest(app).post("/event/started")
        .set("cookie",new_token)
        .send(event_data)
        .then((response) => {
            expect(response.body.message).toBe("success")
        });
        done()
    });
    
