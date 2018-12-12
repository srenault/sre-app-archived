package sre.dashboard.finance

import cats.effect._
import fs2.Stream
import java.sql.{ DriverManager, Connection }
import anorm._
import sre.dashboard.Settings

case class IComptaClient[F[_]: ConcurrentEffect](implicit connection: Connection) {

  def selectRules() = {
    SQL"SELECT * FROM LARule".as(RuleRecord.parser.*)
  }

  def selectConditions() = {
    SQL"SELECT * FROM LACondition".as(ConditionRecord.parser.*)
  }

  def selectParameters() = {
    SQL"SELECT * FROM LAParameter".as(ParameterRecord.parser.*)
  }

  def selectAll() = {
    val rules = selectRules()
    val conditions = selectConditions()
    val parameters = selectParameters()

    Records(rules, conditions, parameters)
  }
}

object IComptaClient {

  def stream[F[_]: ConcurrentEffect](settings: Settings)(implicit F: Effect[F]): Stream[F, IComptaClient[F]] = {
    Class.forName("org.sqlite.JDBC")
    implicit val connection = DriverManager.getConnection(settings.finance.db)
    Stream.eval(F.pure(IComptaClient()))
  }
}
