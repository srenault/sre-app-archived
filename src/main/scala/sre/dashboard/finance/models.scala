package sre.dashboard.finance

import java.time.format.DateTimeFormatter
import java.time.LocalDate
import anorm._

case class Records(rules: List[RuleRecord], conditions: List[ConditionRecord], parameters: List[ParameterRecord]) {
  def parameterOrFail(id: String): ParameterRecord =
    parameters.find(_.ID == id) match {
      case Some(parameter) => parameter
      case None => sys.error(s"Unable to get parameter $id")
    }

  def conditionOrFail(id: String): ConditionRecord =
    conditions.find(_.ID == id) match {
      case Some(condition) => condition
      case None => sys.error(s"Unable to get condition $id")
    }
}

// - Rules
case class RulesGroupRecord(ID: String, name: String, active: Int, parent: String) extends RuleRecord
object RulesGroupRecord {
  implicit lazy val parser = Macro.namedParser[RulesGroupRecord]
}

case class SingleRuleRecord(ID: String, name: String, active: Int, parent: String, condition: String) extends RuleRecord
object SingleRuleRecord {
  implicit lazy val parser = Macro.namedParser[SingleRuleRecord]
}

sealed trait RuleRecord {
  def parent: String
}

object RuleRecord {
  implicit lazy val parser: RowParser[RuleRecord] = SqlParser.str("class").flatMap {
    case "LARulesGroup" => implicitly[RowParser[RulesGroupRecord]]
    case "LARule" => implicitly[RowParser[SingleRuleRecord]]
    case d => RowParser.failed[RuleRecord](Error(SqlMappingError(
      "unexpected row type \'%s\'; expected: %s".format(d, "LARulesGroup, LARule"))
    ))
  }
}

// - Condition
case class CompoundConditionRecord(ID: String, index: Int, `type`: Int, parent: Option[String]) extends ConditionRecord

object CompoundConditionRecord {
  implicit lazy val parser = Macro.namedParser[CompoundConditionRecord]
}

case class ComparisonConditionRecord(
  ID: String,
  parent: Option[String],
  index: Int,
  keypath: String,
  operator: String,
  parameter: String
) extends ConditionRecord

object ComparisonConditionRecord {
  implicit lazy val parser = Macro.namedParser[ComparisonConditionRecord]
}

sealed trait ConditionRecord {
  def ID: String
  def parent: Option[String]
}

object ConditionRecord {
  implicit lazy val parser: RowParser[ConditionRecord] = SqlParser.str("class").flatMap {
    case "LACompoundCondition" => implicitly[RowParser[CompoundConditionRecord]]
    case "LAComparisonCondition" => implicitly[RowParser[ComparisonConditionRecord]]
    case d => RowParser.failed[ConditionRecord](Error(SqlMappingError(
      "unexpected row type \'%s\'; expected: %s".format(d, "LACompoundCondition, LAComparisonCondition"))
    ))
  }
}

// - Parameter
case class StringParameterRecord(ID: String, string: String) extends ParameterRecord
object StringParameterRecord {
  implicit lazy val parser = Macro.namedParser[StringParameterRecord]
}

case class NumberParameterRecord(ID: String, number: String) extends ParameterRecord
object NumberParameterRecord {
  implicit lazy val parser = Macro.namedParser[NumberParameterRecord]
}

case class ReferenceParameterRecord(ID: String) extends ParameterRecord
object ReferenceParameterRecord {
  implicit lazy val parser = Macro.namedParser[ReferenceParameterRecord]
}

sealed trait ParameterRecord {
  def ID: String
}

object ParameterRecord {
  implicit lazy val parser: RowParser[ParameterRecord] = SqlParser.str("class").flatMap {
    case "LAStringParameter" => implicitly[RowParser[StringParameterRecord]]
    case "LANumberParameter" => implicitly[RowParser[NumberParameterRecord]]
    case "LAReferenceParameter" => implicitly[RowParser[ReferenceParameterRecord]]
    case d => RowParser.failed[ParameterRecord](Error(SqlMappingError(
      "unexpected row type \'%s\'; expected: %s".format(d, "LAStringParameter, LANumberParameter"))
    ))
  }
}

sealed trait Rule {
  def test(transaction: OfxStmTrn): Boolean
}

case class RulesGroup(id: String, name: String, rules: List[Rule]) extends Rule {

  def test(transaction: OfxStmTrn): Boolean = {

    @annotation.tailrec
    def step(rules: Seq[Rule]): Boolean =
      rules match {
        case rule :: _ if rule.test(transaction) =>
          true

        case _ :: tail =>
          step(tail)

        case Nil => false
      }

    step(rules)
  }
}

case class SingleRule(id: String, name: String, condition: Condition) extends Rule {

  def test(transaction: OfxStmTrn): Boolean =
    condition.test(transaction)
}

sealed trait ComparisonOp {
  def value: String
}

object ComparisonOp {

