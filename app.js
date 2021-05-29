const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
const list = require("./list.json");

const error = chalk.bold.red;
const warning = chalk.bold.keyword('orange');

var checkEmpty = function(list){
    if(list.length === 0){
        return true;
    }
    return false;
}

var addNote = function(title, body){
    fs.readFile("list.json", function(err,data){
        if(err) throw err;
        const list = JSON.parse(data);
        if(!checkEmpty(list)){
            var index = checkList(list,title);
            if(index !== false){
                console.log(error('Title already exists!'));
            }
            else{
                list.push({
                    title: title,
                    body: body
                });
                var update = JSON.stringify(list);
                fs.writeFileSync("list.json",update);
                console.log(chalk.green('New note created successfully!'));
            }
        }
        else{
            console.log(warning("You don't have any notes!"));
        }
    });
} 

var removeNote = function(title){
    fs.readFile("list.json", function(err,data){
        if(err) throw err;
        const list = JSON.parse(data);
        if(!checkEmpty(list)){
            var index = checkList(list,title);
            if(index !== false){
                var updatedList = list.filter((li)=>{
                    return (li.title!==title);
                });
                var update = JSON.stringify(updatedList);
                fs.writeFileSync("list.json",update);
                console.log(chalk.green('Note removed successfully!'));
            }
            else{
                console.log(error("Note not found!"));
            }
        }
        else{
            console.log(warning("You don't have any notes!"));
        }
    });
} 

var listNote = function(){
    fs.readFile("list.json", function(err,data){
        if(err) throw err;
        const list = JSON.parse(data);
        if(!checkEmpty(list)){
            console.log(chalk.blue('Your Notes: '))
            list.forEach(li => {
                console.log(chalk.green(li.title));
            });
        }
        else{
            console.log(warning("You don't have any notes!"));
        }
    });
} 

var checkList = function(list,title){
    for (var i=0; i<list.length; i++){
        if(list[i].title.toLowerCase() == title.toLowerCase()){
            return i;
        }
    }
    return false;
}

var readNote = function(title){
    fs.readFile("list.json", function(err,data){
        if(err) throw err;
        const list = JSON.parse(data);
        if(!checkEmpty(list)){
            var index = checkList(list,title);
            if(index !== false){
                console.log(chalk.yellow(list[index].title));
                console.log(chalk.blue(list[index].body));
            }
            else{
                console.log(error("Note not found!"));
            }
        }
        else{
            console.log(warning("You don't have any notes!"));
        }
    });
} 

yargs.command({
    command: 'add',
    describe: 'Adding a note',
    builder: {
        title: {
            describe: 'Title of the note',
            demandOption: true, 
            type: 'string'     
        },
        body: {  
            describe: 'description of the note',
            demandOption: true,
            type: 'string'
        }
    },
  
    handler: function(argv){
        addNote(argv.title,argv.body);		
    }
});
yargs.command({
    command: 'remove',
    describe: 'Removing a note',
    builder: {
        title: {
            describe: 'Title of the note',
            demandOption: true, 
            type: 'string'     
        }
    },
  
    handler: function(argv){
        removeNote(argv.title);		
    }
});

yargs.command({
    command: 'read',
    describe: 'Reading a note',
    builder: {
        title: {
            describe: 'Title of the note',
            demandOption: true, 
            type: 'string'     
        }
    },
  
    handler: function(argv){
        readNote(argv.title);		
    }
});

yargs.command({
    command: 'list',
    describe: 'Listing all notes',
    handler(argv) {
        listNote();
    }
});

yargs.parse();

// node index.js add --firstNumber=4 --secondNumber=10
