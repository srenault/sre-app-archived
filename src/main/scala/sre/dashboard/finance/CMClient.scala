package sre.dashboard.finance

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import fs2.Stream
import cats.implicits._
import cats.effect._
import cats.effect.concurrent.{ Ref, Deferred }
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.client._
import sre.dashboard.{ Settings, CMSettings }

case class CMClient[F[_]: ConcurrentEffect](httpClient: Client[F], settings: CMSettings, sessionRef: Ref[F, Option[Deferred[F, CMSession]]]) extends CMClientDsl[F] {

  private val FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy")

  def fetchDownloadForm(): F[CMDownloadForm] =
    CMDownloadFormCache.cached {
      withSession { session =>
        val uri  = settings.endpoint / "fr" / "banque" / "compte" / "telechargement.cgi"
        val request = AuthenticatedGET(uri, session)
        httpClient.expect[String](request).map { html =>
          val doc = org.jsoup.Jsoup.parse(html)
          CMDownloadForm.parseOrFail(doc)
        }
      }
    }

  def fetchBalance(accountId: String): F[Float] =
    CMBalanceCache.cached(accountId) {
      exportAsCSV(accountId).map { lines =>
        lines.lastOption.map(_.balance).getOrElse {
          sys.error(s"Unable to get balance for $accountId")
        }
      }
    }

  def listAccount(): F[List[CMAccount]] = {
    fetchDownloadForm().flatMap { downloadForm =>
      downloadForm.inputs.map { input =>
        fetchBalance(input.id).map { balance =>
          CMAccount(input, balance)
        }
      }.sequence
    }
  }

  def exportAsOfx(accountId: String, maybeStartDate: Option[LocalDate] = None, maybeEndDate: Option[LocalDate] = None): F[List[OfxStmTrn]] =
    withSession { session =>
      fetchDownloadForm().flatMap { downloadForm =>
        val action = settings.endpoint.withPath(downloadForm.action)
        val input = downloadForm.inputs.find(_.id == accountId) getOrElse {
          sys.error(s"Unknown account $accountId")
        }

        val startDate = maybeStartDate.map(_.format(FORMATTER)) getOrElse ""
        val endDate = maybeEndDate.map(_.format(FORMATTER)) getOrElse ""

        val data = UrlForm(
          "data_formats_selected" -> "ofx",
          "data_formats_options_ofx_fileformat" -> "ofx-format-m2003",
          "data_daterange_value" -> "1",
          "[t:dbt%3adate;]data_daterange_startdate_value" -> startDate,
          "[t:dbt%3adate;]data_daterange_enddate_value"-> endDate,
          input.checkName -> "on",
          "_FID_DoDownload.x" -> "0",
          "_FID_DoDownload.y" -> "0"
        )

        val request = AuthenticatedPOST(action, data, session)

        httpClient.expect[String](request).flatMap(OfxStmTrn.load(_))
      }
    }

  def exportAsCSV(accountId: String, maybeStartDate: Option[LocalDate] = None, maybeEndDate: Option[LocalDate] = None): F[List[CMCsvRecord]] =
    withSession { session =>
      fetchDownloadForm().flatMap { downloadForm =>
        val action = settings.endpoint.withPath(downloadForm.action)
        val input = downloadForm.inputs.find(_.id == accountId) getOrElse {
          sys.error(s"Unknown account $accountId")
        }

        val startDate = maybeStartDate.map(_.format(FORMATTER)) getOrElse ""
        val endDate = maybeEndDate.map(_.format(FORMATTER)) getOrElse ""

        val data = UrlForm(
          "data_formats_selected" -> "csv",
          "data_formats_options_csv_fileformat" -> "2",
          "data_formats_options_csv_dateformat" -> "0",
          "data_formats_options_csv_fieldseparator" -> "0",
          "data_formats_options_csv_amountcolnumber" -> "0",
          "data_formats_options_csv_decimalseparator" -> "1",
          "[t:dbt%3adate;]data_daterange_startdate_value" -> startDate,
          "[t:dbt%3adate;]data_daterange_enddate_value"-> endDate,
          input.checkName -> "on",
          "_FID_DoDownload.x" -> "0",
          "_FID_DoDownload.y" -> "0"
        )

        val request = AuthenticatedPOST(action, data, session)

        httpClient.expect[String](request).map { response =>
          println(response)
          val lines = response.split("\n").toList
          lines.tail.map(CMcsvLine.parseOrFail)
        }
      }
    }
}

object CMClient {

  def stream[F[_]: ConcurrentEffect](httpClient: Client[F], settings: Settings)(implicit F: Effect[F]): Stream[F, CMClient[F]] = {
    val client = for {
      d <- Deferred[F, CMSession]
      sessionRef <- Ref.of[F, Option[Deferred[F, CMSession]]](None)
    } yield {
      CMClient[F](httpClient, settings.finance.cm, sessionRef)
    }
    Stream.eval(client)
  }
}
