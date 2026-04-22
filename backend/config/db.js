import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg; // pool manages multiple database conection efficiently

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool.on('connect',()=>{
    console.log('✅ connected to Neon postgres database')
})

pool.on('error',(error)=>{
    console.log('❌ unexpected database error',error)
    process.exit(-1)
})

export default {
    query :(text,params)=> pool.query(text,params),
    pool
};  /// export database in anywhere

