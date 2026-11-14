import express from "express";
import { db } from "./db.js";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

// GET /productos
app.get("/productos", async (req, res) => {
  try {
    const [filas] = await db.query("SELECT * FROM productos");
    res.status(200).json(filas);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET /productos/:id
app.get("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [filas] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);

    if (filas.length === 0) {
      return res.status(404).json({ error: "No existe" });
    }

    res.status(200).json(filas[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// POST - Crear un nuevo producto
app.post("/productos", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    if (
      typeof nombre !== "string" || nombre.trim() === "" || typeof precio !== "number" ||
      !Number.isFinite(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0
    ) {
      return res.status(400).json({error: "Los datos del producto no son válidos"});
    }

    const [resultado] = await db.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
      [nombre.trim(), precio, stock]
    );

    const nuevoProducto = {
      id: resultado.insertId,
      nombre: nombre.trim(),
      precio,
      stock
    };

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// PUT - Reemplazar todos los datos de un producto
app.put("/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?", [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    const { nombre, precio, stock } = req.body;

    if (
      typeof nombre !== "string" || nombre.trim() === "" || typeof precio !== "number" ||
      !Number.isFinite(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0
    ) {
      return res.status(400).json({
        error: "Los datos del producto no son válidos"
      });
    }

    await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [nombre.trim(), precio, stock, id]
    );

    res.status(200).json({id, nombre: nombre.trim(), precio, stock});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// PATCH - Actualizar algunos datos de un producto
app.patch("/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?", [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    const producto = filas[0];
    const { nombre, precio, stock } = req.body;

    if (
      (nombre === undefined &&
        precio === undefined &&
        stock === undefined) ||
      (nombre !== undefined &&
        (typeof nombre !== "string" || nombre.trim() === "")) ||
      (precio !== undefined &&
        (typeof precio !== "number" ||
          !Number.isFinite(precio) || precio < 0)) ||
      (stock !== undefined &&
        (!Number.isInteger(stock) || stock < 0))
    ) {
      return res.status(400).json({
        error: "Los datos para actualizar no son válidos"
      });
    }

    if (nombre !== undefined) {
      producto.nombre = nombre.trim();
    }

    if (precio !== undefined) {
      producto.precio = precio;
    }

    if (stock !== undefined) {
      producto.stock = stock;
    }

    await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [producto.nombre, producto.precio, producto.stock, id]
    );

    res.status(200).json(producto);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// DELETE - Eliminar un producto por ID
app.delete("/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [resultado] = await db.query(
      "DELETE FROM productos WHERE id = ?", [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor listo en http://localhost:3000");
});