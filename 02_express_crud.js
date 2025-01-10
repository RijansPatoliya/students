const express = require("express");
const{ MongoClient } = require("mongodb");

const app = express();
const port = 3000;

//Mongodb connection details
const url = "mongodb://127.0.0.1:27017/";
const dbName = "codinggita";

//Middleware
app.use(express.json());
let db,courses;

// Connect to MongoDB and initialize collections
async function initializeDatabase(){
    try{
        const client = await MongoClient.connect(url,{useUnifiedTopology: true});
        console.log("connected to mongoDB");
        
        db = client.db(dbName);
        courses = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
        }catch (err) {
            console.error("Error connecting to MongoDB:", err);
            process.exit(1); // Exit if database connection fails
        }
}

// Initialize Database
initializeDatabase();

//GET :  list all courses
app.get('/courses',async(req,res)=>{
    try{
        const allCourses = await courses.find().toArray();
        res.status(200).json(allCourses);
    }catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

//POST : Add a new courses
app.post("/courses",async(req,res)=>{
    try {
        // console.log("request Object : ", req)
        // console.log("request Body : ", req.body)
        const newStudent = req.body;
        const result = await courses.insertOne(newStudent);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

//PUT : Update a course completly
app.put("./courses/:courseCode",async(req,res)=>{
    try{
        // console.log("request Params : ",req.params)
        // console.log("request Body : ",req.body)
        const courseCode = (req.params.courseCode);
        const updateCourse = req.body;
        const result = await courses.replaceOne({courseCode},updateCourse);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating student: " + err.message);
    }
});

// PATCH: Partially update a student
app.patch("/courses/:courseCode",async(req,res) => {
    try{
        const courseCode = (req.params.courseCode);
        const updates = req.body;
        const result = await courses.updateOne({courseCode},{$set : updates});
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a courses with courseCode
app.delete('/students/:courseCode', async (req, res) => {
    try {
        const courseCode = parseInt(req.params.courseCode);
        const result = await courses.deleteOne({courseCode });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});