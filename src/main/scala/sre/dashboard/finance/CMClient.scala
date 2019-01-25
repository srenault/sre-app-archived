package sre.dashboard.finance

import cats.effect._
import cats.effect.concurrent.{ Ref, Deferred }
import org.http4s.{ Uri, UrlForm, Response }
import org.http4s.dsl.io._
import org.http4s.client._
import org.http4s.client.dsl.Http4sClientDsl

case class Session()

case class CMClient[F[_]: ConcurrentEffect](httpClient: Client[F], sessionRef: Ref[F, Option[Deferred[F, Session]]]) extends Http4sClientDsl[F] {

  val baseURI: Uri = Uri.unsafeFromString("https://www.creditmutuel.fr")

  def authenticate()(implicit F: Effect[F]): F[Session] = {
    val endpoint = baseURI / "fr/authentification.html"
    val body = UrlForm("_cm_user" -> "701331901210", "_cm_pwd" -> "445453", "flag" -> "password")
    val request = POST(endpoint, body)
    httpClient.fetch(request) { response =>
      ???
    }
    ???
  }
}
