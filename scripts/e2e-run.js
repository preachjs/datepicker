#!/usr/bin/env node
import { spawn } from 'node:child_process'
import wait from 'wait-on'

const serverRun = spawn('npm', ['run', 'example:dev'], { stdio: 'pipe' })
serverRun.stdout.pipe(process.stdout)
serverRun.stderr.pipe(process.stderr)

serverRun.on('error', err => {
  console.error('Failed to start server with error', err)
  process.exit(1)
})

console.log('Waiting for server to start on :8000')
await wait({
  resources: ['http://127.0.0.1:8000/'],
})
console.log('Server found')

const cypressProcess = spawn('npx', ['cypress', 'run'], { stdio: 'pipe' })
cypressProcess.stdout.pipe(process.stdout)
cypressProcess.stderr.pipe(process.stderr)

cypressProcess.on('exit', () => {
  serverRun.kill('SIGTERM')
  process.exit(0)
})
