// Object to store all globals on
// Increases visiblity from placing on window directly
var globals = {}

window.onload = function() {
	// Initialise globals
	globals.inputElement = document.getElementById('input')
	globals.mainElement = document.getElementById('main')
	globals.toggleAllInputElement = document.getElementById('toggleAllInput')
	globals.toggleAllLabelElement = document.getElementById('toggleAllLabel')
	globals.listElement = document.getElementById('list')
	globals.footerElement = document.getElementById('footer')
	globals.leftCountElement = document.getElementById('leftCount')
	globals.filterAllElement = document.getElementById('filterAll')
	globals.filterActiveElement = document.getElementById('filterActive')
	globals.filterCompletedElement = document.getElementById('filterCompleted')
	globals.clearCompletedElement = document.getElementById('clearCompleted')
	globals.todos = []
	globals.completedCount = 0
	globals.filter = 'none'

	// Set global event handlers
	globals.inputElement.onkeypress = inputOnKeyPress
	globals.inputElement.onblur = inputOnBlur
	globals.toggleAllLabelElement.onclick = toggleAllOnClick
	globals.filterAllElement.onclick = filterAllOnClick
	globals.filterActiveElement.onclick = filterActiveOnClick
	globals.filterCompletedElement.onclick = filterCompletedOnClick
	globals.clearCompletedElement.onclick = clearCompletedOnClick
}

// Event handlers

function inputOnKeyPress(event) {
	if (event.key !== 'Enter') return
	newToDo()
	update()
}

function inputOnBlur() {
	newToDo()
	update()
}

function toggleAllOnClick() {
	var completed = globals.completedCount !== globals.todos.length

	// Toggle all the todos that need changing
	for (var i = 0; i < globals.todos.length; i++) {
		if (globals.todos[i].completed !== completed) {
			toggleTodo(globals.todos[i])
		}
	}

	update()
}

function toggleOnClick(todo) {
	toggleTodo(todo)
	update()
}

function destroyOnClick(todo) {
	// Remove from the global todos list
	var index = globals.todos.indexOf(todo)
	globals.todos.splice(index, 1)

	// Remove the actual element
	todo.liElement.remove()

	// Update counts
	if (todo.completed) {
		globals.completedCount--
	}

	update()
}

function filterAllOnClick() {
	// Set the selected element
	globals.filterAllElement.className = 'selected'
	globals.filterActiveElement.className = ''
	globals.filterCompletedElement.className = ''

	// Update the filters elements
	globals.filter = 'none'
	update()
}

function filterActiveOnClick() {
	// Set the selected element
	globals.filterAllElement.className = ''
	globals.filterActiveElement.className = 'selected'
	globals.filterCompletedElement.className = ''

	// Update the filters elements
	globals.filter = 'completed'
	update()
}

function filterCompletedOnClick() {
	// Set the selected element
	globals.filterAllElement.className = ''
	globals.filterActiveElement.className = ''
	globals.filterCompletedElement.className = 'selected'

	// Update the filters elements
	globals.filter = 'notCompleted'
	update()
}

function clearCompletedOnClick() {
	for (var i = 0; i < globals.todos.length; i++) {
		var todo = globals.todos[i]
		if (!todo.completed) continue

		// Remove from the global todos list
		var index = globals.todos.indexOf(todo)
		globals.todos.splice(index, 1)

		// Remove the actual element
		todo.liElement.remove()

		// Decrement completedCount
		globals.completedCount--
	}

	update()
}

// Actions

function newToDo() {
	// Take the description from the input
	var description = globals.inputElement.value
	if (description === "") return

	// Clear out the input element
	globals.inputElement.value = ""

	// Add the new todo item's elements
	var liElement = document.createElement('li')
	var viewElement = document.createElement('div')
	var toggleElement = document.createElement('input')
	var labelElement = document.createElement('label')
	var buttonElement = document.createElement('button')
	viewElement.className = 'view'
	toggleElement.className = 'toggle'
	toggleElement.type = 'checkbox'
	labelElement.textContent = description
	buttonElement.className = 'destroy'
	viewElement.appendChild(toggleElement)
	viewElement.appendChild(labelElement)
	viewElement.appendChild(buttonElement)
	liElement.appendChild(viewElement)
	globals.listElement.appendChild(liElement)

	// Create a todo item 
	var todo = {
		completed: false,
		visible: true,
		liElement: liElement,
		toggleElement: toggleElement,
	}

	// Update the globals
	globals.todos.push(todo)

	// Add event handlers
	toggleElement.onclick = function() { toggleOnClick(todo) }
	buttonElement.onclick = function() { destroyOnClick(todo) }
}

function toggleTodo(todo) {
	var completed = !todo.completed

	// Update the list elements
	todo.liElement.className = completed ? 'completed' : null
	todo.toggleElement.checked = completed
	todo.completed = completed

	// Update the count
	globals.completedCount += (completed ? 1 : -1)
}

function update() {
	// Main and footer visibility
	globals.mainElement.className = 'main' + (globals.todos.length > 0 ? '' : ' hidden')
	globals.footerElement.className = 'footer' + (globals.todos.length > 0 ? '' : ' hidden')

	// ToggleAll checkbox checked
	globals.toggleAllInputElement.checked = globals.completedCount === globals.todos.length

	// Items left count
	var left = globals.todos.length - globals.completedCount
	globals.leftCountElement.textContent = left.toString() + ' items left'

	// ClearCompleted button visibility
	globals.clearCompletedElement.className = 'clear-completed' + (globals.completedCount > 0 ? '' : ' hidden')

	// Apply the filter
	for (var i = 0; i < globals.todos.length; i++) {
		var todo = globals.todos[i]
		if (
			(globals.filter === 'none' && !todo.visible) ||
			(globals.filter === 'completed' && todo.completed === todo.visible) ||
			(globals.filter === 'notCompleted' && todo.completed !== todo.visible) 
		) {
			todo.liElement.className = todo.visible ? 'hidden' : ''
			todo.visible = !todo.visible
		}
	}
}
