(function(window) {
    'use strict';

    const todoContainer = document.querySelector('[data-todoContainer]');
    const createTodoForm = document.querySelector('[data-todoForm]');
    const resetTodoButton = document.querySelector('[data-resetButton]');
    const deleteListButton = document.querySelector('[data-deleteButton]');
    const undoDeleteButton = document.querySelector('[data-undoDeleteButton]');
    const todoField = document.querySelector('[data-todoField]');

    let lastIdCreated = 0;

    const model = {
        getData: function() {
            const currentData = localStorage.getItem('data');
            return JSON.parse(currentData);
        },
        setData: function() {
            localStorage.setItem('data', JSON.stringify(controller.data));
        }
    }

    const controller = {
        data: {},
        sendData: function(object) {
            if (object) {
                this.data[object.id] = object;
                view.populateTodos();
            }

            model.setData();
        },
        setData: function() {
            const dataReturned = model.getData();

            if (dataReturned && (Object.keys(dataReturned).length > 0)) {
                const dataReturnedKeys = Object.keys(dataReturned)
                const lastIdUsed = dataReturnedKeys[dataReturnedKeys.length - 1];
                controller.data = dataReturned;
                lastIdCreated = dataReturned[lastIdUsed].id;
                
                view.populateTodos();
            }
        },
        resetTodos: function() {
            Object.keys(controller.data).forEach(function(key, i) {
                controller.data[key].completed = false;
            });
            
            model.setData();
            view.populateTodos();
        }
    }

    const view = {
        createTodo: function(e) {
            e.preventDefault();

            if (todoField.value.replace(/\s/g, '') === '') {
                return;
            }

            lastIdCreated += 1;

            const todoCreated = {
                id: lastIdCreated,
                todo: todoField.value,
                completed: false
            }

            controller.sendData(todoCreated);

            todoField.value = '';
        },
        toggleButtons: function(listDeleted) {
            const dataLength = Object.keys(controller.data).length;
            
            if (dataLength > 0) {
                deleteListButton.classList.remove('hide');
            } else {
                deleteListButton.classList.add('hide');
            }

            // if (listDeleted && (dataLength === 0)) {
            //     undoDeleteButton.classList.remove('hide');
            // } else {
            //     undoDeleteButton.classList.add('hide');
            // }
        },
        toggleTodoComplete: function(e) {
            const targetTodoParent = e.currentTarget.parentNode;
            const todoId = targetTodoParent.dataset.todoid;

            targetTodoParent.classList.toggle('complete');

            controller.data[todoId].completed = !controller.data[todoId].completed;

            controller.sendData();
        },
        deleteList: function() {
            todoContainer.innerHTML = '';

            controller.data = {};
            controller.sendData();

            view.toggleButtons();
        },
        deleteTodo: function(e) {
            const clickedTodo = e.currentTarget;
            
            clickedTodo.parentNode.parentNode.removeChild(clickedTodo.parentNode);
            delete controller.data[clickedTodo.parentNode.dataset.todoid];

            controller.sendData();
        },
        createTodoElement: function(data) {
            const todoWrapper = document.createElement('div');
            const isCompleteElement = document.createElement('div');
            const deleteElement = document.createElement('span');
            const todoText = document.createElement('div');
            const editTodoInput = document.createElement('input');

            todoWrapper.classList.add('todo-wrapper');
            isCompleteElement.classList.add('is-complete');
            deleteElement.classList.add('delete-todo');
            todoText.classList.add('todo-text');
            editTodoInput.classList.add('edit-todo-input');

            if (data.completed) {
                todoWrapper.classList.add('complete');
            }

            todoWrapper.setAttribute('data-todoId', data.id);
            todoText.innerText = data.todo;
            deleteElement.innerText = '❌';

            deleteElement.addEventListener('click', this.deleteTodo);
            isCompleteElement.addEventListener('click', this.toggleTodoComplete);

            isCompleteElement.appendChild(editTodoInput);
            isCompleteElement.appendChild(todoText);
            todoWrapper.appendChild(deleteElement);
            todoWrapper.appendChild(isCompleteElement);
            
            return todoWrapper;
        },
        populateTodos: function() {
            let todoFragment = document.createDocumentFragment();

            todoContainer.innerHTML = '';

            let that = this;
            Object.keys(controller.data).forEach(function(key, i) {
                const todoElement = that.createTodoElement(controller.data[key]);

                todoFragment.appendChild(todoElement);
            });

            todoContainer.appendChild(todoFragment);

            view.toggleButtons();
        }
    }

    window.addEventListener('load', controller.setData);
    createTodoForm.addEventListener('submit', view.createTodo);
    resetTodoButton.addEventListener('click', controller.resetTodos);
    deleteListButton.addEventListener('click', view.deleteList);
})(window);