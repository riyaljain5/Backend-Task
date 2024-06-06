var express = require('express');
var router = express.Router();



let tasks =[];
let currentId = 1;

router.get('/tasks', function(req, res, next) {
  res.json(tasks);
});


router.get('/tasks', function(req, res, next) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sortBy = req.query.sortBy || 'id';
  const order = req.query.order === 'desc' ? -1 : 1;
  const filter = req.query.filter || {};

  // Filtering
  let filteredTasks = tasks.filter(task => {
    let isMatch = true;
    for (let key in filter) {
      if (task[key] && task[key] !== filter[key]) {
        isMatch = false;
      }
    }
    return isMatch;
  });

  // Sorting
  filteredTasks.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return -1 * order;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1 * order;
    }
    return 0;
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    totalTasks: filteredTasks.length,
    tasks: paginatedTasks,
  });
});

router.get('/tasks/:id', function(req,res,next){
      const id = Number(req.params.id);
      const task = tasks.find((task)=> task.id ===id );

      if (task){
        res.status(200).json(task);
      }
      else{
        res.sendStatus(404);
      }
  
})

router.post('/tasks', function(req,res,next){
  const task = {
      id: currentId++,
      title: req.body.title,
      description: req.body.description,
      completed: false
  };
  tasks.push(task);
  res.status(201).json(task );
})

router.put('/tasks/:id', function(req, res, next) {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!Number.isNaN(id) && task) {
    const updateData = {
      id: task.id,
      title: req.body.title,
      description: req.body.description,
      completed: false
    };

    const target = tasks.indexOf(task);
    tasks.splice(target, 1, updateData);
    console.log(`Task with id ${id} updated successfully`);
    res.status(200).json(updateData); 
  } else {
    res.status(404).json({ message: 'Task not found' }); 
  }
});

router.delete('/tasks/:id', function(req, res, next) {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!Number.isNaN(id) && task) {
    const target = tasks.indexOf(task);
    tasks.splice(target, 1);
    console.log(`Task with id ${id} deleted successfully`);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});



module.exports = router;
