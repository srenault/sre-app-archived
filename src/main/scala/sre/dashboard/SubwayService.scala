package sre.dashboard

import cats.effect._
import cats.implicits._
import cats.syntax.parallel._
import org.http4s.HttpService
import org.http4s.dsl.Http4sDsl
import java.time.ZonedDateTime

import transport.subway._

class SubwayService[F[_]: Effect](subwayClient: SubwayClient[F], settings: Settings) extends TrainServiceDsl[F] {
  val service: HttpService[F] = {
    HttpService[F] {
      case GET -> Root / "stops" / stopId / "departures" =>
        subwayClient.nextDepartures(stopId).flatMap { nextDepartures =>
          Ok(nextDepartures)
        }
    }
  }
}
