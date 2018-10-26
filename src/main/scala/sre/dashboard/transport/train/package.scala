package sre.dashboard.transport

import cats.effect._
import org.http4s.{ EntityDecoder, EntityEncoder }
import io.circe._
import io.circe.literal._
import io.circe.{ Decoder, Encoder }
import io.circe.generic.semiauto._
import org.http4s.circe._
import org.http4s.dsl.io._

package object train {

  case class AuthResponse(token: String, secret: String)
  object AuthResponse {

    implicit val AuthResponseEncoder: Encoder[AuthResponse] = deriveEncoder[AuthResponse]

    implicit val AuthResponseDecoder: Decoder[AuthResponse] = deriveDecoder[AuthResponse]

    implicit def authResponseEncoder[F[_]: Effect]: EntityEncoder[F, AuthResponse] = jsonEncoderOf[F, AuthResponse]

    implicit def authResponseDecoder[F[_]: Effect]: EntityDecoder[F, AuthResponse] = jsonOf[F, AuthResponse]
  }

  case class Station(
    id: String,
    uic: String,
    label: String,
    longitude: Double,
    latitude: Double,
    `type`: String
  )
  object Station {

    implicit val StationEncoder: Encoder[Station] = new Encoder[Station] {
      final def apply(station: Station): Json = {
        val encoder = deriveEncoder[Station]
        encoder(station).deepMerge(json"""
          {
            "country": null,
            "departmentCode": null,
            "shortLabel": null
          }"""
        )
      }
    }

    implicit val StationDecoder: Decoder[Station] = deriveDecoder[Station]

    implicit def stationEncoder[F[_]: Effect]: EntityEncoder[F, Station] = jsonEncoderOf[F, Station]

    implicit def stationsEncoder[F[_]: Effect]: EntityEncoder[F, List[Station]] = jsonEncoderOf[F, List[Station]]

    implicit def stationDecoder[F[_]: Effect]: EntityDecoder[F, Station] = jsonOf[F, Station]
  }

  case class Itinerary(itinerarySteps: List[ItineraryStep])
  object Itinerary {
    import io.circe.generic.auto._

    implicit val ItineraryEncoder: Encoder[Itinerary] = deriveEncoder[Itinerary]

    implicit val ItineraryDecoder: Decoder[Itinerary] = deriveDecoder[Itinerary]

    implicit def stationEncoder[F[_]: Effect]: EntityEncoder[F, Itinerary] = jsonEncoderOf[F, Itinerary]

    implicit def stationsEncoder[F[_]: Effect]: EntityEncoder[F, List[Itinerary]] = jsonEncoderOf[F, List[Itinerary]]

    implicit def stationDecoder[F[_]: Effect]: EntityDecoder[F, Itinerary] = jsonOf[F, Itinerary]
  }

  case class ItineraryStep(arrivalDate: String, departureDate: String, duration: Int, stops: List[Stop], cancelled: Boolean, disruptionsList: List[StopDisruption])
  case class Stop(
    departureDate: Option[String],
    arrivalDate: Option[String],
    longitude: Double,
    latitude: Double,
    stationLabel: String,
    stationUic: String
  )

  case class NextDepartures(disruptions: List[LineDisruption], board: List[NextDeparture])
  object NextDepartures {
    import io.circe.generic.auto._

    implicit val NextDeparturessEncoder: Encoder[NextDepartures] = deriveEncoder[NextDepartures]

    implicit val NextDeparturessDecoder: Decoder[NextDepartures] = deriveDecoder[NextDepartures]

    implicit def stationEncoder[F[_]: Effect]: EntityEncoder[F, NextDepartures] = jsonEncoderOf[F, NextDepartures]

    implicit def stationsEncoder[F[_]: Effect]: EntityEncoder[F, List[NextDepartures]] = jsonEncoderOf[F, List[NextDepartures]]

    implicit def stationDecoder[F[_]: Effect]: EntityDecoder[F, NextDepartures] = jsonOf[F, NextDepartures]
  }

  case class NextDeparture(
    destinationStationName: String,
    actualTrainDate: Option[String],
    trainDate: String,
    disruptions: Option[List[StopDisruption]]
  )

  case class StopDisruption(scope: String, `type`: String, description: String)

  case class LineDisruption(`type`: String, description: String)


}
