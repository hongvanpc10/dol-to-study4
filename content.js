window.addEventListener('load', () => {
	const sections = document.querySelectorAll('[class^=SectionOfContent]')
	const data = []
	sections.forEach(section => {
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
			data.push([word, meaning, example, '', phonetic, ''])
		})
	})

	output = `jspreadsheet.destroy(document.getElementById('bulk-flashcards-table'), false)
document.getElementById('bulk-flashcards-table').innerHTML = ''
var FLASHCARDS_TABLE = jspreadsheet(
	document.getElementById('bulk-flashcards-table'),
	{
		data: ${JSON.stringify(data)},
		columns: [
			{ name: 'name', title: 'Từ mới', width: 100 },
			{ name: 'definition', title: 'Định nghĩa', width: 200 },
			{ name: 'example1', title: 'Ví dụ 1', width: 220 },
			{ name: 'example2', title: 'Ví dụ 2', width: 220 },
			{ name: 'pronunciation', title: 'Phiên âm', width: 80 },
			{ name: 'note', title: 'Ghi chú', width: 110 },
		],
		defaultColAlign: 'left',
		columnSorting: false,
		onEnter: 'edit',
		allowInsertColumn: false,
		allowManualInsertColumn: false,
	}
)
`

	const copyButton = document.createElement('button')
	copyButton.innerText = 'Copy to clipboard'
	copyButton.id = 'copy-button'
	copyButton.addEventListener('click', () => {
		navigator.clipboard.writeText(output)
	})

	document.body.appendChild(copyButton)
})
