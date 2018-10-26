package sre.dashboard.transport.train

import cats._
import cats.effect._
import cats.implicits._
import io.circe._
import io.circe.literal._
import io.circe.syntax._
import org.http4s._
import org.http4s.headers._
import org.http4s.dsl.io._
import org.http4s.client._
import org.http4s.client.dsl.Http4sClientDsl
import sre.dashboard.Settings
import sre.dashboard.utils.Security

trait TrainClientDsl[F[_]] extends Http4sClientDsl[F] {

  val USER_AGENT_HEADER = Header("User-Agent", "SncfFusion Android")

  val CONTENT_TYPE_HEADER = Header("Content-Type", "application/json")

  val DEFAULT_HEADERS = USER_AGENT_HEADER :: CONTENT_TYPE_HEADER :: Nil

  def AuthenticatedPOST[A](uri: Uri, body: A, authInfo: AuthResponse, headers: Header*)(implicit F: Monad[F], jsonEncoder: Encoder[A], w: EntityEncoder[F, A]): F[Request[F]] = {
    val bodyAsString = body.asJson.noSpaces
    val authHeader = buildAuthHeader(uri, POST, Some(bodyAsString), authInfo)
    POST(uri, body, authHeader +: DEFAULT_HEADERS ++: headers:_*)
  }

  def AuthenticatedGET(uri: Uri, authInfo: AuthResponse, headers: Header*)(implicit F: Monad[F]): F[Request[F]] = {
    val authHeader = buildAuthHeader(uri, GET, body = None, authInfo)
    GET(uri, authHeader +: headers:_*)
  }

  private def buildAuthHeader[A](uri: Uri, method: Method, body: Option[String], authInfo: AuthResponse): Header = {
    val token = authInfo.token
    val secret = authInfo.secret
    val data = body getOrElse ""
    val signedRequest = Security.sha1(s"${uri.renderString}:${method.name}:$data")
    val timestamp = System.currentTimeMillis / 1000
    val nonce = java.util.UUID.randomUUID().toString()
    val signature = Security.hmacSha256(s"appun:$token:$secret:$timestamp:$nonce:$signedRequest", secret)
    val value = Map(
      "Mac id" -> token,
      "ts" -> timestamp,
      "nonce" -> nonce,
      "mac" -> signature
    ).map { case (name, value) => s"""$name="$value"""" }.mkString(", ")
    Header("Authorization", value)
  }
}
