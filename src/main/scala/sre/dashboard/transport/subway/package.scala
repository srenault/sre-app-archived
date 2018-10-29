package sre.dashboard.transport

import cats.effect._
import org.http4s.{ EntityDecoder, EntityEncoder }
import io.circe._
import io.circe.literal._
import io.circe.{ Decoder, Encoder }
import io.circe.generic.semiauto._
import org.http4s.circe._
import org.http4s.dsl.io._

package object subway {

  object Stops {
    val PARIS_MONTPARNASSE = "1824-1825-1826-1827-2363-2364-2365-2366"
    val PARMENTIER = "1779-2389"
  }

  case class NextDeparture(arrivalTimes: List[String], direction: String, line: String)

  implicit val NextDeparturesEncoder: Encoder[NextDeparture] = deriveEncoder[NextDeparture]

  implicit val NextDeparturesDecoder: Decoder[NextDeparture] = deriveDecoder[NextDeparture]

  implicit def nextDepartureEncoder[F[_]: Effect]: EntityEncoder[F, NextDeparture] = jsonEncoderOf[F, NextDeparture]

  implicit def nextDeparturesEncoder[F[_]: Effect]: EntityEncoder[F, List[NextDeparture]] = jsonEncoderOf[F, List[NextDeparture]]

  implicit def nextDepartureDecoder[F[_]: Effect]: EntityDecoder[F, NextDeparture] = jsonOf[F, NextDeparture]
}
