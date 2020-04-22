package main.scala.com.server.listeners

import akka.actor.{ActorRef, Props}
import com.corundumstudio.socketio.{AckRequest, SocketIOClient}
import com.corundumstudio.socketio.listener.{ConnectListener, DataListener, DisconnectListener}
import main.scala.com.client.{AddItem, CompleteItem, CreateList, DeleteItem, DeleteList, RenameList, UserActor}
import main.scala.com.server.ToDoServer
import play.api.libs.json.{JsValue, Json}


class AddItemListener(server: ToDoServer) extends DataListener[String]{
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = server.socketToActor(client) ! AddItem(data)
}

class CompleteItemListener(server: ToDoServer) extends DataListener[String] {
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = server.socketToActor(client) ! CompleteItem(data)
}

class ConnectionListener() extends ConnectListener() {
  override def onConnect(client: SocketIOClient): Unit = {
    println("New Connection: " + client)
    client.sendEvent("login")
  }
}


class CreateListListener(server: ToDoServer) extends DataListener[String]{
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = server.socketToActor(client) ! CreateList(data)
}


class DeleteItemListener(server: ToDoServer) extends DataListener[String]{
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = server.socketToActor(client) ! DeleteItem(data)
}


class DeleteListListener(server: ToDoServer) extends DataListener[String]{
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = server.socketToActor(client) ! DeleteList(data)
}

class RenameListListener(server: ToDoServer) extends DataListener[String]{
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = server.socketToActor(client) ! RenameList(data)
}

class DisconnectionListener extends DisconnectListener{
  override def onDisconnect(client: SocketIOClient): Unit = {
    println("Client Disconnected: " + client)
  }
}


class LoginListener(server: ToDoServer) extends DataListener[String]{
  override def onData(client: SocketIOClient, data: String, ackSender: AckRequest): Unit = {
    val parsed: JsValue = Json.parse(data)
    val username: String = parsed("user").as[String].toLowerCase()
    val password: String = parsed("pass").as[String]
    val newUser: Boolean = parsed("newUser").as[Boolean]
    if (newUser){
    if (server.registeredUser.contains(username)) client.sendEvent("failure")
    else {
      val newUserActor: ActorRef = server.userActors.actorOf(Props(classOf[UserActor], server, username))
      server.registeredUser += (username -> password)
      server.socketToUser += (client -> username)
      server.socketToActor += (client -> newUserActor)
      client.sendEvent("success")
      println("New User Registered: " + username)
      }
    }
    else {
      if (server.registeredUser.contains(username)) {
        if (server.registeredUser(username) == password) client.sendEvent("success")
        else client.sendEvent("failure")
      }
      else client.sendEvent("failure")
    }
  }
}
