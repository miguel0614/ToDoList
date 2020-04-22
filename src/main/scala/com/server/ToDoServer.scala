package main.scala.com.server
import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import com.corundumstudio.socketio.listener.{ConnectListener, DataListener, DisconnectListener}
import com.corundumstudio.socketio.{AckRequest, Configuration, SocketIOClient, SocketIOServer}
import main.scala.com.server.listeners._

import scala.collection.mutable.ListBuffer


class ToDoServer {

  val config: Configuration = new Configuration {
    setHostname("localhost")
    setPort(8080)
  }
  var userData: Map[String, Map[String, (String, List[(String,Boolean)])]] = Map()
  var registeredUser: Map[String, String] = Map()
  var userToSocket: Map[String, SocketIOClient] = Map()
  var socketToUser: Map[SocketIOClient, String] = Map()
  var actorToSocket: Map[ActorRef, SocketIOClient] = Map()
  var socketToActor: Map[SocketIOClient, ActorRef] = Map()
  val userActors: ActorSystem = ActorSystem()

  val toDoServer: SocketIOServer = new SocketIOServer(config)

  toDoServer.addConnectListener(new ConnectionListener)
  toDoServer.addDisconnectListener(new DisconnectionListener)
  toDoServer.addEventListener("login", classOf[String], new LoginListener(this))
  toDoServer.addEventListener("createList", classOf[String], new CreateListListener(this))
  toDoServer.addEventListener("deleteList", classOf[String], new DeleteListListener(this))
  toDoServer.addEventListener("renameList", classOf[String], new RenameListListener(this))
  toDoServer.addEventListener("addItem", classOf[String], new AddItemListener(this))
  toDoServer.addEventListener("deleteItem", classOf[String], new DeleteItemListener(this))
  toDoServer.addEventListener("completeItem", classOf[String], new CompleteItemListener(this))

  toDoServer.start()


}

object ToDoServer {
  def main(args: Array[String]): Unit = {
    new ToDoServer
  }
}
