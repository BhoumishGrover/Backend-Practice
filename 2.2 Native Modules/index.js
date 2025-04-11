const fs = require("fs");

// fs.writeFile("./myMessages.txt", "Hello from Node-JS", (err)=> {
//     if (err) throw err;
//     console.log("File has been saved!");
// });

fs.readFile("./message.txt","utf8", (err,data) => {
    if (err){
        console.log(err);
    }
    console.log("file contents:", data);
});