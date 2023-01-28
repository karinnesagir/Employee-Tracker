const inquirer = require('inquirer'); 
const express = require('express')
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'myPassword',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`),
);


// Prompt user
const promptUser = () => {
    inquirer.prompt([
        {
          name: 'options',
          type: 'list',
          message: 'Please select an option:',
          choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Remove a Department',
            ]
        }
      ])
      .then(answers => {
        const {options} = answers;
        // console.log(options);
        if(options == 'View all Departments'){
          viewAllDepartments()
        }  
        if(options == 'View all Roles'){
          viewAllRoles()
        }  
        if(options == 'View all Employees'){
          viewAnEmployee()
        }    
        if(options == 'Add a Department'){
          addADepartment()
        }    
        if(options == 'Add a Role'){
          addARole()
        }    
        if(options == 'Add an Employee'){
          addAnEmployee()
        }    
        if(options == 'Update an Employee Role'){
          updateAnEmployeeRole()
        } 
        if(options == 'Remove a Department'){
          removeDepartment()
        }   
      })
  };

promptUser()

const viewAllDepartments = () => {
  connection.query('SELECT * FROM department', function (err, results) {
    console.table(results)
    promptUser();
  })
};

const viewAllRoles = () => {
  connection.query('SELECT * FROM role', function (err, results) {
    console.table(results)
    promptUser();
  })
}

const viewAnEmployee = () => {
  connection.query('SELECT * FROM employee', function (err, results) {
    console.table(results)
    promptUser();
  })
}

