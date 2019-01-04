package sre.dashboard

import java.time.LocalDate
import io.circe.syntax._
import cats.data.OptionT
import cats.data.Validated.{Invalid, Valid}
import cats.effect._
import cats.implicits._
import org.http4s._
import finance._

class FinanceService[F[_]: Effect](icomptaClient: IComptaClient[F], settings: Settings) extends FinanceServiceDsl[F] {

  def computeExpensesByCategory(date: LocalDate): OptionT[F, Map[String, Option[Float]]] = {
    OfxStmTrn.load(settings.finance.ofxDirectory, date).flatMap { transactions =>
      OptionT.liftF(icomptaClient.selectAll().map { records =>
        val rulesAst = RulesAst.build(records)
        settings.finance.categories.mapValues { path =>
          rulesAst.traverse(path) map { ruleAst =>
            transactions.foldLeft(0F) { (acc, transaction) =>
              if (ruleAst.test(transaction)) {
                acc + scala.math.abs(transaction.amount)
              } else {
                acc
              }
            }
          }
        }
      })
    }
  }

  val service: HttpService[F] = {
    HttpService[F] {
      case GET -> Root / "expenses" :? DateQueryParamMatcher(maybeValidatedDate) =>
        val date = maybeValidatedDate match {
          case Some(Invalid(e)) =>
            Left(e)

          case Some(Valid(date)) =>
            Right(date)

          case None => // fallback
            Right(LocalDate.now)
        }

        date match {
          case Left(_) =>
            BadRequest()

          case Right(date) =>
            computeExpensesByCategory(date).value.flatMap {
              case Some(res) => Ok(res.asJson.noSpaces)
              case None => NotFound()
            }
        }
    }
  }
}
