package sre.dashboard.finance

import scala.concurrent.duration._
import cats.effect._
import scalacache._
import scalacache.guava._
import scalacache.CatsEffect.modes._
import com.google.common.cache.CacheBuilder

object CMBalanceCache {

  private val TTL = 15.minutes

  private val cache: Cache[Float] = {
    val underlying = CacheBuilder.newBuilder().maximumSize(10L).build[String, Entry[Float]]
    GuavaCache(underlying)
  }

  def cached[F[_]: ConcurrentEffect](accountId: String)(f: => F[Float]): F[Float] = {
    cache.cachingF(accountId)(ttl = Some(TTL))(f)
  }
}

object CMDownloadFormCache {

  private val TTL = 1.days

  private val KEY = "downloadForm"

  private val cache: Cache[CMDownloadForm] = {
    val underlying = CacheBuilder.newBuilder().maximumSize(1L).build[String, Entry[CMDownloadForm]]
    GuavaCache(underlying)
  }

  def cached[F[_]: ConcurrentEffect](f: => F[CMDownloadForm]): F[CMDownloadForm] = {
    cache.cachingF(KEY)(ttl = Some(TTL))(f)
  }
}
