package sre.dashboard.transport.train

import java.time.format.DateTimeFormatter
import java.time.ZonedDateTime
import cats.effect._
import cats.effect.concurrent.{ Ref, Deferred }
import cats.implicits._
import io.circe._
import io.circe.literal._
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.circe._
import org.http4s.client._
import org.http4s.client.dsl.Http4sClientDsl
import org.http4s.headers._
import org.http4s.MediaType._
import fs2.Stream

import sre.dashboard.Settings

class TrainClient[F[_]: ConcurrentEffect](httpClient: Client[F], endpoint: Uri, authInfoRef: Ref[F, Option[Deferred[F, AuthResponse]]])(implicit F: Sync[F]) extends TrainClientDsl[F] {

  def authenticate(): F[AuthResponse] = {
    val body = json"""
      {
        "anonymousUser": true,
        "deviceIdentifier": "10e7b74c-13b9-44a0-9695-929f15f47532",
        "devicePlatform": "xena",
        "deviceType": "ANDROID",
        "login": "10e7b74c-13b9-44a0-9695-929f15f47532",
        "password": "59f2c132-cb07-425f-b105-9ca391929080"
      }"""

    val request = POST(endpoint / "authenticate", body)
    httpClient.expect[AuthResponse](request)
  }

  def searchStations(term: String): F[List[Station]] = withAuthInfo { authInfo =>
    val uri = (endpoint / "autocomplete" / "stations").withQueryParam("q", term)
    val request = AuthenticatedGET(uri, authInfo)
    httpClient.expect[Json](request).map { response =>
      response.hcursor.downField("locations").as[List[Station]] match {
        case Left(e) => throw e
        case Right(stations) => stations
      }
    }
  }

  def searchStation(term: String): F[Option[Station]] =
    searchStations(term).map(_.headOption)

  def nextDepartures(stationId: String): F[NextDepartures] = withAuthInfo { authInfo =>
    val uri = (endpoint / "station" / "trainBoards").withQueryParam("stationUIC", stationId)
    val request = AuthenticatedGET(uri, authInfo)
    httpClient.expect[Json](request).map { response =>
      response.hcursor.downField("gl").downField("arrivals").as[NextDepartures] match {
        case Left(e) => throw e
        case Right(departures) => departures
      }
    }
  }

  def searchItineraries(stationA: Station, stationB: Station, date: ZonedDateTime): F[List[Itinerary]] =
    withAuthInfo { authInfo =>
      val uri = (endpoint / "itinerary" / "search")
      val dateTimeFormatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZ")
      val formattedDate = date.format(dateTimeFormatter)
      val body = json"""
        {
          "date": $formattedDate,
          "origin": $stationA,
          "destination": $stationB,
          "searchType": "DEPARTURE",
          "directItinerary": true,
          "exclusions": [],
          "filteredTransportTypes": [],
          "includedTransportTypes": [],
          "trainStationExclusion": null,
          "urbanStationExclusions": [],
          "via": null
        }"""

      val request = AuthenticatedPOST(uri, body, authInfo)
      httpClient.expect[Json](request).map { response =>
        response.hcursor.downField("itineraries").as[List[Itinerary]] match {
          case Left(e) => throw e
          case Right(itineraries) => itineraries
        }
      }
    }

  def refreshAuthInfo(): F[AuthResponse] = {
    for {
      d <- Deferred[F, AuthResponse]
      _ <- authInfoRef.set(Some(d))
      authInfo <- authenticate()
      _ <- d.complete(authInfo)
    } yield authInfo
  }

  def withAuthInfo[A](f: AuthResponse => F[A]): F[A] = {
    (for {
      maybeAuthInfo <- authInfoRef.get
      authInfo <- maybeAuthInfo match {
        case Some(deferredAuthInfo) =>
          deferredAuthInfo.get
        case None => refreshAuthInfo()
      }
      res <- f(authInfo).recoverWith {
        case UnexpectedStatus(status) if status == 401 =>
          refreshAuthInfo().flatMap(f)
      }
    } yield res)
  }
}

object TrainClient {

  def stream[F[_]: ConcurrentEffect](httpClient: Client[F], settings: Settings): Stream[F, TrainClient[F]] = {
    val client = for {
      d <- Deferred[F, AuthResponse]
      authInfoRef <- Ref.of[F, Option[Deferred[F, AuthResponse]]](None)
    } yield {
      new TrainClient[F](httpClient, settings.transport.train.endpoint, authInfoRef)
    }
    Stream.eval(client)
  }
}
