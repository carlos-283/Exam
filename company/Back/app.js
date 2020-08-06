const express = require ('express');
const bodyParser = require ('body-parser');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema  , GraphQLScalarType}= require('graphql');
var mysql = require('mysql');
const cors = require('cors')

const app=express();
app.use(cors());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Somera13*",
    database:"company"
  });
  
  con.connect(function(err) {
    if (err) throw err;
  });

app.use(bodyParser.json());

const employees=[];

const queryDB = ( sql, args) => new Promise(  (resolve, reject) => {   

    con.query(sql, args, (err, rows) => {
        if (err)
        throw err
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
})

app.use('/graphql',
        graphqlHTTP({
            schema: buildSchema(`
            scalar Date

            input employeeInput {
                id:Int
                name :String
                lastName :String
                secLastName :String
                birthDate: Date
                address: String
                phone: String
                active: Boolean
            }

            type employee{
                id: Int! 
                name :String!
                lastName :String!
                secLastName :String!
                address: String!
                phone: String!
                active: Boolean!
                birthDate: Date!
            }
            
            type RootQuery{
                employees: [employee],
                employeeInfo( id: Int): employee,
            }


            type RootMutation{

                createEmployee( 
                    input:employeeInput!
                ):Boolean
                    
                updateEmployee( 
                    input:employeeInput!
                    ):Boolean
                    
                deleteEmployee( 
                    id:Int!
                    ):Boolean 
            }

            schema{
                query: RootQuery
                mutation: RootMutation
            }
            `),
            rootValue: { 

            employees: args => queryDB("select * from employees where active").then(data => data),
            
            employeeInfo: args  => queryDB( "select * from employees where id = ?", [args.id]).then(data => data[0]),
            
            createEmployee: args  => queryDB( "insert into employees SET ?", args.input).then(data => {data}),
            
            updateEmployee: args  => queryDB( "update employees SET ? where id = ?", [args.input,args.input.id]).then(data => data),
            
            deleteEmployee: args  => queryDB( "update employees set active=false where id = ?", args.id).then(data => data),

            },
            graphiql:true
    })
);


app.listen(3000);