import { pool } from "../db.js"

async function estructuredForms(rowsFormulario) {
  const formularios = []
  for (const rowF of rowsFormulario) {
    const preguntas = []
    const { id_formulario } = rowF
    const [rowsPreguntas] = await pool.query('select * from pregunta where id_formulario = ?', [id_formulario])
    for (const rowP of rowsPreguntas) {
      const { id_pregunta } = rowP
      const [rowsOpciones] = await pool.query('select * from opcion where id_pregunta = ?', [id_pregunta])
      const pregunta = {
        pregunta: rowP,
        opciones: rowsOpciones
      }
      preguntas.push(pregunta)
    }
    const formulario = {
      formulario: rowF,
      preguntas
    }
    formularios.push(formulario)
  }
  return formularios
}

async function actualizar(table, object, id_actualizar, id) {
  console.log(table)
  const columns = Object.keys(object)
  for (const column of columns) {
    const value = object[column]
    console.log(value)
    const query = `update ${table} set ${column} = ? where ${id_actualizar} = ?`
    console.log(query)
    await pool.query(query, [value, id])
  }
}

export async function getForms(req, res) {
  const [rowsFormulario] = await pool.query('select * from formulario')

  const formularios = await estructuredForms(rowsFormulario)

  res.send(formularios)
}

export async function createForm(req, res) {
  const { formulario, preguntas, opciones } = req.body
  const { id_usuario, titulo, descripcion, estado } = formulario
  try {
    const idFormulario = crypto.randomUUID()
    await pool.query('insert into formulario (id_formulario, id_usuario, titulo, descripcion, estado, fecha_creacion) values (?, ?, ?, ?, ?, NOW())', [idFormulario, id_usuario, titulo, descripcion, estado])
    preguntas.map(async (p) => {
      const { id, texto, tipo, obligatoria, orden } = p
      await pool.query('insert into pregunta (id_pregunta, id_formulario, texto, tipo, obligatoria, orden) values (?, ?, ?, ?, ?, ?)', [id, idFormulario, texto, tipo, obligatoria, orden])
    })
    opciones.map(async (op) => {
      const { id_pregunta, texto } = op
      const id = crypto.randomUUID()
      await pool.query('insert into opcion (id_opcion, id_pregunta, texto) values (?, ?, ?)', [id, id_pregunta, texto])
    })

    res.send({
      message: "Formulario creado exitosamente"
    })
  } catch (error) {
    res.status(500).send('Error al intentar crear el formulario, intentalo nuevamente')
    console.log(error)
  }
}

export async function updateForm(req, res) {
  const { id } = req.params
  const { titulo, descripcion, pregunta, opcion } = req.body
  try {
    const [rowsFormulario] = await pool.query('select * from formulario where id_formulario = ?', [id])
    if (rowsFormulario.length === 0) {
      res.send('El formulario que está intentando actualizar no existe')
      return
    }
    if (titulo) {
      await pool.query('update formulario set titulo = ? where id_formulario = ?', [titulo, id])
    }
    if (descripcion) {
      await pool.query('update formulario set descripcion = ? where id_formulario = ?', [descripcion, id])
    }
    if (pregunta) {
      for (const p of pregunta) {
        const preguntaFields = {
          texto: p?.texto,
          tipo: p?.tipo,
          obligatoria: p?.obligatoria
        }
        await actualizar('pregunta', preguntaFields, 'id_pregunta', p.id_pregunta)
      }
    }
    if (opcion) {
      for (const op of opcion) {
        await actualizar('opcion', op, 'id_opcion', op.id_opcion)
      }
    }
    res.send('El formulario se actualizó exitosamente')
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error al actualizar el formulario, por favor intente nuevamente')
  }
}

export async function deleteForm(req, res) {
  const { id_formulario } = req.body;

    try {
      if (!id_formulario) {
        return res.status(400).send('Se requiere el ID del formulario');
      }

      const [resultado] = await pool.query('DELETE FROM formulario WHERE id_formulario = ?', [id_formulario]);

      if (resultado.affectedRows === 0) {
        return res.status(404).send('El formulario no existe');
      }

      res.send('Formulario eliminado exitosamente');
    } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error al eliminar el formulario, por favor intenta nuevamente');
    }
}
