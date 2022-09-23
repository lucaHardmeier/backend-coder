const socket = io()
const { denormalize, schema } = normalizr

socket.on('chat', async (data) => {
    const errorMsj = data.normalizedChat.length === 0 ? "No hay nuevos mensajes" : null
    const denormalizedChat = denormalize(data.normalizedChat.result, data.schemaMessage, data.normalizedChat.entities)
    const html = denormalizedChat.map((message) => {
        return (`<li>
        <div class"text-warning">${message.user} ${message.date}</div>
        <p class="text-white">${message.content}</p>
    </li>`)
    }).join(" ")
    document.getElementById("chatLog").innerHTML = errorMsj ? errorMsj : html
})

function addMessage(e) {

    const message = {
        author: {
            id: document.getElementById("userEmail").value,
            nombre: String,
            apellido: String,
            edad: Number,
            alias: String,
            avatar: String,
        },
        content: document.getElementById("userMessage").value
    }
    socket.emit("newMessage", message)
    return false
}