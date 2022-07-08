class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre
        this.apellido = apellido
        this.libros = libros
        this.mascotas = mascotas
    }

    getFullName() {
        return `${this.nombre} ${this.apellido}`
    }

    addMascota(mascota) {
        this.mascotas.push(mascota)
    }

    countMascotas() {
        return this.mascotas.length
    }

    addBook(nombre, autor) {
        this.libros.push({ nombre, autor })
    }

    getBookNames() {
        return this.libros.map(libro => libro.nombre)
    }
}

const usuario1 = new Usuario(
    'Franny',
    'Glasss',
    [
        { nombre: 'Nine Stories', autor: 'Salinger' },
        { nombre: 'Biblia', autor: 'Anónimo' }],
    ['Bloomberg']
)

console.log(usuario1.getFullName())
console.log(usuario1.getBookNames())
usuario1.addBook('Relatos de un peregrino ruso', 'Anónimo')
console.log(usuario1.getBookNames())
console.log(usuario1.countMascotas())
usuario1.addMascota('Toto')
console.log(usuario1.countMascotas())