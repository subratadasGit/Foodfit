  import dotenv from 'dotenv'
  dotenv.config()

  import express from 'express'
  import cors from 'cors'
  import pantryRoutes from './routes/pantry.js'
  import recipeRoutes from './routes/recipe.js'
  import mealPlanRoutes from './routes/Mealplan.js'
  import shoppingListRoutes from './routes/shoppingList.js'

  const app = express()



  //middleware
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({extended : true}))

//   test route 
app.get("/",(req,res)=>{
    res.json({message:'AI Recipe Generator API'})
})



//API - routes 

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/pantry',pantryRoutes)
app.use('/api/recipes',recipeRoutes)
app.use('/api/meal-plan',mealPlanRoutes)
app.use('/api/shopping-list',shoppingListRoutes)

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    res.status(status).json({
        success: false,
        message: err.message || "Internal server error"
    });
});




const PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    console.log(`Environment : ${process.env.NODE_ENV   || 'development'}`)
})