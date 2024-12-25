// // entry point
import net from "node:net"
let closeCount = 0; // to count the number of times a client connection ended for testing
const server = net.createServer(
    (socket: net.Socket) => {
        // for every request a socket object is created
        socket.on("data", async (httpRequest: Buffer) => {
            console.log("a client is sending a request(data): ", httpRequest.toString())
            const firstLine: string = httpRequest.toString().split("\r\n")[0]
            const path = firstLine.split(" ")[1]
            // socket.write writes into buffer (does not send immediately). when socket.end() is called or the function ends, the buffer is flushed to client as response
            if (path == "/") {
                socket.write(
                    [
                        "HTTP/1.1 200 OK",
                        "Content-Type: text/plain",
                        "",
                        "I KNOW THIS PATH",
                    ].join("\r\n")
                )
            } else {
                socket.write(
                    [
                        "HTTP/1.1 404 NOT FOUND",
                        "Content-Type: text/plain",
                        "",
                        "NOPE",
                    ].join("\r\n")
                )
            }
            socket.end();
            // http request is stateless. when the function close the buffer is flushed to client. client on recieving the data, close the connection. thus the server should also gracefully close it. else "connection closed while reading" error will appear on error event as server is still hoping to communicate.
        })
        socket.on("close", (hadError) => {
            // runs when the client connection is cut off
            if (hadError) {
                console.log("Error occured on the socket.")
            }
            closeCount++;
            console.log("client disconnected: ", closeCount)
        })
        socket.on("error", (err: Error) => {
            console.log("Error: ", err)
        })
    }
)

server.listen(() => {
    // assigns arbitarily a port
    console.log("Server listening on port", server.address())
})
