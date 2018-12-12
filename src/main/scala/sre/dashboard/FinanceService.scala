package sre.dashboard

import cats.effect._
import org.http4s._
import org.http4s.dsl.Http4sDsl
import finance._

class FinanceService[F[_]: Effect](icomptaClient: IComptaClient[F], settings: Settings) extends Http4sDsl[F] {

  private def buildConditionsTree(records: Records, conditionRecord: ConditionRecord): Condition = {
    conditionRecord match {
      case c: CompoundConditionRecord =>
        val typ = CompoundType(c.`type`)
        val childrenRecords = records.conditions.filter(_.parent.exists(parentId => parentId == c.ID))
        val children = childrenRecords.map(buildConditionsTree(records, _))
        CompoundCondition(c.ID, typ, children)

      case c: ComparisonConditionRecord =>
        val op = ComparisonOp(c.operator)
        val parameter = records.parameterOrFail(c.parameter) match {
          case StringParameterRecord(id, string) =>
            StringParameter(id, string)

          case NumberParameterRecord(id, number) =>
            NumberParameter(id, number.toInt)

          case ReferenceParameterRecord(id) =>
            sys.error("Unsupported reference parameter record")
        }

        ComparisonCondition(c.ID, op, parameter)
    }
  }

  private def buildTree(records: Records, ruleRecord: RuleRecord): Rule = {
    ruleRecord match {
      case RulesGroupRecord(id, name, active, _) if active == 1 =>
        val children = records.rules.filter(_.parent == id).map(buildTree(records, _))
        RulesGroup(id, name, children)

      case SingleRuleRecord(id, name, active, parent, conditionId) if active == 1 =>
        val conditionRecord = records.conditionOrFail(conditionId)
        val condition = buildConditionsTree(records, conditionRecord)
        SingleRule(id, name, condition)
    }
  }

  val service: HttpService[F] = {
    HttpService[F] {
      case GET -> Root =>
        val records = icomptaClient.selectAll()
        records.rules.collectFirst {
          case r: RulesGroupRecord if r.name == "Shopping" =>
            val rulesTree = buildTree(records, r)
            val transactions = OfxStmTrn.load("/Users/sre/srebox/credit_mutuel/transactions/3719100010480201/2018-12-01.ofx")
            val res = transactions.sortBy(-_.posted.toEpochDay).foldLeft(0F) { (acc, transaction) =>
              if (rulesTree.test(transaction)) {
                println(s"PASSED ${transaction.name} | ${transaction.amount} | ${rulesTree.test(transaction)}")
                acc + transaction.amount
              } else {
                println(s"NOT PASSED ${transaction.name} | ${transaction.amount} | ${rulesTree.test(transaction)}")
                acc
              }
            }
            println(s"""#########> $res""")
        }
        Ok()
    }
  }
}
