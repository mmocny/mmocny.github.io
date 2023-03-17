import React from 'react'

// To be honest, I dont know why I need to add these myself
declare module 'react' {
	function use<T>(promise: Promise<T> | React.Context<T>): T
	function cache<T extends Function>(fn: T): T
}