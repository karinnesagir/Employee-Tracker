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
          viewAllEmployees()
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
  connection.query(`SELECT role.id, role.title, role.salary, 
  department.department_name AS department FROM role INNER JOIN department ON role.department_id = department.id`, 
  function (err, results) {
    console.table(results)
    promptUser();
  })
}

// add view manager
const viewAllEmployees = () => {
  connection.query(
  `SELECT employee.id, employee.first_name, employee.last_name,
  role.title, 
  department.department_name AS department, 
  role.salary FROM employee, 
  role, department WHERE department.id = role.department_id AND role.id = employee.role_id ORDER BY employee.id`,
  function (err, results) {
    console.table(results)
    promptUser();
  })
}

const addADepartment = () => {
  inquirer.prompt([
    {
      name: 'addDepartment',
      type: 'input',
      message: 'What is the name of the department you would like to add?',
    }
  ])
  .then((answer) => {
    let sql = `INSERT INTO department (department_name) VALUES (?)`;
    connection.query(sql, answer.addDepartment, (error) => {
      if (error) throw error;
      viewAllDepartments();
    });
  });
};

const addARole = () => {
  const sql = 'SELECT * FROM department'
  connection.query(sql, (error, response) => {
      if (error) throw error;
      let departmentArray = [];
      response.forEach((department) => {departmentArray.push(department.department_name);});
        inquirer.prompt([
            {
              name: 'departmentName',
              type: 'list',
              message: 'Which department is this new role in?',
              choices: departmentArray
            },
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of the role you would like to add?',
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
            }
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (answer.departmentName === department.department_name) {departmentId = department.id;}
          });
          let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let responses = [createdRole, answer.salary, departmentId];

          connection.query(sql, responses, (error) => {
            if (error) throw error;
            viewAllRoles();
          });
        });
  });
};

// Add a New Employee
const addAnEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const crit = [answer.fistName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              crit.push(role);
              const managerSql =  `SELECT * FROM employee`;
              connection.query(managerSql, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    crit.push(manager);
                    // add manager column (first in viewAllEmployees)
                    const sql =   `INSERT INTO employee (first_name, last_name, role_id)
                                  VALUES (?, ?, ?)`;
                    connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};
