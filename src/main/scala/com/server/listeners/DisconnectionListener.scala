package main.scala.com.server.listeners

import com.corundumstudio.socketio.SocketIOClient
import com.corundumstudio.socketio.listener.DisconnectListener

class DisconnectionListener extends DisconnectListener{
  override def onDisconnect(client: SocketIOClient): Unit = {
    println("Client Disconnected: " + client)
  }
}
