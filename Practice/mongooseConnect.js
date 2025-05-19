const mongoose = require ('mongoose');
const Student = require("./user.js");

const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb://localhost/students');
        console.log("Successfully Connected to your students database");
    } catch(err){
        console.error("Couldn't Connect to your database!",err.message);
    }
};

connectDB();

async function run(){
    // const newStudent = new Student({
    //     name: "Bhoumish",
    //     age: 20,
    //     course: "CS",
    //     cgpa: 9.3,
    //     gender: "male",
    //     fulltime: true
    // });
    // await newStudent.save();    //saves to mongoDB
    try{
    //     const newStudent = await Student.create({
    //     name: "Mehak",
    //     age: 19,
    //     course: "CSBS",
    //     cgpa: 9.0,
    //     gender: "female",
    //     fulltime: true,
    //     friend: new mongoose.Types.ObjectId('6827a1a7d3c7de6f5852bf8a'),
    //     address: {
    //         city:" Navi Mumbai",
    //         street:"Sanpada"
    //     }
    // });

    // await newStudent.save(); //saves newStudent to mongoDB server
    // console.log(newStudent);
        
        //const stud = (await Student.where("age").gt(20).where("name").equals("Bob"));
        // const stud = await Student.find();
        // stud.forEach(s=>s.sayHI());
        const stud = await Student.findOne({name:"Bhoumish"});
        console.log(stud);
        console.log(stud.namedGPA)
    } catch(e){
        console.error(e.message); 
    }
};

run();