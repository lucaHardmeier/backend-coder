const { Contenedor } = require("./ej2Class");
const fileRoute = './productos.txt'

const producto1 = {
    nombre: "Monitor",
    precio: 15_000,
    url: "https://www.lg.com/es/monitores/lg-24MK430H-B"
}
const producto2 = {
    nombre: "Microprocesador",
    precio: 20_650,
    url: "https://guiagame.com/wp-content/uploads/2022/01/Intel-i7-9700K-CPU.jpg"
}

const contenedor = new Contenedor(fileRoute)


    ; (async () => {
        console.log("Producto creado. ID: ", await contenedor.save(producto1))
        console.log(await contenedor.getById(1))
        console.log("Producto creado. ID: ", await contenedor.save(producto2))
        console.log(await contenedor.getAll())
        await contenedor.deleteById(1)
        console.log(await contenedor.getById(1))
        await contenedor.deleteAll()
        console.log(await contenedor.getAll())
    })()