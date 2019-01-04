package sre.dashboard

import java.io.File
import org.http4s.Uri
import io.circe._
import io.circe.generic.auto._
import io.circe.config.syntax._

case class TrainSettings(endpoint: Uri)

case class TransportSettings(train: TrainSettings)

case class FinanceSettings(db: String, ofxDirectory: File, categories: Map[String, List[String]])

case class Settings(transport: TransportSettings, finance: FinanceSettings)

object Settings {

  val CONFIG_FILE_NAME = "app.conf"

  lazy val AppConfig: com.typesafe.config.Config =
    com.typesafe.config.ConfigFactory.parseResources(CONFIG_FILE_NAME)

  def load(): Either[Error, Settings] = {
    for {
      trainSettings <- AppConfig.as[TrainSettings]("transport.train")
      financeSettings <- AppConfig.as[FinanceSettings]("finance")
      transportSettings = TransportSettings(trainSettings)
    } yield Settings(transportSettings, financeSettings)
  }

  implicit val UriDecoder: Decoder[Uri] = new Decoder[Uri] {
    final def apply(c: HCursor): Decoder.Result[Uri] =
      c.as[String].right.flatMap { s =>
        Uri.fromString(s).left.map { error =>
          DecodingFailure(error.message, c.history)
        }
      }
  }

  implicit val FileDecoder: Decoder[File] = new Decoder[File] {
    final def apply(c: HCursor): Decoder.Result[File] =
      c.as[String].right.flatMap { s =>
        val f = new File(s)
        if (f.exists) Right(f) else Left {
          DecodingFailure(s"$s doesn't exists", c.history)
        }
      }
  }
}
