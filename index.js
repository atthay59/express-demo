const express = require("express");
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
  { id : 1, name : 'courses 1'},
  { id : 2, name : 'courses 2'},
  { id : 3, name : 'courses 3'}
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);;

  const course = {
    id : courses.length + 1,
    name : req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.')
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.')

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send('The course with the given ID was not found.')

  // Delete 
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(courses);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(2).required()
  };

  return Joi.validate(course, schema); 
}

const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Start server at port : ${port}.`);
});
