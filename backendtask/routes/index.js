var express = require('express');
var router = express.Router();



let tasks =[];
let currentId = 1;

router.get('/', function(req, res, next) {
  res.json(tasks);
});

router.get('/:id', function(req,res,next){
      const id = Number(req.params.id);
      const task = tasks.find((task)=> task.id ===id );

      if (task){
        res.status(200).json(task);
      }
      else{
        res.sendStatus(404);
      }
  
})

router.post('/', function(req,res,next){
  const task = {
      id: currentId++,
      title: req.body.title,
      description: req.body.description,
      completed: false
  };
  tasks.push(task);
  res.status(201).json(task );
})

router.put('/:id', function(req,res,next){
  const id = Number(req.params.id);
  const task = tasks.find((task)=> task.id ===id );

  if (task){
    const updateData = {
      id: task.id,
      title : req.body.title,
      description: req.body.description,
      completed: false
    }

    const target =  tasks.indexOf(task);
    tasks.splice(target, 1, updateData);
    res.status(201).json(task);
  }
  else{
    res.status(404).json(task)
  }

})

router.delete('/:id', function(req,res, next){
  const id = Number(req.params.id);
  const task = tasks.find((task)=> task.id ===id );

  if (task){
    const target  = tasks.indexOf(task);
    tasks.splice (target, 1);
    res.sendStatus(204);
  }
  else{
    res.sendStatus(404);
  }
})



module.exports = router;
