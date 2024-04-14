chrome.runtime.sendMessage({
	from: 'content',
	subject: 'showPageAction',
})

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	if (msg.from === 'popup' && msg.subject === 'data') {
		const sections = document.querySelectorAll('[class^=SectionOfContent]')

		const data = {}
		sections.forEach(section => {
			const heading = section.querySelector('h2 span').textContent.trim()
			const vocabList = section.querySelectorAll('.vocab-list > *')
			vocabList.forEach(vocab => {
				const word = vocab
					.querySelector('.vocab-phonetics span')
					.innerText.trim()
				const phonetic = vocab
					.querySelector('.phonetics-container span')
					.innerText.trim()
				const meaning = vocab
					.querySelector('.word-meaning-text div:first-child span')
					.innerText.trim()
				const example = vocab
					.querySelector('.word-meaning-text div:last-child span')
					.innerText.trim()
				if (!data[heading]) {
					data[heading] = []
				}
				data[heading].push({
					word,
					phonetic,
					meaning,
					example,
				})
			})
		})

		response(data)
	}
})
