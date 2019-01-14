package sre.dashboard

import cats.effect._
import cats.implicits._
import org.http4s.server.blaze.BlazeBuilder
import org.http4s.client.blaze._
import transport.train.TrainClient
import transport.subway.SubwayClient
import finance.IComptaClient
import domoticz.DomoticzClient

object DashboardServer extends IOApp {

  def run(args: List[String]) =
    ServerStream.stream[IO].compile.drain.as(ExitCode.Success)
}

object ServerStream {

  def trainService[F[_]: Effect](trainClient: TrainClient[F], settings: Settings) =
    new TrainService[F](trainClient, settings).service

  def subwayService[F[_]: Effect](subwayClient: SubwayClient[F], settings: Settings) =
    new SubwayService[F](subwayClient, settings).service

  def financeService[F[_]: Effect](icomptaClient: IComptaClient[F], settings: Settings) =
    new FinanceService[F](icomptaClient, settings).service

  def energyService[F[_]: Effect](domoticzClient: DomoticzClient[F], settings: Settings) =
    new EnergyService[F](domoticzClient, settings).service

  def stream[F[_]: ConcurrentEffect] = {
    Settings.load() match {
      case Right(settings) =>
        for {
          httpClient <- Http1Client.stream[F]()
          trainClient <- TrainClient.stream[F](httpClient, settings)
          subwayClient = SubwayClient[F](trainClient)
          icomptaClient <- IComptaClient.stream[F](settings)
          domoticzClient = DomoticzClient[F](httpClient, settings.domoticz)
          R <- BlazeBuilder[F].bindHttp(8080, "0.0.0.0")
                              .mountService(trainService(trainClient, settings), "/api/transport/train")
                              .mountService(subwayService(subwayClient, settings), "/api/transport/subway")
                              .mountService(financeService(icomptaClient, settings), "/api/finance")
                              .mountService(energyService(domoticzClient, settings), "/api/energy")
                              .serve
        } yield R

      case Left(error) =>
        sys.error(s"Malformed configuration file $error")
    }
  }
}
