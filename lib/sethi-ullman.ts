class Node {
    value: string
    left: Node | null
    right: Node | null
    label: number
  
    constructor(value: string) {
      this.value = value
      this.left = null
      this.right = null
      this.label = 0
    }
  }
  
  export function constructTree(expression: string): Node {
    const precedence = (op: string): number => {
      if (op === '+' || op === '-') return 1
      if (op === '*' || op === '/') return 2
      return 0
    }
  
    const applyOperator = (operators: string[], operands: Node[]): void => {
      const operator = operators.pop()!
      const right = operands.pop()!
      const left = operands.pop()!
      const node = new Node(operator)
      node.left = left
      node.right = right
      operands.push(node)
    }
  
    const operators: string[] = []
    const operands: Node[] = []
    let i = 0
  
    while (i < expression.length) {
      const ch = expression[i]
  
      if (ch.match(/[a-z0-9]/i)) {
        operands.push(new Node(ch))
      } else if (ch === '(') {
        operators.push(ch)
      } else if (ch === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          applyOperator(operators, operands)
        }
        operators.pop() // Remove '('
      } else {
        while (operators.length && precedence(operators[operators.length - 1]) >= precedence(ch)) {
          applyOperator(operators, operands)
        }
        operators.push(ch)
      }
      i++
    }
  
    while (operators.length) {
      applyOperator(operators, operands)
    }
  
    return operands[0]
  }
  
  export function labelTree(node: Node, isRightChild: boolean = false): number {
    if (!node.left && !node.right) {
      node.label = isRightChild ? 0 : 1
      return node.label
    }
  
    const leftLabel = labelTree(node.left!, false)
    const rightLabel = labelTree(node.right!, true)
  
    node.label = Math.max(leftLabel, rightLabel) + (leftLabel === rightLabel ? 1 : 0)
    return node.label
  }
  
  interface CodeResult {
    code: string[]
    result: string
  }
  
  export function generateIntermediateCode(node: Node, tempCounter: { counter: number }): CodeResult {
    if (!node.left && !node.right) {
      return { code: [], result: node.value }
    }
  
    const leftCode = generateIntermediateCode(node.left!, tempCounter)
    const rightCode = generateIntermediateCode(node.right!, tempCounter)
  
    const temp = `t${tempCounter.counter}`
    tempCounter.counter++
    const code = [
      ...leftCode.code,
      ...rightCode.code,
      `${temp} = ${leftCode.result} ${node.value} ${rightCode.result}`,
    ]
  
    return { code, result: temp }
  }
  
  export function generateObjectCode(node: Node): CodeResult {
    if (!node.left && !node.right) {
      return { code: [`MOV R1, ${node.value}`], result: 'R1' }
    }
  
    const leftCode = generateObjectCode(node.left!)
    const rightCode = generateObjectCode(node.right!)
  
    let operation: string
    switch (node.value) {
      case '+': operation = 'ADD'; break
      case '-': operation = 'SUB'; break
      case '*': operation = 'MUL'; break
      case '/': operation = 'DIV'; break
      default: operation = 'MOV'
    }
  
    const code = [
      ...leftCode.code,
      `MOV R2, R1`,
      ...rightCode.code,
      `${operation} R2, R1`,
      `MOV R1, R2`
    ]
  
    return { code, result: 'R1' }
  }
  
  