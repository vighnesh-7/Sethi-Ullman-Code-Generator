'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { constructTree, labelTree, generateIntermediateCode, generateObjectCode } from '@/lib/sethi-ullman'
import TreeVisualization from './components/tree-visualization'

export default function Home() {
  const [expression, setExpression] = useState('')
  const [intermediateCode, setIntermediateCode] = useState<string[]>([])
  const [objectCode, setObjectCode] = useState<string[]>([])
  const [registersNeeded, setRegistersNeeded] = useState(0)
  const [tree, setTree] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('intermediate')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && e.altKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const processExpression = () => {
    if (!expression) {
      alert('Please enter an arithmetic expression.')
      return
    }

    try {
      const equalNode = { value: '=', left: { value: 'x', left: null, right: null, label: 1 }, right: null, label: 0 }
      const expressionTree = constructTree(expression)
      equalNode.right = expressionTree 
      const newTree = equalNode
      const registers = labelTree(newTree)
      const intermediate = generateIntermediateCode(expressionTree, { counter: 1 })
      const object = generateObjectCode(expressionTree)

      setTree(newTree)
      setRegistersNeeded(Math.max(2, registers))
      setIntermediateCode(intermediate.code)
      setObjectCode(object.code)
    } catch (error : any) {
      alert(`Invalid expression: ${error.message}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processExpression()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Sethi-Ullman Code Generator</h1>
      <div className="mb-4">
        <Label htmlFor="expression " className='font-semibold text-base '>Enter Arithmetic Expression:</Label>
        <div className="flex gap-10 mt-3">
          <Input
            id="expression"
            ref={inputRef}
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., a+b*c-d"
            className='border-2 border-gray-300 rounded-md p-2 w-full bg-gray-50 focus:outline-none focus:border-orange-700 focus:ring-4 focus:ring-blue-500 focus:border-transparent  '
          />
          <Button onClick={processExpression}>Generate Code</Button>
        </div>
      </div>
      <div className="flex justify-center mt-8 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl ">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-700 text-white h-10 ">
            <TabsTrigger value="intermediate" className={activeTab === 'intermediate' ? 'bg-blue-500 text-white font-semibold' : 'font-semibold '}>Intermediate Code</TabsTrigger>
            <TabsTrigger value="object" className={activeTab === 'object' ? 'bg-blue-500 text-white font-semibold' : 'font-semibold'}>Object Code</TabsTrigger>
            <TabsTrigger value="tree" className={activeTab === 'tree' ? 'bg-blue-500 text-white font-semibold' : 'font-semibold'}>Tree Visualization</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="intermediate">
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {intermediateCode.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </pre>
              </TabsContent>
              <TabsContent value="object">
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {objectCode.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  {objectCode.length > 0 && (
                    <div>The final expression is in Register R1</div>
                  )}
                </pre>
              </TabsContent>
              <TabsContent value="tree" className='mx-auto flex items-center justify-center'>
                <TreeVisualization tree={tree} expression={expression} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
      <div className="mt-4 text-center flex items-center justify-center gap-5">
        <Label className='font-semibold text-lg'>Registers Required :</Label>
        <p className="text-lg font-bold">{registersNeeded}</p>
      </div>
    </div>
  )
}

