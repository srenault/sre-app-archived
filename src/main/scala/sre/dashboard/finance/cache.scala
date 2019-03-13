package sre.dashboard.finance

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import scala.concurrent.duration._
import cats.effect._
import cats.implicits._
import scalacache._
import scalacache.guava._
import scalacache.CatsEffect.modes._
import com.google.common.cache.CacheBuilder

case class CMBalancesCache(ttl: FiniteDuration) {

  private val cache: Cache[Float] = {
    val underlying = CacheBuilder.newBuilder().maximumSize(10L).build[String, Entry[Float]]
    GuavaCache(underlying)
  }

  def cached[F[_]: ConcurrentEffect](accountId: String)(f: => F[Float]): F[Float] = {
    cache.cachingF(accountId)(ttl = Some(ttl))(f)
  }
}

case class CMDownloadFormCache(ttl: FiniteDuration) {

  private val KEY = "downloadForm"

  private val cache: Cache[CMDownloadForm] = {
    val underlying = CacheBuilder.newBuilder().maximumSize(1L).build[String, Entry[CMDownloadForm]]
    GuavaCache(underlying)
  }

  def cached[F[_]: ConcurrentEffect](f: => F[CMDownloadForm]): F[CMDownloadForm] = {
    cache.cachingF(KEY)(ttl = Some(ttl))(f)
  }

  def set[F[_]: ConcurrentEffect](form: CMDownloadForm): F[Unit] = {
    cache.put(KEY)(form, Some(ttl)).map(_ => Unit)
  }
}

case class CMOfxExportCache(ttl: FiniteDuration) {

  private val dateFormat = DateTimeFormatter.ISO_LOCAL_DATE

  private val cache: Cache[List[OfxStmTrn]] = {
    val underlying = CacheBuilder.newBuilder().maximumSize(30L).build[String, Entry[List[OfxStmTrn]]]
    GuavaCache(underlying)
  }

  private def key(accountId: String, startDate: Option[LocalDate], endDate: Option[LocalDate]): String =
    List(Some(accountId), startDate.map(_.format(dateFormat)), endDate.map(_.format(dateFormat))).flatten.mkString("#")

  def cached[F[_]: ConcurrentEffect](accountId: String, startDate: Option[LocalDate], endDate: Option[LocalDate])(f: => F[List[OfxStmTrn]]): F[List[OfxStmTrn]] = {
    cache.cachingF(key(accountId, startDate, endDate))(ttl = Some(ttl))(f)
  }
}

case class CMCsvExportCache(ttl: FiniteDuration) {

  private val dateFormat = DateTimeFormatter.ISO_LOCAL_DATE

  private val cache: Cache[List[CMCsvRecord]] = {
    val underlying = CacheBuilder.newBuilder().maximumSize(30L).build[String, Entry[List[CMCsvRecord]]]
    GuavaCache(underlying)
  }

  private def key(accountId: String, startDate: Option[LocalDate], endDate: Option[LocalDate]): String =
    List(Some(accountId), startDate.map(_.format(dateFormat)), endDate.map(_.format(dateFormat))).flatten.mkString("#")

  def cached[F[_]: ConcurrentEffect](accountId: String, startDate: Option[LocalDate], endDate: Option[LocalDate])(f: => F[List[CMCsvRecord]]): F[List[CMCsvRecord]] = {
    cache.cachingF(key(accountId, startDate, endDate))(ttl = Some(ttl))(f)
  }
}
