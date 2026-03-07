const express = require("express")
var cors = require("cors");
const { courses } = require("./courses");
const { users } = require("./users")
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.static("public"))
const jwt = require("jwt-simple");
const secret = "supersecret";

const PORT = 5000;

// login
app.post("/auth", (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({error: "Missing username or password."});
  }
  const user = users.find(u => u.username == username);

  if(!user || user.password !== password) {
    return res.status(401).json({ error: "Bad username or password."})
  }

  const token = jwt.encode({id: user.id, username: user.username, role: user.role}, secret);
  res.json({
    username2: user.username,
    token: token,
    auth: 1,
    role: user.role
  });
});

// authenticate/login
function authenticate(req, res, next) {
  const token = req.headers["x-auth"];
  if(!token) {
    return res.status(401).json({error: "Missing token"});
  }
  
  try {
    const decoded = jwt.decode(token, secret);
    req.user = decoded;
    next();
  }
  catch(err) {
    res.status(401).json({error: "Invalid token"});
  }
}

// register new user
app.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  if(!username || !password || !role) {
    return res.status(400).json({error: "Missing username, password, or role."});
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z\d]).{10,}$/;

  if(!regex.test(password)) {
    return res.status(400).json({error: "Password must contain at least one lowercase, one uppercase, one number, one special characrer, and be at least 10 characters."})
  }

  const existingUser = users.find(u => u.username == username);
  if (existingUser) {
    return res.status(409).json({error: "Username already taken"});
  }
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    username,
    password,
    role
  };
  users.push(newUser);
  const token = jwt.encode({id: newUser.id, username: newUser.username, role: newUser.role}, secret);

  res.status(201).json({
    username2: newUser.username,
    token,
    auth: 1,
    role: newUser.role
  });
});

// get all courses
app.get("/courses", (req, res) => {
  res.json(courses);
});

// get course by id
app.get("/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found." });
  res.json(course);
})

// post a new course
app.post("/courses", authenticate, (req, res) => {
  if(req.user.role !== "teacher") return res.status(403).json({error: "Only teachers can add courses."});
  const { name, subject, course, description, credits, teacherId } = req.body;

  if(!name || !subject || !course || !description || !credits) {
    return res.status(400).json({ error: "Missing required fields, unable to add course." })
  }

  if(isNaN(credits)) {
    return res.status(400).json({ message: "Credits must be of numeric value."});
  }

  const newCourse = {
    id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
    name: req.body.name,
    subject: req.body.subject,
    course: req.body.course,
    description: req.body.description,
    credits: req.body.credits,
    teacherId: req.user.id
  }

  courses.push(newCourse)
  res.status(201).json(newCourse)
})

// update course
app.put("/courses/:id", authenticate, (req, res) => {

  if(req.user.role !== "teacher") {
    return res.status(403).json({error: "Only teachers can update courses."});
  }

  const existingCourse = courses.find(c => c.id === Number(req.params.id))
  
  if (!existingCourse) {
    return res.status(404).json({ message: "Course not found."});
  }

  if(existingCourse.teacherId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to update this course."});
  }

  const { name, subject, course, description, credits, teacherId } = req.body;

  if(!name || !subject || !course || !description || !credits) {
    return res.status(400).json({ message: "All fields required."});
  }

  if(isNaN(credits)) {
    return res.status(400).json({ message: "Credits must be of numeric value." });
  }

  existingCourse.name = name
  existingCourse.subject = subject
  existingCourse.course = course
  existingCourse.description = description
  existingCourse.credits = credits

  res.json(existingCourse)
});

// delete course
app.delete("/courses/:id", authenticate, (req, res) => {
  if(req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can delete courses."});
  }

  const id = Number(req.params.id);
  const index = courses.findIndex(c => c.id ===id);

  if(index === -1) {
    return res.status(404).json({ message: "Course not found."});
  }
  const course = courses[index];

  if(course.teacherId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to delete this course"})
  }

  courses.splice(index, 1)[0];
  res.json({ message: "Course successfully deleted" })
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});