const fs = require('fs')
const data = require('../data.json')
const {date} = require('../utils')

exports.index = function (req, res){
    return res.render("students/index", {students: data.students})
}
//create
exports.create =  function (req, res){
    return res.render("students/create")
}
exports.post = function (req, res){
const keys = Object.keys(req.body)
for(key of keys){
    if(req.body[key] =="") {
        return res.send('Please, fill all fields!')
        }
    }
    birth = Date.parse(req.body.birth)
    
    const lastStudent = data.students[data.students.length -1]
    let id = 1
    if(lastStudent){
        id = lastStudent.id +1
    }
    
    data.students.push({
        id,
        ...req.body,
        birth, 
    })
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")
        return res.redirect(`/students/${id}`)
    })
    //return res.send(req.body)
}

//show
exports.show = function(req, res){
    const {id} = req.params
    const foundStudent = data.students.find(function(student){
        return student.id==id
    })
   if(!foundStudent) return res.send("Student not found!")

   const student ={
       ...foundStudent,
       birth:date(foundStudent.birth).birtDay, 
   }
   return res.render("students/show", {student})
}

//edit
exports.edit =function(req, res){
    const {id} = req.params
    const foundStudent = data.students.find(function(student){
        return id == student.id
    })

   if(!foundStudent) return res.send("Student not found!-problema no edit")

   const student ={
       ...foundStudent,
       birth: date(foundStudent.birth).iso,
    }
   return res.render('students/edit', {student})
}
exports.put = function(req, res){
    const {id} = req.body
    let index = 0
    const foundStudent = data.students.find(function(student, foundIndex){
        if(student.id ==id){
            index = foundIndex
            return true
        }
    })
    if(!foundStudent) return res.send("Student not found!- problema no put")
    
    const student={
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }
    data.students[index] = student
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!- problema no put2")
        return res.redirect(`/students/${id}`)
    })
} 
//delete
exports.delete = function(req, res){
    const { id } = req.body
    const filteredStudents = data.students.filter(function(student){
        return student.id !== id
    })

    data.students = filteredStudents
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!-problema no delete")
        
        return res.redirect('/students')
    })
 }




//update