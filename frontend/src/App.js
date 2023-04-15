import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

function App() {

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}
		const pay = {
			'amount' : '399' ,
			'currency': 'INR'
		}
		const data = await fetch('http://localhost:1337/razorpay', { 
			method: 'POST' ,
			headers: {
				'Content-Type': 'application/json'
				} ,
			body: JSON.stringify(pay)
			
			}).then((t) =>
			t.json()
		)

		console.log(data)

		const options = {
			key: "rzp_test_pArzkECCmjDBSB",
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://localhost:1337/logo.svg',
			handler: async function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
				const verif = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
			t.json())
				console.log(verif)
			},
			prefill: {
				email: 'sdfdsjfh2@ndsfdf.com',
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<button
					className="App-link"
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
				>
					Donate $5
				</button>
			</header>
		</div>
	)
}

export default App
