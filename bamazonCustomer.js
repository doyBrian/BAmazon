var inquirer = require("inquirer");
var mysql = require("mysql");
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

    read_items();
});

var total = 0;

//displays all items available for sale in a table form
function read_items() {

    // table setup
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Price']
    , colWidths: [10, 50, 10]
    });
    
    console.log("\nDisplaying all available items.\n");
    connection.query("SELECT Item_ID, Product_Name, Price FROM products", function(err, results) {
      if (err) throw err;
    
      // fill data for table
      for (let i = 0; i < results.length; i++) {
        table.push([results[i].Item_ID, results[i].Product_Name, '$'+ results[i].Price.toFixed(2)] );
      }

      // display table
      console.log(table.toString());
      user_interface();
    });
}

//user interface that will prompt users for item ID and quantity they would like to buy
function user_interface() {
    inquirer.prompt([ {
        name: "product_id",
        message: "\nEnter the ID of product you want to buy: ",
    },
    {
        name: "quantity",
        message: "How many units would you like buy for this item? ",
    }
    ]).then(function(data) {
        check_product(data.product_id, data.quantity);
    });
}

//checks if store has enough of the product to meet the customer's request.
function check_product(id, qty) {
    console.log("\nChecking selected product...\n");
    connection.query("SELECT * FROM products WHERE ?", 
    {
        Item_ID: id
    },
    function(err, res) {
      if (err) throw err;

      if (res[0].Stock_Qty > qty) {
        console.log("\nStock available. Processing your request now...\n");
        update_product(res[0], qty);
      }
      else {
        console.log("Insufficient quantity! Sorry, your request cannot be processed.\n");
        console.log("Only " + res[0].Stock_Qty + " available for this product in our inventory.\n");
        ask_again();
      }
      
    });
}

// function that will update inventory and calculate total cost of purchased item
function update_product(item, quantity) {
    var updated_qty = item.Stock_Qty - quantity;

    total += quantity * item.Price;

    var sales = (quantity * item.Price) + item.Product_Sales;

    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          Stock_Qty: updated_qty,
          Product_Sales: sales
        },
        {
          Item_ID: item.Item_ID
        }
      ],
      function(err) {
        console.log("\nRequest processed!\n\n");
        ask_again();  
      });
}


//function to loop back to main user prompt or exit
function ask_again() {

  inquirer.prompt([ {
    type: "list",
    name: "response",
    message: "Would you like to buy other items?",
    choices: ["Yes", "No"]
  }
  ]).then(function(data) {
      if (data.response === "Yes")
        read_items();
      else {
        if (total != 0) {
          console.log("\n\nYour total is $" + total.toFixed(2));
          console.log("\nCharging your account...\n");
          console.log("\nYou order was processed. Expect 3-5 business days for delivery.");
          console.log("\nThank you for your purchase. Shop again soon!\n");
        } else       
          console.log("\nYour cart is empty. No amount was charged. Come back soon!\n")

          connection.end();
      }
  });

}