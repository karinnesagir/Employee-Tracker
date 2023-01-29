INSERT INTO department (department_name)
VALUES ('Marketing'),
       ('Finance'),
       ('Sales'),
       ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Office Manager', 130000, 3),
       ('Marketing agent', 100000, 1),
       ('Accountant', 105000, 2),
       ('Business Analyst', 95000, 3),
       ('Product Manager', 150000, 4),
       ('Engineer', 130000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Brott', 1, null),
       ('Justin', 'Frumman', 2, 1),
       ('Lauren', 'Montosae', 3, 1),
       ('Eliotte', 'Kaz', 4, 1),
       ('Roni', 'Jole', 5, null),
       ('Kayleen', 'Sagonde', 6, 5);
