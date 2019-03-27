var inquirer = require("inquirer");   //for user prompts
var mysql = require("mysql");       // for mysql database
var Table = require('cli-table');  //for table display

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "doyis40!",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    user_interface();
});

// make an array of department names
var department_names = [];

//make an array of total sale for each department
var total_sale = [];

//user interface that will prompt supervisor to choose from menu
function user_interface() {
    inquirer.prompt([ {
        type: "list",
        name: "action",
        message: "Please select from the following: ",
        choices: ["View Product Sales by Department", "Create New Department"]
    }
    ]).then(function(data) {
        if (data.action === "View Product Sales by Department")
            get_departments();
        else
            add_department();
    });
}

// get department names and store into array
function get_departments() {

    connection.query("SELECT Department_Name FROM departments", function(err, results) {
        if (err) throw err;
      
        for (let i = 0; i < results.length; i++) 
          department_names.push(results[i].Department_Name);
          
        get_product_sales();
    });
}

// calculate product sales for each department
function get_product_sales() {

    for (let j = 0; j < department_names.length; j++) {

        // query for products with same department name
        connection.query("SELECT * FROM products WHERE ?",
        {
            Department_Name: department_names[j]

        }, function(err, res) {
            if (err) throw err;

            var total = 0;

            //add product sales for same department
            for (let i = 0; i < res.length; i++) 
                total += res[i].Product_Sales;

            // push total sales for each department to array
            total_sale.push(total);
        });
    }
    display_table(total_sale);
}

// displays table of departments with alias columns wtih total product sales per department and profit
function display_table(sales_total) {

    // table setup
    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Cost', 'Product Sales', 'Total Profit']
        , colWidths: [10, 25, 20, 20, 20]
        });

    connection.query("SELECT * FROM departments", function(err, results) {
        if (err) throw err;
        
        // fill data for table
        for (let i = 0; i < results.length; i++) {
            table.push([results[i].Department_ID, results[i].Department_Name, '$'+ results[i].Overhead_Cost.toFixed(2), '$'+ sales_total[i].toFixed(2), '$'+ (sales_total[i].toFixed(2) - results[i].Overhead_Cost).toFixed(2)]);
        }
    
        // display table
        console.log('\n' + table.toString() + '\n');
        ask_again();
    
        });
}


// allows the manager to add a completely new department to the store.
function add_department() {
    console.log("\nOk, let's get some information about the new department.\n");
  
    inquirer.prompt([ 
        {
        name: "name",
        message: "Please type new department name: ",
        },
        {
        name: "cost",
        message: "Enter overhead cost for this department: ",
        }
    ]).then(data => {
        var response = {department: data.name, overhead: parseFloat(data.cost)};
  
        var query = connection.query(
            "INSERT INTO departments SET ?",
            {
              Department_Name: response.department,
              Overhead_Cost: response.overhead,
            },
            function(err, res) {
              total_sale.push(0.0);
              console.log('\n' + res.affectedRows + " new department added!\n");
              ask_again();
        });
    });
  }

// display prompt to go back to main menu or end session
function ask_again() {

    inquirer.prompt([ {
      type: "list",
      name: "response",
      message: "Would you like to perform another transaction?",
      choices: ["Yes", "No"]
    }
    ]).then(function(data) {
        if (data.response === "Yes")
          user_interface();
        else {     
          console.log("\nHappy to serve you today. See you again soon!\n")
          connection.end();
        }
    });
  
  }