  def apply(s: String): ComparisonOp =
    s match {
      case s if s == Contains.value => Contains
      case s if s == BeginWith.value => BeginWith
      case s if s == Equals.value => Equals
      case s if s == LowerThan.value => LowerThan
      case s if s == GreaterThan.value => GreaterThan
      case x => sys.error(s"Unable to create ComparisonOp for $s")
    }

  case object Contains extends ComparisonOp {
    def value = "CONTAINS[cd]"
  }
  case object BeginWith extends ComparisonOp {
    def value = "BEGINSWITH[cd]"
 } 
  case object Equals extends ComparisonOp {
    def value = "="
  }
  case object LowerThan extends ComparisonOp {
    def value = "<"
  }
  case object GreaterThan extends ComparisonOp {
    def value = ">"
  }
}

sealed trait CompoundType {
  def label: String
  def value: Int
}

object CompoundType {

  def apply(i: Int): CompoundType =
    i match {
      case n if n == None.value => None
      case n if n == All.value => All
      case n if n == Any.value => Any
      case x => sys.error(s"Unable to create CompoundType for $i")
    }

  case object None extends CompoundType {
    def label = "None"
    def value = 0
  }

  case object All extends CompoundType {
    def label = "All"
    def value = 1
  }

  case object Any extends CompoundType {
    def label = "Any"
    def value = 2
  }
}

sealed trait Condition {

  def test(transaction: OfxStmTrn): Boolean
}

case class CompoundCondition(
  id: String,
  `type`: CompoundType,
  conditions: List[Condition]
) extends Condition {

  def test(transaction: OfxStmTrn): Boolean = {
    `type` match {
      case CompoundType.None =>
        conditions.forall { condition =>
          !condition.test(transaction)
        }

      case CompoundType.All =>
        conditions.forall { condition =>
          condition.test(transaction)
        }

      case CompoundType.Any =>
        conditions.exists { condition =>
          condition.test(transaction)
        }
    }
  }
}

case class ComparisonCondition(
  id: String,
  op: ComparisonOp,
  parameter: Parameter
) extends Condition {

  def test(transaction: OfxStmTrn): Boolean = {
    parameter match {
      case StringParameter(_, value) =>
        op match {
          case ComparisonOp.Contains =>
            transaction.name.contains(value)

          case ComparisonOp.BeginWith =>
            transaction.name.startsWith(value)

          case ComparisonOp.Equals =>
            transaction.name == value

          case x => sys.error(s"Unable to apply comparison $x for transaction $transaction ")
        }

      case NumberParameter(_, value) =>
        op match {
          case ComparisonOp.Equals =>
            transaction.amount == value.toFloat

          case ComparisonOp.LowerThan =>
            transaction.amount < value.toFloat

          case ComparisonOp.GreaterThan =>
            transaction.amount > value.toFloat

          case x => sys.error(s"Unable to apply comparison $x for $transaction")
        }
    }
  }
}

sealed trait Parameter
case class StringParameter(id: String, value: String) extends Parameter
case class NumberParameter(id: String, value: Int) extends Parameter

// - OFX
sealed trait OfxStrTrnType {
  def value: String
}

object OfxStrTrnType {

  def apply(s: String): OfxStrTrnType =
    if (s == "DEBIT") {
      Debit
    } else if (s == "CREDIT") {
      Credit
    } else {
      sys.error(s"Unable to parse TRNTYPE value for $s")
    }


  case object Debit extends OfxStrTrnType {
    def value = "DEBIT"
  }

  case object Credit extends OfxStrTrnType {
    def value = "CREDIT"
  }
}

case class OfxStmTrn(
  typ: OfxStrTrnType,
  posted: LocalDate,
  user: LocalDate,
  amount: Float,
  name: String
)

object OfxStmTrn {

  def load(filePath: String): List[OfxStmTrn] = {
    import com.webcohesion.ofx4j.io.DefaultHandler
    import com.webcohesion.ofx4j.io.nanoxml.NanoXMLOFXReader
    import java.io.FileInputStream
    import scala.collection.mutable.Stack

    val ofxReader = new NanoXMLOFXReader()
    val file = new FileInputStream(filePath);
    val stack = Stack.empty[List[String]]
    ofxReader.setContentHandler(new DefaultHandler() {
      override def onElement(name: String, value: String) {
        if (List("TRNTYPE", "DTPOSTED", "DTUSER", "TRNAMT", "NAME").exists(_ == name)) {
          val updated = stack.pop() :+ value
          stack.push(updated)
        }
      }

      override def startAggregate(aggregateName: String) {
        if (aggregateName == "STMTTRN") {
          stack.push(Nil)
        }
      }
    });

    ofxReader.parse(file)

    stack.map {
      case typStr :: postedStr :: userStr :: amountStr :: name :: Nil =>
        val typ = OfxStrTrnType(typStr)
        val posted = LocalDate.parse(postedStr, DateTimeFormatter.BASIC_ISO_DATE)
        val user = LocalDate.parse(userStr, DateTimeFormatter.BASIC_ISO_DATE)
        OfxStmTrn(typ, posted, user, amountStr.toFloat, name)

      case x =>
        sys.error(s"Unable to parse OfxStmTrn from $x")
    }.toList
  }
}
