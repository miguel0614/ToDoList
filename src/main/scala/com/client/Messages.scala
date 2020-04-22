package main.scala.com.client

case class CreateList(listInfo: String)

case class DeleteList(listNumber: String)

case class RenameList(listInfo: String)

case class AddItem(listInfo: String)

case class DeleteItem(listInfo: String)

case class CompleteItem(listInfo: String)
