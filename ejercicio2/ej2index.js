const { Contenedor } = require("./ejercicio2Class");

const producto1 = new Contenedor("Monitor", 15_000, "https://www.lg.com/es/monitores/lg-24MK430H-B")
const producto2 = new Contenedor("Microprocesador", 20_650, "https://guiagame.com/wp-content/uploads/2022/01/Intel-i7-9700K-CPU.jpg")

    ; (async () => {
        console.log("Producto creado. ID: ", await Contenedor.save(producto1))
        console.log(await Contenedor.getById(1))
        console.log("Producto creado. ID: ", await Contenedor.save(producto2))
        console.log(await Contenedor.getAll())
        await Contenedor.deleteById(1)
        console.log(await Contenedor.getById(1))
        console.log(await Contenedor.deleteAll())
        console.log(await Contenedor.getAll())
    })()