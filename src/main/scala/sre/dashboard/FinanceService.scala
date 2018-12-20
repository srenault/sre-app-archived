package sre.dashboard

import java.time.LocalDate
import io.circe.syntax._
import cats.data.Validated.{Invalid, Valid}
import cats.effect._
import org.http4s._
import finance._

class FinanceService[F[_]: Effect](icomptaClient: IComptaClient[F], settings: Settings) extends FinanceServiceDsl[F] {

  def computeExpensesByCategory(date: LocalDate): Option[Map[String, Option[Float]]] = {
    OfxStmTrn.load(settings.finance.ofxDirectory, date).map { transactions =>
      val records = icomptaClient.selectAll()
      val rulesAst = RulesAst.build(records)
      settings.finance.categories.mapValues { path =>
        rulesAst.traverse(path) map { ruleAst =>
          transactions.foldLeft(0F) { (acc, transaction) =>
            if (ruleAst.test(transaction)) {
              acc + transaction.amount
            } else {
              acc
            }
          }
        }
      }
    }
  }

  val service: HttpService[F] = {
    HttpService[F] {
      case GET -> Root / "expenses" :? DateQueryParamMatcher(maybeValidatedDate) =>
        maybeValidatedDate match {
          case Some(Invalid(e)) =>
            BadRequest()

          case Some(Valid(date)) =>
            computeExpensesByCategory(date) match {
              case Some(res) => Ok(res.asJson.noSpaces)
              case None => NotFound()
            }

          case None =>
            computeExpensesByCategory(LocalDate.now) match {
              case Some(res) => Ok(res.asJson.noSpaces)
              case None => NotFound()
            }
        }
    }
  }
}
