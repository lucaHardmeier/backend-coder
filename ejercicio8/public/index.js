const socket = io()
//const { denormalize, schema } = normalizr()

socket.on('chat', async (data) => {
    const { normalizedChat, schemaMessage, denormalizedChat } = data
    //const denormalizedChatClient = denormalize(normalizedChat.result, schemaMessage, normalizedChat.entities)
    let errorMsj = null
    let html = ''
    if (denormalizedChat.chat.length) {
        html = denormalizedChat.chat.map((message) => {
            return (`<li>
            <div class"text-warning">${message.author.alias} ${message.author.id}</div>
            <p class="text-white">${message.content}</p>
        </li>`)
        }).join(" ")
    } else {
        errorMsj = "No hay nuevos mensajes"
    }
    document.getElementById("chatLog").innerHTML = errorMsj ? errorMsj : html
    document.getElementById("compressView").innerHTML = `Porcentaje de compresión: ${JSON.stringify(denormalizedChat).length / JSON.stringify(normalizedChat).length * 100}%`
})

function addMessage(e) {
    const message = {
        author: {
            id: document.getElementById("userEmail").value,
            nombre: document.getElementById("userFirstName").value,
            apellido: document.getElementById("userLastName").value,
            edad: +document.getElementById("userAge").value,
            alias: document.getElementById("userAlias").value
        },
        content: document.getElementById("userMessage").value
    }
    socket.emit("newMessage", message)
    return false
}