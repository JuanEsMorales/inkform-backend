import { Router } from "express";
import { getForms, createForm, updateForm, deleteForm } from "../controllers/forms.controller.js";

const router = Router()

router.get('/forms', getForms)

router.post('/forms', createForm)

router.patch('/forms/:id', updateForm)

router.delete('/forms/', deleteForm)

export default router
