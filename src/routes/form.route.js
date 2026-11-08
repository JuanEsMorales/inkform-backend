import { Router } from "express";
import { getForms, createForm, updateForm, deleteForm, getFormById } from "../controllers/forms.controller.js";

const router = Router()

router.get('/forms', getForms)

router.get('/forms/:id', getFormById)

router.post('/forms', createForm)

router.patch('/forms/:id', updateForm)

router.delete('/forms/:id', deleteForm)

export default router
