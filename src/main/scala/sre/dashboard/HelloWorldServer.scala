package sre.dashboard

import cats.effect._
import cats.implicits._
import org.http4s.server.blaze.BlazeBuilder
import org.http4s.client._
import org.http4s.client.blaze._

import scala.concurrent.ExecutionContext

import transport.train.TrainClient

object HelloWorldServer extends IOApp {
  import scala.concurrent.ExecutionContext.Implicits.global

  def run(args: List[String]) =
    ServerStream.stream[IO].compile.drain.as(ExitCode.Success)
}

object ServerStream {

  def helloWorldService[F[_]: Effect] = new HelloWorldService[F].service

  def trainService[F[_]: Effect](trainClient: TrainClient[F], settings: Settings) =
    new TrainService[F](trainClient, settings).service

  def stream[F[_]: ConcurrentEffect](implicit ec: ExecutionContext) = {
    Settings.load() match {
      case Right(settings) =>
        for {
          httpClient <- Http1Client.stream[F]()
          trainClient <- TrainClient.stream[F](httpClient, settings)
          R <- BlazeBuilder[F].bindHttp(8080, "0.0.0.0")
                              .mountService(helloWorldService, "/")
                              .mountService(trainService(trainClient, settings), "/api/transport/")
                              .serve
        } yield R

      case Left(error) =>
        sys.error(s"Malformed configuration file $error")
    }
  }
}
