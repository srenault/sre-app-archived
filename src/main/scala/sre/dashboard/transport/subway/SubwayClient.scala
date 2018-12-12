package sre.dashboard.transport.subway

import cats.effect._
import cats.implicits._
import io.circe._
import io.circe.literal._
import org.http4s.circe._
import org.http4s.client.dsl.Http4sClientDsl

import sre.dashboard.transport.train._

case class SubwayClient[F[_]: ConcurrentEffect](trainClient: TrainClient[F]) extends Http4sClientDsl[F] {

  def nextDepartures(stopId: String): F[List[NextDeparture]] = trainClient.withAuthInfo { authInfo =>
    val uri = (trainClient.endpoint / "ratp" / "nextDepartures").withQueryParam("stopId", stopId)
    val request = trainClient.AuthenticatedGET(uri, authInfo)
    trainClient.httpClient.expect[Json](request).map { response =>
      response.hcursor.downField("nextDepartures").as[List[NextDeparture]] match {
        case Left(e) => throw e
        case Right(departures) => departures
      }
    }
  }
}
