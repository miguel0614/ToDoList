package main.scala.com.server.listeners

import com.corundumstudio.socketio.{SocketIOClient, SocketIOServer}
import com.corundumstudio.socketio.listener.ConnectListener

class ConnectionListener() extends ConnectListener() {
  override def onConnect(client: SocketIOClient): Unit = {
    println("New Connection: " + client)
  }
}
