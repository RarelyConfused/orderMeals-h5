const url = 'ws://localhost:8082/clientSocket/'
export let socketClient = {
    socket: '',
    init: (did) => {
        socketClient.socket = new WebSocket(url + did)
        socketClient.socket.onopen = () => {
            console.log('与服务器链接成功')
        }
        socketClient.socket.onmessage = (msg) => {
            console.log('收到消息：' + msg.data)
        }
    }
}
