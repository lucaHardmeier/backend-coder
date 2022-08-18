const socket = io()

socket.on('products', products => {
    const errorMsj = products.length === 0 ? "No se han encontrado productos en la base de datos" : null
    const html = products.map((product) => {
        return (`<li class="card bg-warning m-2" style="width: 14rem;">
        <img src=${product.thumbnail} class="card-img-top" alt=${product.title}>
        <div class="card-body text-dark">
            <h5 class="card-title">
                ${product.id} - ${product.title}
            </h5>
            <p class="card-text">
                $${product.price}
            </p>
        </div>
    </li>`)
    }).join(" ")
    document.getElementById("products").innerHTML = errorMsj ? errorMsj : html
})

function addProduct(e) {
    const product = {
        title: document.getElementById("productTitle").value,
        price: document.getElementById("productPrice").value,
        thumbnail: document.getElementById("productThumbnail").value
    }
    socket.emit("addProduct", product)
    return false
}

socket.on('chat', chat => {
    console.log(chat)
    const errorMsj = chat.length === 0 ? "No hay nuevos mensajes" : null
    const html = chat.map((message) => {
        return (`<li>
        <div class"text-warning">${message.user} ${message.date}</div>
        <p class="text-white">${message.content}</p>
    </li>`)
    }).join(" ")
    document.getElementById("chatLog").innerHTML = errorMsj ? errorMsj : html
})

function addMessage(e) {
    const date = new Date()
    const message = {
        user: document.getElementById("userEmail").value,
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        content: document.getElementById("userMessage").value
    }
    socket.emit("newMessage", message)
    return false
}