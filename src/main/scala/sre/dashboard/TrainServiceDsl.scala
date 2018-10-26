package sre.dashboard

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import org.http4s._
import org.http4s.dsl.Http4sDsl
import cats.implicits._

trait TrainServiceDsl[F[_]] extends Http4sDsl[F] {

  implicit val dateQueryParamDecoder: QueryParamDecoder[Option[ZonedDateTime]] =
    QueryParamDecoder[String].map { dateStr =>
      scala.util.Try {
        ZonedDateTime.parse(dateStr, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
      }.toOption
    }

  object DateQueryParamMatcher extends QueryParamDecoderMatcher[Option[ZonedDateTime]]("date")
}
