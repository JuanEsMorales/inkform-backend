import { Router } from "express";
import { pool } from "../db.js";

const router = Router()

router.get('/', (req, res) => {
  res.send("Hola como esta!!!!")
})

router.get('/ping', async (req, res) => {
  const result = await pool.query('select * from formulario')
  res.json(result[0])
})

export default router
