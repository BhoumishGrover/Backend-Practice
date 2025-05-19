const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    city: String,
    street: String
});

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate :{
            validator: function(v){
                return v % 2 === 0;
            },
            message: function(props){
                return `${props.value} is not an even number!`
            }
        }
    },
    course: String,
    cgpa: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        uppercase: true
    },
    fulltime: Boolean,
    friend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Students'
    } ,
    address: addressSchema,
    createdAt : {
        type: Date,
        immutable: true,
        default: ()=> Date.now()
    },
});

userSchema.methods.sayHI = function (){
    console.log(`HI, My name is ${this.name} I am ${this.age} years old`);
}

// userSchema.statics.findByName() = function(){
//     return this.where({name: new RegExp(name,"i")});
// }

userSchema.virtual("namedGPA").get(function(){
    return `${this.name} <${this.cgpa}>`;
});

module.exports = mongoose.model('Students',userSchema);