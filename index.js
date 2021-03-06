const express = require("express");
const app = express();
const Joi = require('joi');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

/* console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get('env')}`) */

app.use(express.json());
app.use(express.urlencoded()); //key=value&key=value
app.use(express.static('public'));
app.use(logger);
app.use(helmet());

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...')
}

app.use(function(req, res, next) {
  console.log('Authentication...');
  next();
});

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
    name: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema); 
}

const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Start server at port : ${port}.`);
});
