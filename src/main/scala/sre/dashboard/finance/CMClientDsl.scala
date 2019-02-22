package sre.dashboard.finance

import cats._
import cats.effect._
import cats.implicits._
import cats.effect.concurrent.{ Ref, Deferred }
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.client._
import org.http4s.client.dsl.Http4sClientDsl
import sre.dashboard.CMSettings

trait CMClientDsl[F[_]] extends Http4sClientDsl[F] {

  def httpClient: Client[F]

  def settings: CMSettings

  def sessionRef: Ref[F, Option[Deferred[F, CMSession]]]

  def login()(implicit F: Effect[F]): F[CMSession] = {
    val endpoint = settings.endpoint / "fr" / "authentification.html"

    val body = UrlForm(
      "_cm_user" -> settings.username,
      "_cm_pwd" -> settings.password,
      "flag" -> "password"
    )

    val request = POST(endpoint, body)

    httpClient.fetch(request) { response =>
      val cookie = response.cookies.find(_.name == "IdSes") getOrElse sys.error("Unable to get cm session")
      val location = response.headers.get(headers.Location) getOrElse sys.error("Unable to get login")
      println(location)
      val redirectUri = GET(location.uri, CMSession(cookie).toRequestCookie)

      httpClient.fetch(redirectUri) { response =>
        F.pure(CMSession(cookie))
      }
    }
  }

  def refreshSession()(implicit F: ConcurrentEffect[F]): F[CMSession] = {
    for {
      d <- Deferred[F, CMSession]
      _ <- sessionRef.set(Some(d))
      session <- login()
      _ <- d.complete(session)
    } yield session
  }

  def withSession[A](f: CMSession => F[A])(implicit F: ConcurrentEffect[F]): F[A] = {
    for {
      maybeSession <- sessionRef.get
      session <- maybeSession match {
        case Some(deferredSession) => deferredSession.get
        case None => refreshSession()
      }
      res <- f(session).recoverWith { //TODO
        case UnexpectedStatus(Status.Found) =>
          refreshSession().flatMap(f)
      }
    } yield res
  }

  def AuthenticatedGET(uri: Uri, session: CMSession)(implicit F: Monad[F]): F[Request[F]] = {
    GET(uri, session.toRequestCookie)
  }

  def AuthenticatedPOST(uri: Uri, data: UrlForm, session: CMSession)(implicit F: Monad[F]): F[Request[F]] = {
    POST(uri, data, session.toRequestCookie)
  }
}
