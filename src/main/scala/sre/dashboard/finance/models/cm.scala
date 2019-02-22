package sre.dashboard.finance

import java.time.LocalDate
import org.http4s._
import org.http4s.headers._
import scala.collection.JavaConverters._

case class CMSession(cookie: ResponseCookie) {
  def toRequestCookie: Cookie = {
    Cookie(RequestCookie(cookie.name, cookie.content))
  }
}

case class CMDownloadForm(action: String, inputs: List[CMAccountInput])

object CMDownloadForm {

  def parseOrFail(doc: org.jsoup.nodes.Document): CMDownloadForm = {
    val form = doc.select("""[id="P:F"]""").asScala.headOption getOrElse sys.error("Unable to get download form")
    val action = Option(form.attributes.get("action")) getOrElse sys.error("Unable to get action")
    val inputs = CMAccountInput.parseOrFail(doc)
    CMDownloadForm(action, inputs)
  }
}

case class CMAccountInput(id: String, label: String, checkId: String, checkName: String)

object CMAccountInput {

  def parseOrFail(doc: org.jsoup.nodes.Document): List[CMAccountInput] = {
    doc.select("#account-table label").asScala.map { domLabel =>
      val label = domLabel.text
      val id = label.split(" ").take(3).mkString("")
      val checkId = Option(domLabel.attributes.get("for")) getOrElse sys.error("Unable to get checkId")
      val check = doc.select(s"""[id="$checkId"]""").asScala.headOption getOrElse sys.error(s"Unable to get check $checkId")
      val checkName = Option(check.attributes.get("name")) getOrElse sys.error("Unable to get checkName")
      CMAccountInput(id, label, checkId, checkName)
    }.toList
  }
}

case class CMAccount(id: String, label: String, balance: Float)
object CMAccount {

  def apply(input: CMAccountInput, balance: Float): CMAccount =
    CMAccount(input, balance)
}

case class CMCsvRecord(
  date: LocalDate,
  dateValue: LocalDate,
  amount: Float,
  label: String,
  balance: Float
)

object CMcsvLine {
  import java.time.format.DateTimeFormatterBuilder

  private val format = new DateTimeFormatterBuilder()
    .appendPattern("dd/MM/yyyy")
    .toFormatter();

  private def parseDateOrFail(s: String): LocalDate =
    LocalDate.parse(s, format)

  def parseOrFail(line: String): CMCsvRecord = {
    line.split(";").toList match {
      case dateStr :: valueDateStr :: amount :: label :: balance :: Nil =>
        val date = parseDateOrFail(dateStr)
        val valueDate = parseDateOrFail(valueDateStr)
        CMCsvRecord(date, valueDate, amount.toFloat, label, balance.toFloat)

      case _ =>
        sys.error(s"Unable to parse $line as CMCsvLine")
    }
  }
}
