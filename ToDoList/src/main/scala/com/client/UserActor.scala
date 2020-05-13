package main.scala.com.client
import akka.actor.{Actor, ActorRef}
import play.api.libs.json.{JsValue, Json}


class UserActor(username: String, server: ActorRef, data: Map[String, (String, List[(String,Boolean)])]) extends  Actor {

  var toDoLists: Map[String, (String, List[(String,Boolean)])] = Map()
  toDoLists = data

  override def receive: Receive = {

    case data: CreateList =>
      val parsed:JsValue = Json.parse(data.listInfo)
      val listNumber: String = parsed("listNumber").as[Int].toString
      val listName: String = parsed("listName").as[String]
      toDoLists += (listNumber -> (listName, List()))
      println("List Created: " + toDoLists(listNumber))
      server ! Update(Map(username -> toDoLists))
      println(toDoLists)

    case data: DeleteList =>
      println("List Deleted: " + toDoLists(data.listNumber))
      toDoLists -= data.listNumber
      orderListNumbers()
      server ! Update(Map(username -> toDoLists))

    case data: RenameList =>
      val parsed: JsValue = Json.parse(data.listInfo)
      val listNumber: String = parsed("listNumber").toString
      val newName: String = parsed("newName").as[String]
      toDoLists += (listNumber -> (newName, toDoLists(listNumber)._2))
      server ! Update(Map(username -> toDoLists))

    case data: AddItem =>
      val parsed: JsValue = Json.parse(data.listInfo)
      val listNumber: String = parsed("listNumber").as[Int].toString
      val value: String = parsed("value").as[String]
      toDoLists +=  (listNumber -> (toDoLists(listNumber)._1, toDoLists(listNumber)._2 :+ (value, false)))
      println(toDoLists)
      server ! Update(Map(username -> toDoLists))

    case data: DeleteItem =>
      val parsed: JsValue = Json.parse(data.listInfo)
      val listNumber: String = parsed("listNumber").as[Int].toString
      val value: String = parsed("value").as[String]
      val itemSet: (String, List[(String, Boolean)]) = toDoLists(listNumber)
      toDoLists += (listNumber -> (itemSet._1, dropFirstMatch(itemSet._2, value)))
      server ! Update(Map(username -> toDoLists))

    case data: CompleteItem =>
      val parsed: JsValue = Json.parse(data.listInfo)
      val listNumber: String = parsed("listNumber").as[Int].toString
      val value: String = parsed("value").as[String]
      val itemSet: (String, List[(String, Boolean)]) = toDoLists(listNumber)
      val indexToChange: Int = itemSet._2.indexWhere(_._1 == value)
      toDoLists += (listNumber -> (itemSet._1, itemSet._2.updated(indexToChange,(itemSet._2(indexToChange)._1,! itemSet._2(indexToChange)._2))))
      server ! Update(Map(username -> toDoLists))

      case data: Update => toDoLists = data.userInfo(username)
  }

  def dropFirstMatch[A](ls: List[(String, Boolean)], value: String): List[(String, Boolean)] = {
    val index = ls.indexWhere(_._1 == value)
    if (index < 0) {
      ls
    } else if (index == 0) {
      ls.tail
    } else {
      val (a, b) = ls.splitAt(index)
      a ++ b.tail
    }
  }

  def orderListNumbers(): Unit ={
    var reorder: Map[String, (String, List[(String,Boolean)])] = Map()
    for ((key, value) <- toDoLists) reorder += (reorder.size.toString -> value)
    toDoLists = reorder
  }

}
