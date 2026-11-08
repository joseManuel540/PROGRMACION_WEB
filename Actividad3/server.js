import express from "express";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

let productos = [
  { id: 1, nombre: "Producto 1", precio: 10 },
  { id: 2, nombre: "Producto 2", precio: 20 },
];

let siguienteId = 3;

app.get("/productos", (req, res) => {
  res.status(200).json(productos);
});

app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  let encontrado = null;

  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) {
      encontrado = productos[i];
      break;
    }}

  if (encontrado) {
    res.status(200).json(encontrado);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  } 
});

app.post("/productos", (req, res) => {
    const { nombre, precio, stock } = req.body;
    if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({ error: "Faltan datos del producto" });
    }

    if (
        typeof precio !== "number" || precio < 0 ||
        typeof stock !== "number" || stock < 0
    ) {
        return res.status(400).json({
            error: "El precio y el stock deben ser números mayores o iguales a 0"
        });
    }

    const nuevo = { id: siguienteId++, nombre, precio, stock };
    productos.push(nuevo);
    res.status(201).json(nuevo);
});

app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) 
    return res.status(404).json({ error: "Producto no encontrado" });
  productos.splice(i, 1);
  res.status(200).json({
    mensaje: "Producto eliminado correctamente"})
});

app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nombre, precio, stock } = req.body;
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "Faltan datos del producto" });
  }

    if (
        typeof precio !== "number" || precio < 0 ||
        typeof stock !== "number" || stock < 0
    ) {
        return res.status(400).json({
            error: "El precio y el stock deben ser números mayores o iguales a 0"
        });
    }

  productos[i] = { ...productos[i], nombre, precio, stock };
  res.status(200).json(productos[i]);
});

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
