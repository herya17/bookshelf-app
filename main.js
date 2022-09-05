const listTodo = [];
const RENDER_EVENT = "render-todo";
const KEY_STORAGE = "bookshelf-apps";
const SAVED_EVENT = "save-data";

document.addEventListener("DOMContentLoaded", () => {
    const btnBookSubmit = document.getElementById("bookSubmit");

    btnBookSubmit.addEventListener("click", (event) => {
        event.preventDefault();
        addTodo();
    });

    getDataFromStorage();
});

document.addEventListener(RENDER_EVENT, () => {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const itemTodo of listTodo) {
        const todoElement = makeTodo(itemTodo);
        if (itemTodo.bookIsComplete) {
            completeBookshelfList.append(todoElement);
        } else {
            incompleteBookshelfList.append(todoElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log("data disimpan");
});

const isStorageExist = () => {
    if (typeof Storage !== undefined) {
        return true;
    } else {
        window.alert("Browser anda tidak support web storage");
        return false;
    }
};

const getDataFromStorage = () => {
    if (isStorageExist) {
        const dataString = localStorage.getItem(KEY_STORAGE);
        const dataObject = JSON.parse(dataString);
        console.log(dataObject);

        if (dataObject !== null) {
            for (data of dataObject) {
                listTodo.push(data);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }
};

const saveDataToStorage = () => {
    if (isStorageExist) {
        const data = JSON.stringify(listTodo);
        console.log(data);
        localStorage.setItem(KEY_STORAGE, data);

        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const todoObject = (id, bookTitle, bookAuthor, bookYear, bookIsComplete) => {
    return {
        id,
        bookTitle,
        bookAuthor,
        bookYear,
        bookIsComplete,
    };
};

const findTodo = (todoId) => {
    for (const todoItem of listTodo) {
        if (todoItem.id == todoId) {
            return todoItem;
        }
    }
    return null;
};

const findTodoIndex = (todoId) => {
    for (index in listTodo) {
        if (listTodo[index].id == todoId) {
            return index;
        }
    }
    return -1;
};

const addTaskToCompleted = (id) => {
    const todoTarget = findTodo(id);

    if (todoTarget === null) return;

    todoTarget.bookIsComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
};

const undoTaskFromCompleted = (id) => {
    const todoTarget = findTodo(id);

    if (todoTarget === null) return;

    todoTarget.bookIsComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
};

const removeTask = (id) => {
    const todoTarget = findTodoIndex(id);

    if (todoTarget === -1) return;

    listTodo.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
};

const addTodo = () => {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const id = +new Date();

    const returnTodoObject = todoObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete);
    listTodo.push(returnTodoObject);

    console.log(listTodo);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
};

const makeTodo = (itemTodo) => {
    const {id, bookTitle, bookAuthor, bookYear, bookIsComplete} = itemTodo;

    const textTitle = document.createElement("h3");
    textTitle.innerText = bookTitle;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookAuthor;

    const textYear = document.createElement("p");
    textYear.innerText = bookYear;

    const containerAction = document.createElement("div");
    containerAction.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textTitle, textAuthor, textYear, containerAction);
    container.setAttribute("id", id);

    if (bookIsComplete) {
        const incompleteButton = document.createElement("button");
        incompleteButton.classList.add("green");
        incompleteButton.innerText = "Belum selesai dibaca";

        incompleteButton.addEventListener("click", () => {
            undoTaskFromCompleted(id);
        });

        containerAction.append(incompleteButton);
    } else {
        const completeButton = document.createElement("button");
        completeButton.classList.add("green");
        completeButton.innerText = "Selesai dibaca";

        completeButton.addEventListener("click", () => {
            addTaskToCompleted(id);
        });

        containerAction.append(completeButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";

    deleteButton.addEventListener("click", () => {
        const confirm = window.confirm("Anda yakin ingin menghapusnya?");
        if (confirm) {
            removeTask(id);
        }
    });

    containerAction.append(deleteButton);

    return container;
};
