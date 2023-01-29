const inquirer = require('inquirer'); 
const express = require('express')
const cTable = require('console.table');
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
);

// Prompt user
const promptUser = () => {
    inquirer.prompt([
        {
          name: 'options',
          type: 'list',
          message: 'What would you like to do?',
          choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
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

// View all Departments 
const viewAllDepartments = () => {
  connection.query('SELECT * FROM department', function (err, results) {
    console.table(cTable.getTable(results))
    promptUser();
  })
};

// View all Roles 
const viewAllRoles = () => {
  connection.query(`SELECT role.id, role.title, role.salary, 
  department.department_name AS department FROM role INNER JOIN department ON role.department_id = department.id`, 
  function (err, results) {
    console.table(cTable.getTable(results))
    promptUser();
  })
}

// View all Employees 
const viewAllEmployees = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee 
  JOIN role ON role.id = employee.role_id
  JOIN department ON department.id = role.department_id
  LEFT JOIN employee as manager ON employee.manager_id = manager.role_id`,
  function (err, results) {
    console.table(cTable.getTable(results))
    promptUser();
  });
}

// Add a Department 
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

// Add a Role 
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

// Add an Employee 
const addAnEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
    }
  ])
    .then(answer => {
    const employeeFullName = [answer.fistName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.query(roleSql, (error, response) => {
      if (error) throw error; 
      const roles = response.map(({ id, title }) => ({ name: title, value: id }));
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
              employeeFullName.push(role);
              const managerSql =  `SELECT * FROM employee`;
              connection.query(managerSql, (error, response) => {
                if (error) throw error;
                const managers = response.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerAnswer => {
                    const manager = managerAnswer.manager;
                    employeeFullName.push(manager);
                    // add manager column (first in viewAllEmployees)
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    connection.query(sql, employeeFullName, (error) => {
                    if (error) throw error;
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};

// Update an Employee Role
const updateAnEmployeeRole = () => {
  connection.query("SELECT * FROM employee", (error, response) => {
      if (error) throw error;
      const roles = response.map(response => response.id + " " + response.first_name + " " + response.last_name)
      inquirer.prompt([
          {
              type: "list",
              message: "Which employees would you like to update?",
              name: "employeeToUpdate",
              choices: roles
          }
      ]).then(employee => {
          let employeeId = employee.employeeToUpdate.split(' ')[0];
          connection.query("SELECT * FROM role", (error, response) => {
              if (error) throw error;
              const employees = response.map(response => response.id + " " + response.title)
              inquirer.prompt([
                  {
                      type: "list",
                      message: "What is this employee's new role?",
                      name: "newrole",
                      choices: employees
                  }
              ]).then(newrole => {
                  let roleId = newrole.newrole.split(' ')[0];
                  let query = connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
                      [roleId, employeeId],
                      (error, response) => {
                          if (error) throw error;
                      }
                  );
                  viewAllEmployees();
              });
          });
      });
  });
}