const express = require("express")
var cors = require("cors");
const { courses } = require("./courses");

const app = express()
app.use(cors())
app.use(express.json());

const PORT = 5000;

// get all courses
app.get("/courses", (req, res) => {
  res.json(courses);
});

// get course by id
app.get("/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id));
  if (!course)  return res.status(404).json({ error: "Course not found." });
  res.json(course);
})

// post a new course
app.post("/courses", (req, res) => {
  const newCourse = {
    id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
    name: req.body.name,
    subject: req.body.subject,
    course: req.body.course,
    description: req.body.description,
    credits: req.body.credits,
    teacherId: req.body.teacherId
  }

  if (!newCourse.name || !newCourse.subject || !newCourse.course) {
    return res.status(400).json({ error: "Missing required fields, unable to add course." })
  }
  courses.push(newCourse)
  res.status(201).json(newCourse)
})

// update course
app.put("/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id))
  if (!course) return res.status(404).json({ error: "Course not found" })

    course.name = req.body.name ?? course.name
    course.subject = req.body.subject ?? course.subject
    course.course = req.body.course ?? course.course
    course.description = req.body.description ?? course.description
    course.credits = req.body.credits ?? course.credits
    course.teacherId = req.body.teacherId ?? course.teacherId

    res.json(course)
})

// delete course
app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex(c => c.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: "Course not found." })

  const deleted = courses.splice(index, 1)[0]
  res.json({ message: "Course successfully deleted" })
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});