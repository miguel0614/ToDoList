package main.scala.com.server
import java.sql.{Connection, DriverManager, PreparedStatement, ResultSet, Statement}

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import com.corundumstudio.socketio.{AckRequest, Configuration, SocketIOClient, SocketIOServer}
import main.scala.com.client.{Register, Update}
import main.scala.com.server.listeners._
import play.api.libs.json.Json

class ToDoServer extends Actor {
  val driver = "com.mysql.jdbc.Driver"
  val url = "jdbc:mysql://localhost/todolist"
  val username = "root"
  val password = "todolist"
  var connection: Connection = DriverManager.getConnection(url, username, password)



  val config: Configuration = new Configuration {
    setHostname("localhost")
    setPort(8080)
  }

  var userData: Map[String, Map[String, (String, List[(String,Boolean)])]] = Map()
  var registeredUser: Map[String, String] = Map()

  var socketToUser: Map[SocketIOClient, String] = Map()
  var actorToSocket: Map[ActorRef, SocketIOClient] = Map()
  var socketToActor: Map[SocketIOClient, ActorRef] = Map()
  var userToActor: Map[String, List[ActorRef]] = Map()
  var userToSocket: Map[String, List[SocketIOClient]] = Map()


  val userActors: ActorSystem = ActorSystem()

  val toDoServer: SocketIOServer = new SocketIOServer(config)

  toDoServer.addConnectListener(new ConnectionListener)
  toDoServer.addDisconnectListener(new DisconnectionListener(this))
  toDoServer.addEventListener("login", classOf[String], new LoginListener(this))
  toDoServer.addEventListener("createList", classOf[String], new CreateListListener(this))
  toDoServer.addEventListener("deleteList", classOf[String], new DeleteListListener(this))
  toDoServer.addEventListener("renameList", classOf[String], new RenameListListener(this))
  toDoServer.addEventListener("addItem", classOf[String], new AddItemListener(this))
  toDoServer.addEventListener("deleteItem", classOf[String], new DeleteItemListener(this))
  toDoServer.addEventListener("completeItem", classOf[String], new CompleteItemListener(this))

  toDoServer.start()
  initializeData()

  def initializeData(): Unit ={
    val loginInformation: ResultSet = connection.createStatement().executeQuery("SELECT * FROM users")
    val todoLists: ResultSet = connection.createStatement().executeQuery("SELECT * FROM todolists")
    while (loginInformation.next()) {
      val username: String = loginInformation.getString("username")
      val password: String = loginInformation.getString("password")
      registeredUser += (username -> password)

    }

    while (todoLists.next()){
      val username: String = todoLists.getString("username")
      val todoList: Map[String, (String, List[(String,Boolean)])] = Json.parse(todoLists.getString("todolist")).as[Map[String, (String, List[(String,Boolean)])]]
      userData += (username -> todoList)
    }
  }

  override def receive: Receive = {

    case data: Register =>
      connection.createStatement().execute("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)")
      val registerStatement: PreparedStatement = connection.prepareStatement("INSERT INTO users VALUE (?,?)")
      registerStatement.setString(1,data.username)
      registerStatement.setString(2, data.password)
      registerStatement.execute()

    case data: Update =>
      for ((key,value) <- data.userInfo) {
        userData += (key -> value)
        for (actor <- userToActor(key)) actor ! Update(data.userInfo)
        for (socket <- userToSocket(key)) socket.sendEvent("update", Json.stringify(Json.toJson(value)))
        connection.createStatement().execute("CREATE TABLE IF NOT EXISTS todolists (username TEXT, todolist TEXT)")
        val updateStatement: PreparedStatement = connection.prepareStatement("REPLACE INTO todolists VALUE (?,?)")
        updateStatement.setString(1,key)
        updateStatement.setString(2,Json.stringify(Json.toJson(value)))
        updateStatement.execute()
      }
  }
}

object ToDoServer {
  def main(args: Array[String]): Unit = {
  val serverActorSystem: ActorSystem = ActorSystem()
  val serverActor: ActorRef = serverActorSystem.actorOf(Props(classOf[ToDoServer]))
  }
}
