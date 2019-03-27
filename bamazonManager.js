var inquirer = require("inquirer");  // for user prompts
var mysql = require("mysql");     // for mysql database
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

// interface that will allow manager to pick from a menu
function user_interface() {
    inquirer.prompt([ {
        type: "list",
        name: "action",
        message: "Please select from the following: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
    ]).then(function(data) {
        switch (data.action) {
            case "View Products for Sale":
                read_items();
            break;
            case "View Low Inventory":
                check_inventory();
            break;
            case "Add to Inventory":
                get_ID();
            break;
            case "Add New Product":
                add_product();
            break;
        }
    });
}

//displays all items available for sale in a table form
function read_items() {

    // table setup
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity']
    , colWidths: [10, 50, 10, 17]
    });

    console.log("\nDisplaying all available items.\n");
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
    
      // fill data for table
      for (let i = 0; i < results.length; i++) {
        table.push([results[i].Item_ID, results[i].Product_Name, '$'+ results[i].Price.toFixed(2), results[i].Stock_Qty]);
      }

      // display table
      console.log(table.toString() + '\n');
      ask_again();
    });
}

// function will list all items with an inventory count lower than five
function check_inventory() {

    // table setup
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity']
    , colWidths: [10, 50, 10, 17]
    });

    console.log("\nChecking products for low inventory...\n");
    connection.query("SELECT * FROM products WHERE Stock_Qty < 5", 
    function(err, res) {
      if (err) throw err;

      // fill data for table
      for (let i = 0; i < res.length; i++) {
        table.push([res[i].Item_ID, res[i].Product_Name, '$'+ res[i].Price.toFixed(2), res[i].Stock_Qty]);
      }
      
    // display table
    console.log(table.toString() + '\n');
    ask_again();

    });
}

// display prompt that will let the manager "add more" of an item by ID.
function get_ID() {
    inquirer.prompt([ {
        name: "product_id",
        message: "Enter the ID of the product you want to update: ",
    }
    ]).then(function(data) {
        update_product(data.product_id);
    });
}

// will "add more" to selected item
function update_product(item) {
  connection.query("SELECT * FROM products WHERE ?", 
    {
        Item_ID: item
    },
    function(err, res) {

      inquirer.prompt([ {
          name: "quantity",
          message: "How many units would you like to add for this item? ",
      }
      ]).then(function(data) {
          
        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              Stock_Qty: res[0].Stock_Qty + parseInt(data.quantity)
            },
            {
              Item_ID: item
            }
          ],
          function(err) {
            console.log("\nProduct inventory updated!\n\n");
            ask_again();
          });        
      });
  });
}

// allows the manager to add a completely new product to the store.
function add_product() {
  console.log("\nOk, let's get some information about the new product.\n");

  inquirer.prompt([ 
      {
      name: "name",
      message: "Please enter product name: ",
      },
      {
      name: "department",
      message: "Enter department name: ",
      },
      {
      name: "price",
      message: "Enter price of product: ",
      },
      {
      name: "quantity",
      message: "Now enter quantity of new product: ",
      }
  ]).then(data => {
      var response = {product: data.name, department: data.department, price: parseFloat(data.price), stock: parseInt(data.quantity)};

      var query = connection.query(
          "INSERT INTO products SET ?",
          {
            Product_Name: response.product,
            Department_Name: response.department,
            Price: response.price,
            Stock_Qty: response.stock,
          },
          function(err, res) {
            console.log('\n' + res.affectedRows + " item added!\n");
            ask_again();
      });
  });
}

// display promt to go back to main menu or end session
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