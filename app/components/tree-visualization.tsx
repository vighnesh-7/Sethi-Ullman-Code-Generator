'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TreeVisualizationProps {
  tree: any
  expression: string
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ tree, expression }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (tree && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#99f6e4'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        drawTree(tree, 400, 80, 200, ctx)
      }
    }
  }, [tree, expression])

  const drawTree = (node: any, x: number, y: number, dx: number, ctx: CanvasRenderingContext2D) => {
    if (!node) return

    ctx.font = '18px Arial'

    if (node.left) {
      drawArrow(ctx, x, y, x - dx, y + 80)
      drawTree(node.left, x - dx, y + 80, dx / 2, ctx)
    }

    if (node.right) {
      drawArrow(ctx, x, y, x + dx, y + 80)
      drawTree(node.right, x + dx, y + 80, dx / 1.5, ctx)
    }

    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    ctx.fillStyle = node.value === '=' ? '#FFD700' : '#e9e9af'
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.stroke()

    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.value, x, y)
    ctx.fillStyle = 'red'
    ctx.fillText(`(${node.label})`, x, y + 25)

    if (node === tree) {
      ctx.fillStyle = 'black'
      ctx.fillText('Root', x, y - 30)
    }
  }

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 10
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
    ctx.strokeStyle = '#666666'
    ctx.stroke()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} width={1000} height={600} className="border border-gray-300 rounded-md" />
    </motion.div>
  )
}

export default TreeVisualization

