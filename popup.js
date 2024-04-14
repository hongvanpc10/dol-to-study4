window.addEventListener('DOMContentLoaded', () => {
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		tabs => {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ from: 'popup', subject: 'data' },
				data => {
					const root = document.getElementById('root')

					if (!data) {
						const message = document.createElement('p')
						message.textContent = 'No data found'
						root.appendChild(message)
						return
					}

					const selections = document.createElement('div')

					const output = document.createElement('textarea')
					output.id = 'output'
					output.rows = 10

					const copyButton = document.createElement('button')
					copyButton.id = 'copy'
					copyButton.textContent = 'Copy'

					root.appendChild(selections)
					root.appendChild(output)
					root.appendChild(copyButton)

					for (section in data) {
						selections.innerHTML += `
							<div class="checkbox">
								<input id="${section}" type="checkbox" checked="true">
								<label for="flexCheckChecked" class="truncate" for="${section}">
								${section}
								</label>
							</div>
						`
					}

					const selectedSections = Object.keys(data).map(() => true)

					output.value = transform(selectedSections)

					function transform(selectedSections) {
						const transformedData = []
						selectedSections.forEach((selected, i) => {
							if (selected) {
								for (let item of data[Object.keys(data)[i]]) {
									transformedData.push([
										item.word,
										item.meaning,
										item.example,
										'',
										item.phonetic,
										'',
									])
								}
							}
						})
						return `jspreadsheet.destroy(document.getElementById("bulk-flashcards-table"),!1),document.getElementById("bulk-flashcards-table").innerHTML="";var FLASHCARDS_TABLE=jspreadsheet(document.getElementById("bulk-flashcards-table"),{data:${JSON.stringify(
							transformedData
						)},columns:[{name:"name",title:"Từ mới",width:100},{name:"definition",title:"Định nghĩa",width:200},{name:"example1",title:"Ví dụ 1",width:220},{name:"example2",title:"Ví dụ 2",width:220},{name:"pronunciation",title:"Phiên âm",width:80},{name:"note",title:"Ghi chú",width:110},],defaultColAlign:"left",columnSorting:!1,onEnter:"edit",allowInsertColumn:!1,allowManualInsertColumn:!1});`
					}

					const checkboxes = root.querySelectorAll(
						'input[type="checkbox"]'
					)

					checkboxes.forEach((checkbox, index) => {
						checkbox.addEventListener('change', event => {
							if (event.target.checked) {
								selectedSections[index] = true
							} else {
								selectedSections[index] = false
							}
							output.value = transform(selectedSections)
						})
					})

					copyButton.addEventListener('click', () => {
						navigator.clipboard.writeText(output.value)
					})
				}
			)
		}
	)
})
